const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function getRecommendations(mood) {
  let response;

  try {
    response = await fetch(`${API_URL}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood }),
    });
  } catch {
    throw new Error('Unable to reach the recommendation service. Check that the backend is running.');
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.detail || 'Unable to generate a playlist right now.');
  }

  return payload;
}
