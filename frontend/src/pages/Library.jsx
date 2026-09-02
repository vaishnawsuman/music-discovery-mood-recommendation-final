import { useState, useEffect } from 'react';
import PlaylistCard from '../components/PlaylistCard.jsx';
import SongRow from '../components/SongRow.jsx';
import { mockPlaylists, mockSongs } from '../data/mockData.js';
import { usePlayer } from '../context/PlayerContext.jsx';

const PLAYLISTS_KEY = 'moodify_saved_playlists';

export default function Library({ onNavigate }) {
  const { likedTracks, recentlyPlayed, playTrack } = usePlayer();
  const [showCreate, setShowCreate] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem(PLAYLISTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return mockPlaylists;
  });
  const [newName, setNewName] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
    } catch (e) {
      console.error(e);
    }
  }, [playlists]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const emojis = ['🎵', '🎶', '🎸', '🎹', '🎷', '🎺', '🎧', '⚡'];
    const colors = [
      'linear-gradient(135deg, #1a1a2e, #16213e)',
      'linear-gradient(135deg, #2d1b69, #11998e)',
      'linear-gradient(135deg, #E50914, #8B0000)',
      'linear-gradient(135deg, #10B981, #059669)',
      'linear-gradient(135deg, #F59E0B, #EF4444)',
    ];
    const newPlaylist = {
      id: Date.now(),
      title: newName.trim(),
      songs: 6,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      desc: 'User custom playlist',
    };
    setPlaylists(prev => [newPlaylist, ...prev]);
    setNewName('');
    setShowCreate(false);
  };

  const specialCollections = [
    {
      id: 'favorites',
      name: 'Liked Songs',
      emoji: '♥',
      meta: `${likedTracks.size} songs`,
      color: 'linear-gradient(135deg, #E50914, #8B0000)',
      action: () => onNavigate?.('favorites'),
    },
    {
      id: 'recent',
      name: 'Recently Played',
      emoji: '⟳',
      meta: `${recentlyPlayed.length} songs`,
      color: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
      action: () => onNavigate?.('recent'),
    },
  ];

  // Songs for active playlist view
  const playlistSongs = activePlaylist
    ? mockSongs.slice(0, 6)
    : [];

  return (
    <div className="page-content fade-in">
      <div className="library-header">
        <div>
          <div className="page-title">Your Playlists</div>
          <div className="page-subtitle">{playlists.length} playlists</div>
        </div>
        <button
          className="create-playlist-btn"
          onClick={() => setShowCreate(s => !s)}
        >
          + Create New
        </button>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: 24,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}>
          <input
            autoFocus
            type="text"
            placeholder="Playlist name..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            style={{
              flex: 1,
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontSize: 14,
            }}
          />
          <button
            onClick={handleCreate}
            style={{
              padding: '10px 20px',
              background: 'var(--accent)',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Create
          </button>
          <button
            onClick={() => setShowCreate(false)}
            style={{ color: 'var(--text-muted)', fontSize: 14, cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Playlist Grid */}
      <div className="library-grid" style={{ marginBottom: 32 }}>
        {playlists.map(pl => (
          <PlaylistCard
            key={pl.id}
            playlist={pl}
            onClick={() => setActivePlaylist(pl)}
          />
        ))}
        {/* Add new placeholder */}
        <div
          className="create-playlist-placeholder"
          onClick={() => setShowCreate(true)}
          title="Create New Playlist"
        >
          <div className="create-playlist-placeholder-icon">+</div>
          <span className="create-playlist-placeholder-text">Create Playlist</span>
        </div>
      </div>

      {/* Active Playlist Detail */}
      {activePlaylist && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 20,
          marginBottom: 32,
        }}>
          <div className="section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: activePlaylist.color || 'var(--bg-card-alt)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>
                {activePlaylist.emoji}
              </div>
              <div>
                <div className="section-title">{activePlaylist.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{activePlaylist.desc || 'Curated tracks'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => playTrack(playlistSongs[0], playlistSongs)}
                style={{
                  padding: '8px 16px', background: 'var(--accent)',
                  color: '#fff', borderRadius: 'var(--radius-pill)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}
              >
                ▶ Play All
              </button>
              <button
                onClick={() => setActivePlaylist(null)}
                style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                Close (✕)
              </button>
            </div>
          </div>

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

          {playlistSongs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} />
          ))}
        </div>
      )}

      {/* Special Collections */}
      <div className="library-special-section">
        <div className="section-header" style={{ marginBottom: 14 }}>
          <div className="section-title">Quick Collections</div>
        </div>
        {specialCollections.map(col => (
          <div
            key={col.id}
            className="library-special-card"
            onClick={col.action}
            style={{ cursor: 'pointer' }}
          >
            <div
              className="library-special-icon"
              style={{ background: col.color, border: 'none' }}
            >
              <span style={{ color: '#fff' }}>{col.emoji}</span>
            </div>
            <div className="library-special-info">
              <div className="library-special-name">{col.name}</div>
              <div className="library-special-meta">{col.meta}</div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
