"""Mood-based recommendation engine with GTZAN cluster support."""

from __future__ import annotations

import logging
from typing import Any

from ml.clustering import get_clustering_model

logger = logging.getLogger(__name__)

GENRE_TO_CATEGORY = {
    "pop": "happy",
    "rock": "workout",
    "classical": "sad",
    "jazz": "study",
    "dance": "party",
}

CATEGORY_CONSTRAINTS = {
    "happy": {"genre": "Pop", "tempo": "Fast", "energy": "High"},
    "sad": {"genre": "Classical", "tempo": "Slow", "energy": "Low"},
    "study": {"genre": "Jazz", "tempo": "Medium", "energy": "Medium"},
    "workout": {"genre": "Rock", "tempo": "Fast", "energy": "High"},
    "party": {"genre": "Dance", "tempo": "Very Fast", "energy": "High"},
}

DUMMY_SONGS = {
    "happy": [
        {"id": "pop-1", "title": "Sunshine Pop", "artist": "Moodify", "genre": "Pop", "duration": "3:18", "emoji": "sun", "color": "#3d2800"},
        {"id": "pop-2", "title": "Bright Lights", "artist": "Moodify", "genre": "Pop", "duration": "3:31", "emoji": "star", "color": "#2d1b69"},
        {"id": "pop-3", "title": "Golden Hour Groove", "artist": "Moodify", "genre": "Pop", "duration": "3:42", "emoji": "sun", "color": "#3b2f0a"},
    ],
    "sad": [
        {"id": "classical-1", "title": "Moonlit Symphony", "artist": "Moodify Orchestra", "genre": "Classical", "duration": "4:51", "emoji": "moon", "color": "#0d1b2a"},
        {"id": "classical-2", "title": "Quiet Echoes", "artist": "Moodify Orchestra", "genre": "Classical", "duration": "4:08", "emoji": "piano", "color": "#1a1a2e"},
        {"id": "classical-3", "title": "Gentle Rain Piano", "artist": "Moodify Orchestra", "genre": "Classical", "duration": "5:02", "emoji": "rain", "color": "#0f3460"},
    ],
    "study": [
        {"id": "jazz-1", "title": "Midnight Jazz Notes", "artist": "Moodify Trio", "genre": "Jazz", "duration": "4:20", "emoji": "jazz", "color": "#2b1b00"},
        {"id": "jazz-2", "title": "Coffeehouse Calm", "artist": "Moodify Trio", "genre": "Jazz", "duration": "3:55", "emoji": "coffee", "color": "#1c241b"},
        {"id": "jazz-3", "title": "Focus Flow", "artist": "Moodify Trio", "genre": "Jazz", "duration": "5:06", "emoji": "music", "color": "#0f291e"},
    ],
    "workout": [
        {"id": "rock-1", "title": "Power Drive", "artist": "Moodify", "genre": "Rock", "duration": "3:46", "emoji": "bolt", "color": "#3b120c"},
        {"id": "rock-2", "title": "Steel Mountain", "artist": "Moodify", "genre": "Rock", "duration": "4:11", "emoji": "guitar", "color": "#111111"},
        {"id": "rock-3", "title": "Rush Hour", "artist": "Moodify", "genre": "Rock", "duration": "3:38", "emoji": "fire", "color": "#330a0a"},
    ],
    "party": [
        {"id": "dance-1", "title": "Neon Dance Beat", "artist": "Moodify", "genre": "Dance", "duration": "3:27", "emoji": "dance", "color": "#2c143d"},
        {"id": "dance-2", "title": "Night Pulse", "artist": "Moodify", "genre": "Dance", "duration": "3:54", "emoji": "party", "color": "#36113b"},
        {"id": "dance-3", "title": "Afterparty Energy", "artist": "Moodify", "genre": "Dance", "duration": "4:04", "emoji": "star", "color": "#381c1c"},
    ],
}


def _detect_mood_category(mood_text: str) -> str:
    """Fallback category for a request when no Gemini constraints are supplied."""
    text = mood_text.lower().strip()
    if any(word in text for word in ("gym", "workout", "exercise", "training", "running", "fitness")):
        return "workout"
    if any(word in text for word in ("party", "dance", "club", "celebration")):
        return "party"
    if any(word in text for word in ("study", "focus", "exam", "reading", "learn", "homework")):
        return "study"
    if any(word in text for word in ("sad", "lonely", "tired", "upset", "stress", "depressed", "calm", "relax")):
        return "sad"
    return "happy"


def _genre_key(value: str | None) -> str:
    return str(value or "").strip().lower()


def _recommend_from_cluster(genre: str, mood_text: str, limit: int = 8) -> list[dict[str, Any]]:
    """Return dataset-backed tracks from the cluster model when available."""
    try:
        clustering_model = get_clustering_model()
        cluster_candidates = clustering_model.get_genre_cluster_candidates(genre, limit=3)
        cluster_id = cluster_candidates[0] if cluster_candidates else None

        if cluster_id is not None:
            songs = clustering_model.get_recommendations_from_cluster(
                genre=genre,
                cluster_id=cluster_id,
                limit=limit,
            )
            if songs:
                logger.info(
                    "Cluster recommendation selected: mood=%s genre=%s cluster=%s songs=%s",
                    mood_text,
                    genre,
                    cluster_id,
                    [song.get("filename") for song in songs],
                )
                return songs

        songs = clustering_model.get_recommendations_from_cluster(genre=genre, limit=limit)
        if songs:
            logger.info(
                "Cluster recommendation selected: mood=%s genre=%s cluster=%s songs=%s",
                mood_text,
                genre,
                songs[0].get("cluster"),
                [song.get("filename") for song in songs],
            )
            return songs
        return []
    except FileNotFoundError:
        logger.info("No GTZAN dataset available; using local dummy fallback playlist.")
        return []
    except Exception as exc:  # pragma: no cover - safety path for cluster model issues
        logger.warning("Cluster recommendation failed for mood=%s: %s", mood_text, exc)
        return []


def _dummy_playlist(category: str, constraints: dict[str, str] | None = None) -> list[dict[str, str]]:
    songs = [{**song, **CATEGORY_CONSTRAINTS[category]} for song in DUMMY_SONGS[category]]
    if not constraints:
        return songs

    exact_matches = [
        song
        for song in songs
        if all(
            str(song.get(field, "")).lower() == str(constraints.get(field, "")).lower()
            for field in ("genre", "tempo", "energy")
        )
    ]
    return exact_matches or songs


def recommend_songs(mood: str, constraints: dict[str, str] | None = None) -> list[dict[str, Any]]:
    """Select tracks using cluster-aware GTZAN recommendations, then fall back to local dummy songs."""
    analysis = constraints or {}
    preferred_genre = str(analysis.get("genre") or "").strip()
    genre = _genre_key(preferred_genre) or _genre_key(GENRE_TO_CATEGORY.get(_detect_mood_category(mood)))
    category = GENRE_TO_CATEGORY.get(genre) or _detect_mood_category(mood)

    if preferred_genre:
        genre_upper = preferred_genre.title()
        cluster_songs = _recommend_from_cluster(genre_upper, mood, limit=8)
        if cluster_songs:
            logger.info(
                "Using GTZAN cluster model for mood=%s genre=%s selected_cluster=%s",
                mood,
                genre_upper,
                cluster_songs[0].get("cluster"),
            )
            return cluster_songs

    category_songs = _dummy_playlist(category, analysis)
    logger.info(
        "Using fallback mood playlist for mood=%s genre=%s category=%s",
        mood,
        preferred_genre or category.title(),
        category,
    )
    return category_songs
