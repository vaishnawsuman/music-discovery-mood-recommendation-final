def map_mood_to_genre(mood: str) -> str:
    """
    Placeholder for future Gemini API integration.

    In later versions, this function will call the Google Gemini API
    to interpret natural-language mood input and return a suitable genre.
    For now, we keep the implementation local and rule-based so the project
    can run successfully without external API keys or network access.
    """
    mood_key = mood.lower().strip()

    if any(keyword in mood_key for keyword in ["gym", "workout", "exercise", "training", "lifting", "running", "fitness"]):
        return "Rock"
    if any(keyword in mood_key for keyword in ["party", "dance", "club", "celebration", "night out"]):
        return "Dance"
    if any(keyword in mood_key for keyword in ["study", "focus", "exam", "reading", "learn", "homework", "revision"]):
        return "Jazz"
    if any(keyword in mood_key for keyword in ["sad", "lonely", "tired", "upset", "stress", "depressed"]):
        return "Classical"
    if any(keyword in mood_key for keyword in ["happy", "joy", "cheerful", "good", "excited", "fun"]):
        return "Pop"

    return "Pop"
