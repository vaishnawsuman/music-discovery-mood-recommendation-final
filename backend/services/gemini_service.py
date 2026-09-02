"""Gemini integration for mood interpretation and playlist descriptions."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

try:
    from google import genai
    from google.genai import types
except ImportError:  # pragma: no cover - optional dependency outside local setup
    genai = None
    types = None


load_dotenv(Path(__file__).resolve().parents[1] / ".env")

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
SUPPORTED_GENRES = ("Pop", "Rock", "Classical", "Jazz", "Dance")
TEMPOS = ("Slow", "Medium", "Fast", "Very Fast")
ENERGY_LEVELS = ("Low", "Medium", "High")


class GeminiConfigurationError(RuntimeError):
    """Raised when Gemini has not been configured for the backend."""


class GeminiServiceError(RuntimeError):
    """Raised when Gemini cannot complete a request."""


class GeminiResponseError(RuntimeError):
    """Raised when Gemini returns an unusable structured response."""


if types is not None:
    MOOD_RESPONSE_SCHEMA = types.Schema(
        type=types.Type.OBJECT,
        required=["mood", "genre", "tempo", "energy", "description"],
        properties={
            "mood": types.Schema(type=types.Type.STRING),
            "genre": types.Schema(type=types.Type.STRING, enum=list(SUPPORTED_GENRES)),
            "tempo": types.Schema(type=types.Type.STRING, enum=list(TEMPOS)),
            "energy": types.Schema(type=types.Type.STRING, enum=list(ENERGY_LEVELS)),
            "description": types.Schema(type=types.Type.STRING),
        },
    )
else:
    MOOD_RESPONSE_SCHEMA = None


def _fallback_analysis(mood: str) -> dict[str, str]:
    """Generate a deterministic local fallback when Gemini is unavailable."""
    text = mood.lower()
    if any(keyword in text for keyword in ("gym", "workout", "exercise", "run", "training", "fitness")):
        genre, tempo, energy = "Rock", "Fast", "High"
        mood_label = "Energetic workout"
    elif any(keyword in text for keyword in ("study", "focus", "learn", "reading", "work", "exam")):
        genre, tempo, energy = "Jazz", "Medium", "Medium"
        mood_label = "Focused study"
    elif any(keyword in text for keyword in ("sad", "lonely", "stress", "upset", "tired", "relax")):
        genre, tempo, energy = "Classical", "Slow", "Low"
        mood_label = "Calm reflection"
    elif any(keyword in text for keyword in ("party", "dance", "club", "celebrate")):
        genre, tempo, energy = "Dance", "Very Fast", "High"
        mood_label = "Party energy"
    else:
        genre, tempo, energy = "Pop", "Fast", "High"
        mood_label = "Happy and upbeat"

    return {
        "mood": mood_label,
        "genre": genre,
        "tempo": tempo,
        "energy": energy,
        "description": f"This playlist matches the request '{mood.strip()}' with {genre} energy and a {tempo.lower()} pace.",
    }


def _client() -> Any:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key or api_key == "YOUR_API_KEY":
        raise GeminiConfigurationError(
            "Gemini is not configured. Add a valid GEMINI_API_KEY to backend/.env or use the local offline fallback."
        )
    if genai is None:
        raise GeminiConfigurationError("The google-genai dependency is not installed.")
    return genai.Client(api_key=api_key)


def _parse_mood_response(response: Any) -> dict[str, str]:
    """Validate Gemini's JSON-mode response before it reaches the recommender."""
    try:
        data = json.loads(response.text)
    except (AttributeError, TypeError, json.JSONDecodeError) as error:
        raise GeminiResponseError("Gemini returned an invalid mood-analysis response.") from error

    if not isinstance(data, dict):
        raise GeminiResponseError("Gemini returned an invalid mood-analysis response.")

    analysis = {field: str(data.get(field, "")).strip() for field in ["mood", "genre", "tempo", "energy", "description"]}
    if not all(analysis.values()):
        raise GeminiResponseError("Gemini returned an incomplete mood-analysis response.")
    if analysis["genre"] not in SUPPORTED_GENRES:
        raise GeminiResponseError("Gemini returned an unsupported genre.")
    if analysis["tempo"] not in TEMPOS:
        raise GeminiResponseError("Gemini returned an unsupported tempo.")
    if analysis["energy"] not in ENERGY_LEVELS:
        raise GeminiResponseError("Gemini returned an unsupported energy level.")

    return analysis


def interpret_mood(mood: str) -> dict[str, str]:
    """Convert a natural-language request into recommender constraints."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key or api_key == "YOUR_API_KEY" or genai is None or types is None:
        return _fallback_analysis(mood)

    prompt = f"""
Interpret this music request: {mood!r}

Return JSON only. Choose exactly one genre from {", ".join(SUPPORTED_GENRES)},
    one tempo from {", ".join(TEMPOS)}, and one energy level from
{", ".join(ENERGY_LEVELS)}. Keep mood concise and write a short description
explaining why these constraints fit the request.
"""
    try:
        client = _client()
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=MOOD_RESPONSE_SCHEMA,
                temperature=0.2,
            ),
        )
    except GeminiConfigurationError:
        return _fallback_analysis(mood)
    except Exception as error:
        raise GeminiServiceError("Gemini could not interpret the mood request.") from error

    return _parse_mood_response(response)


def generate_playlist_description(analysis: dict[str, str], songs: list[dict[str, str]]) -> str:
    """Generate one concise, personalised description for selected tracks."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key or api_key == "YOUR_API_KEY" or genai is None or types is None:
        song_titles = ", ".join(song.get("title") or song.get("filename") or "track" for song in songs)
        return (
            f"{analysis.get('mood', 'Mood')} playlist picks {analysis.get('genre', 'Pop')} tracks with "
            f"{analysis.get('tempo', 'Fast')} tempo and {analysis.get('energy', 'High')} energy. "
            f"Featured songs: {song_titles}."
        )

    song_titles = ", ".join(song.get("title") or song.get("filename") or "track" for song in songs)
    prompt = f"""
Write one natural, personalised playlist description of at most 35 words.
Do not use a heading, bullets, or quotation marks.
Mood: {analysis['mood']}
Genre: {analysis['genre']}
Tempo: {analysis['tempo']}
Energy: {analysis['energy']}
Tracks: {song_titles}
"""
    try:
        client = _client()
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(temperature=0.4),
        )
        description = response.text.strip()
    except GeminiConfigurationError:
        return (
            f"{analysis.get('mood', 'Mood')} playlist picks {analysis.get('genre', 'Pop')} tracks with "
            f"{analysis.get('tempo', 'Fast')} tempo and {analysis.get('energy', 'High')} energy."
        )
    except Exception as error:
        raise GeminiServiceError("Gemini could not generate a playlist description.") from error

    if not description:
        raise GeminiResponseError("Gemini returned an empty playlist description.")
    return description
