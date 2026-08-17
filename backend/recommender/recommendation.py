from services.gemini_service import map_mood_to_genre


MOOD_RULES = {
    "happy": {"genre": "Pop", "tempo": "Fast", "description": "An energetic playlist for your happy mood."},
    "sad": {"genre": "Classical", "tempo": "Slow", "description": "A calm and soothing playlist for your reflective mood."},
    "study": {"genre": "Jazz", "tempo": "Medium", "description": "A smooth playlist to keep you focused while studying."},
    "workout": {"genre": "Rock", "tempo": "Fast", "description": "A motivating playlist to power through your workout."},
    "party": {"genre": "Dance", "tempo": "Very Fast", "description": "A high-energy playlist for a lively party vibe."},
}


DUMMY_SONGS = {
    "happy": ["Sunshine Pop", "Bright Lights", "Golden Hour Groove"],
    "sad": ["Moonlit Symphony", "Quiet Echoes", "Gentle Rain Piano"],
    "study": ["Midnight Jazz Notes", "Coffeehouse Calm", "Focus Flow"],
    "workout": ["Power Drive", "Steel Mountain", "Rush Hour"],
    "party": ["Neon Dance Beat", "Night Pulse", "Afterparty Energy"],
}


def _detect_mood_category(mood_text: str) -> str:
    """Map a full sentence to a simple recommendation category."""
    text = mood_text.lower().strip()

    if any(keyword in text for keyword in ["gym", "workout", "exercise", "training", "lifting", "running", "fitness"]):
        return "workout"

    if any(keyword in text for keyword in ["party", "dance", "club", "celebration", "night out"]):
        return "party"

    if any(keyword in text for keyword in ["study", "focus", "exam", "reading", "learn", "homework", "revision"]):
        return "study"

    if any(keyword in text for keyword in ["sad", "lonely", "tired", "upset", "stress", "depressed"]):
        return "sad"

    if any(keyword in text for keyword in ["happy", "joy", "cheerful", "good", "excited", "fun"]):
        return "happy"

    return "happy"


def recommend_songs(mood: str):
    """
    Rule-based recommendation logic for a beginner-friendly Module D demo.
    This uses dummy data only and keeps the implementation easy to understand.
    """
    mood_key = mood.lower().strip()
    category = _detect_mood_category(mood_key)

    rule = MOOD_RULES[category]
    songs = DUMMY_SONGS[category]

    genre = map_mood_to_genre(mood_key)

    return {
        "mood": mood,
        "genre": genre,
        "tempo": rule["tempo"],
        "playlist_description": rule["description"],
        "songs": songs,
    }
