import { useEffect, useState } from 'react';
import SongRow from '../components/SongRow.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { getRecommendations } from '../services/api.js';

const ANALYSIS_ICONS = {
  mood: '💭',
  genre: '🎵',
  tempo: '⏱',
  energy: '⚡',
};

export default function Recommendations({ moodText, onBack }) {
  const { playTrack } = usePlayer();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getRecommendations(moodText);
        setResult(data);
      } catch (error) {
        console.error(error);
        setError(
          error.message || 'Unable to generate playlist. Check your backend.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (moodText) {
      fetchRecommendations();
    }
  }, [moodText]);

  if (loading) {
    return (
      <div className="page-content fade-in">
        <button className="reco-back-btn" onClick={onBack}>
          ← Back
        </button>

        <div style={{ textAlign: 'center', padding: 80 }}>
          <div className="spinner" />
          <h3>Understanding your mood...</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Creating your personalized playlist
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content fade-in">
        <button className="reco-back-btn" onClick={onBack}>
          ← Back
        </button>

        <div style={{ textAlign: 'center', padding: 80 }}>
          <div style={{ fontSize: 40 }}>⚠️</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const analysis = result || {};
  const songs = result?.songs || [];
  const why =
    result?.playlist_description || 'These songs match your mood.';

  const analysisItems = [
    { key: 'mood', label: 'Mood', value: analysis.mood },
    { key: 'genre', label: 'Genre', value: analysis.genre },
    { key: 'tempo', label: 'Tempo', value: analysis.tempo },
    { key: 'energy', label: 'Energy', value: analysis.energy },
  ];

  const handlePlayAll = () => {
    if (songs.length) {
      playTrack(songs[0]);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-content fade-in">
      <button className="reco-back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="reco-header">
        <div className="reco-title">
          Here's your playlist! 🎉
        </div>

        <div className="reco-user-query">
          Based on your mood: <em>"{moodText}"</em>
        </div>
      </div>

      {/* AI Analysis */}
      <div style={{ marginBottom: 8 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 12,
          }}
        >
          AI Understanding
        </div>

        <div className="ai-analysis-grid">
          {analysisItems.map((item) => (
            <div key={item.key} className="ai-analysis-card">
              <div className="ai-analysis-icon">
                {ANALYSIS_ICONS[item.key]}
              </div>

              <div>
                <div className="ai-analysis-label">
                  {item.label}
                </div>

                <div className="ai-analysis-value">
                  {item.value || 'Unknown'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Playlist */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 20,
          marginBottom: 16,
        }}
      >
        <div className="reco-section-header">
          <div className="section-title">
            Recommended Playlist
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 18px',
                background: 'var(--bg-card-alt)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={handlePlayAll}
            >
              ▶ Play All
            </button>

            <button
              className="save-playlist-btn"
              onClick={handleSave}
              disabled={saved}
            >
              {saved ? '✓ Saved!' : '+ Save Playlist'}
            </button>
          </div>
        </div>

        {/* Table head */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '28px 2fr 1.5fr 1fr 80px 80px',
            gap: 12,
            padding: '0 12px 10px',
            borderBottom: '1px solid var(--border)',
            marginBottom: 4,
          }}
        >
          {['#', 'Title', 'Artist', 'Genre', 'Duration', ''].map(
            (h, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: 'var(--text-muted)',
                }}
              >
                {h}
              </span>
            )
          )}
        </div>

        {songs.length > 0 ? (
          songs.map((song, i) => (
            <SongRow
              key={song.id || i}
              song={song}
              index={i}
            />
          ))
        ) : (
          <div
            style={{
              padding: 40,
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            No songs found for this mood.
          </div>
        )}
      </div>

      {/* Why */}
      <div className="why-these-card">
        <div className="why-these-title">
          ✦ Why these songs?
        </div>

        <div className="why-these-text">
          {why}
        </div>
      </div>
    </div>
  );
}