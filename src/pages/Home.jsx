import { useState } from 'react';
import PlaylistCard from '../components/PlaylistCard.jsx';
import SongRow from '../components/SongRow.jsx';
import { mockPlaylists, mockSongs, quickVibes } from '../data/mockData.js';

export default function Home({ onNavigate, onMoodGenerate }) {
  const [moodText, setMoodText] = useState('');
  const [activeVibe, setActiveVibe] = useState(null);

  const handleVibeClick = (vibe) => {
    setActiveVibe(vibe.id);
    setMoodText(vibe.mood);
  };

  const handleFindVibe = () => {
    if (!moodText.trim()) return;
    onMoodGenerate(moodText);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFindVibe();
    }
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="page-content fade-in">
      {/* Greeting */}
      <div className="home-greeting">
        <h1>{getGreeting()}, Viveka 👋</h1>
        <p>Let's find the perfect music for your mood.</p>
      </div>

      {/* Hero Mood Card */}
      <div className="hero-mood-card">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="hero-label">How are you feeling today?</div>
          <textarea
            className="hero-mood-input"
            placeholder="Describe your mood or activity..."
            value={moodText}
            onChange={e => setMoodText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={200}
          />
          <button
            className="hero-vibe-btn"
            onClick={handleFindVibe}
            disabled={!moodText.trim()}
          >
            <span>✦</span>
            <span>FIND MY VIBE</span>
          </button>
        </div>

        {/* Waveform visual */}
        <div className="hero-waveform">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="wave-bar" />
          ))}
        </div>
      </div>

      {/* Quick Vibes */}
      <div className="quick-vibes-section">
        <div className="section-header">
          <div className="section-title">Quick Vibes</div>
          <span className="section-link">See all</span>
        </div>
        <div className="quick-vibes-grid">
          {quickVibes.map(vibe => (
            <button
              key={vibe.id}
              className={`mood-chip${activeVibe === vibe.id ? ' active' : ''}`}
              onClick={() => handleVibeClick(vibe)}
            >
              <span className="mood-chip-emoji">{vibe.emoji}</span>
              <span>{vibe.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Made For Your Mood */}
      <div style={{ marginBottom: 32 }}>
        <div className="section-header">
          <div className="section-title">Made For Your Mood</div>
          <span className="section-link" onClick={() => onNavigate('library')}>See all</span>
        </div>
        <div className="horizontal-scroll-grid">
          {mockPlaylists.map(pl => (
            <PlaylistCard
              key={pl.id}
              playlist={pl}
              onClick={() => onNavigate('library')}
            />
          ))}
        </div>
      </div>

      {/* Recent Songs */}
      <div>
        <div className="section-header">
          <div className="section-title">Recently Played</div>
          <span className="section-link">See all</span>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '28px 2fr 1.5fr 1fr 80px 80px',
            gap: 12,
            padding: '0 12px 10px',
            borderBottom: '1px solid var(--border)',
            marginBottom: 4,
          }}>
            {['#', 'Title', 'Artist', 'Genre', 'Duration', ''].map((h, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>{h}</span>
            ))}
          </div>

          {mockSongs.slice(0, 8).map((song, i) => (
            <SongRow key={song.id} song={song} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
