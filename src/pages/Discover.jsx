import { useState } from 'react';
import PlaylistCard from '../components/PlaylistCard.jsx';
import SongRow from '../components/SongRow.jsx';
import GenreCard from '../components/GenreCard.jsx';
import { mockPlaylists, mockSongs, mockGenres, mockMoods } from '../data/mockData.js';
import { usePlayer } from '../context/PlayerContext.jsx';

export default function Discover({ onNavigate }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { playTrack } = usePlayer();

  // Filter songs according to selected mood / genre
  let displayedSongs = mockSongs;
  if (selectedMood) {
    displayedSongs = mockSongs.filter(s => s.mood?.toLowerCase() === selectedMood.toLowerCase());
  } else if (selectedGenre) {
    displayedSongs = mockSongs.filter(s => s.genre?.toLowerCase() === selectedGenre.toLowerCase());
  }

  const handleMoodClick = (mood) => {
    setSelectedGenre(null);
    setSelectedMood(prev => prev === mood.label ? null : mood.label);
  };

  const handleGenreClick = (genre) => {
    setSelectedMood(null);
    setSelectedGenre(prev => prev === genre.name ? null : genre.name);
  };

  const handlePlayFeatured = () => {
    const featured = mockSongs[0];
    playTrack(featured, mockSongs);
  };

  return (
    <div className="page-content fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">Discover</div>
        <div className="page-subtitle">Explore music by mood, genre, and curated collections</div>
      </div>

      {/* Featured Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1f0808 0%, #111111 60%, #0d0d0d 100%)',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          marginBottom: '36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 520 }}>
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            background: 'var(--accent-subtle)',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-pill)',
            color: 'var(--accent)',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: 12,
          }}>
            Featured Selection
          </span>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.5px' }}>
            Immerse In Sound
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
            Discover sonic textures engineered for relaxation, peak concentration, and euphoric high-energy workouts.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handlePlayFeatured}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 22px',
                background: 'var(--accent)',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 16px var(--accent-glow)',
                transition: 'var(--transition)',
              }}
            >
              ▶ Play Featured
            </button>
            <button
              onClick={() => onNavigate('moodai')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--text-primary)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              ✦ Ask Mood AI
            </button>
          </div>
        </div>

        <div style={{
          fontSize: '90px',
          opacity: 0.25,
          userSelect: 'none',
          filter: 'drop-shadow(0 0 30px var(--accent))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          🎧
        </div>
      </div>

      {/* Mood Discovery Section */}
      <div style={{ marginBottom: 36 }}>
        <div className="section-header">
          <div>
            <div className="section-title">Mood Discovery</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              Select a mood to filter matching songs
            </div>
          </div>
          {selectedMood && (
            <button
              onClick={() => setSelectedMood(null)}
              style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}
            >
              Reset Filter (✕ {selectedMood})
            </button>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 14,
        }}>
          {mockMoods.map(mood => {
            const isSelected = selectedMood === mood.label;
            return (
              <div
                key={mood.id}
                onClick={() => handleMoodClick(mood)}
                style={{
                  background: isSelected ? 'var(--accent)' : 'var(--bg-card)',
                  border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px 16px',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  boxShadow: isSelected ? '0 4px 20px var(--accent-glow)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <span style={{ fontSize: 26 }}>{mood.emoji}</span>
                <div style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: isSelected ? '#ffffff' : 'var(--text-primary)',
                }}>
                  {mood.label}
                </div>
                <div style={{
                  fontSize: 11,
                  color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)',
                }}>
                  {isSelected ? '✓ Filtering' : 'Click to filter'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Genre Section */}
      <div style={{ marginBottom: 36 }}>
        <div className="section-header">
          <div>
            <div className="section-title">Explore Genres</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              10 genres from the GTZAN benchmark
            </div>
          </div>
          {selectedGenre ? (
            <button
              onClick={() => setSelectedGenre(null)}
              style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}
            >
              Reset Filter (✕ {selectedGenre})
            </button>
          ) : (
            <span className="section-link" onClick={() => onNavigate('genres')}>
              View All
            </span>
          )}
        </div>

        <div className="genres-grid">
          {mockGenres.map(genre => {
            const isSelected = selectedGenre === genre.name;
            return (
              <div
                key={genre.id}
                className={`genre-card${isSelected ? ' active' : ''}`}
                onClick={() => handleGenreClick(genre)}
                style={{
                  borderColor: isSelected ? 'var(--accent)' : undefined,
                  background: isSelected ? 'rgba(229, 9, 20, 0.15)' : undefined,
                }}
              >
                <div className="genre-icon">
                  <span>{genre.emoji}</span>
                </div>
                <div className="genre-name">{genre.name}</div>
                <div className="genre-count">{genre.count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtered or Popular Songs */}
      <div style={{ marginBottom: 36 }}>
        <div className="section-header">
          <div className="section-title">
            {selectedMood
              ? `${selectedMood} Music (${displayedSongs.length})`
              : selectedGenre
              ? `${selectedGenre} Songs (${displayedSongs.length})`
              : 'Popular Songs'}
          </div>
          {(selectedMood || selectedGenre) && (
            <button
              onClick={() => { setSelectedMood(null); setSelectedGenre(null); }}
              style={{ fontSize: 12, color: 'var(--text-muted)' }}
            >
              Show all
            </button>
          )}
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '28px 2fr 1.5fr 1fr 80px 80px',
            gap: 12,
            padding: '0 12px 10px',
            borderBottom: '1px solid var(--border)',
            marginBottom: 4,
          }}>
            {['#', 'Title', 'Artist', 'Genre', 'Duration', ''].map((h, i) => (
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
            ))}
          </div>

          {displayedSongs.length > 0 ? (
            displayedSongs.slice(0, 12).map((song, i) => (
              <SongRow key={song.id} song={song} index={i} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
              No songs found matching this criteria.
            </div>
          )}
        </div>
      </div>

      {/* Recommended Playlists */}
      <div>
        <div className="section-header">
          <div className="section-title">Recommended Playlists</div>
          <span className="section-link" onClick={() => onNavigate('library')}>
            View All
          </span>
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
    </div>
  );
}
