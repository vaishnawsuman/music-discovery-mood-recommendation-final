import { usePlayer } from '../context/PlayerContext.jsx';
import SongRow from '../components/SongRow.jsx';

export default function RecentlyPlayed({ onNavigate }) {
  const { recentlyPlayed, setRecentlyPlayed, playTrack } = usePlayer();

  const handleClear = () => {
    setRecentlyPlayed([]);
  };

  const handlePlayAll = () => {
    if (recentlyPlayed.length > 0) {
      playTrack(recentlyPlayed[0], recentlyPlayed);
    }
  };

  return (
    <div className="page-content fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-title">Recently Played</div>
          <div className="page-subtitle">Songs you've played recently.</div>
        </div>

        {recentlyPlayed.length > 0 && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handlePlayAll}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 18px',
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
              ▶ Play All
            </button>
            <button
              onClick={handleClear}
              style={{
                padding: '9px 16px',
                background: 'var(--bg-card-alt)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--text-muted)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Clear History
            </button>
          </div>
        )}
      </div>

      {recentlyPlayed.length > 0 ? (
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
          {recentlyPlayed.map((song, i) => (
            <SongRow key={`${song.id}-${i}`} song={song} index={i} />
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
          <div style={{ fontSize: 44, marginBottom: 16 }}>⟳</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            Nothing played yet
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto 24px' }}>
            Your recently played songs will appear here.
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
            Start Listening
          </button>
        </div>
      )}
    </div>
  );
}
