import { usePlayer } from '../context/PlayerContext.jsx';
import SongRow from '../components/SongRow.jsx';
import { mockSongs } from '../data/mockData.js';

export default function Favorites({ onNavigate }) {
  const { likedTracks, playTrack, currentQueue } = usePlayer();

  // Filter all known mock songs (and any songs with matching ID)
  const favoriteSongs = mockSongs.filter(song => likedTracks.has(song.id));

  const handlePlayAll = () => {
    if (favoriteSongs.length > 0) {
      playTrack(favoriteSongs[0], favoriteSongs);
    }
  };

  return (
    <div className="page-content fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-title">Your Favorites</div>
          <div className="page-subtitle">Songs you've saved will appear here.</div>
        </div>

        {favoriteSongs.length > 0 && (
          <button
            onClick={handlePlayAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 20px',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px var(--accent-glow)',
              transition: 'var(--transition)',
            }}
          >
            ▶ Play All ({favoriteSongs.length})
          </button>
        )}
      </div>

      {favoriteSongs.length > 0 ? (
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

          {/* Song Rows */}
          {favoriteSongs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} />
          ))}
        </div>
      ) : (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '64px 20px',
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>♡</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            No favorite songs yet
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto 24px' }}>
            Start exploring and save songs you love.
          </div>
          <button
            onClick={() => onNavigate('discover')}
            style={{
              padding: '10px 22px',
              background: 'var(--bg-card-alt)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-pill)',
              color: 'var(--text-primary)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            Explore Music
          </button>
        </div>
      )}
    </div>
  );
}
