import { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';
import SongRow from '../components/SongRow.jsx';
import { mockPlaylists, mockSongs } from '../data/mockData.js';

const TOP_ARTISTS = [
  { id: 1, name: 'Ludovico Einaudi', genre: 'Classical / Ambient', streams: '438 plays', emoji: '🎹', color: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
  { id: 2, name: 'The Weeknd',        genre: 'Pop / R&B',          streams: '312 plays', emoji: '💡', color: 'linear-gradient(135deg, #3b120c, #1a0533)' },
  { id: 3, name: 'Yiruma',            genre: 'Classical Piano',    streams: '264 plays', emoji: '🌊', color: 'linear-gradient(135deg, #0f3460, #1b2838)' },
  { id: 4, name: 'Arijit Singh',      genre: 'Bollywood / Pop',    streams: '215 plays', emoji: '🌸', color: 'linear-gradient(135deg, #2d1b00, #422006)' },
  { id: 5, name: 'Queen',             genre: 'Classic Rock',       streams: '189 plays', emoji: '👑', color: 'linear-gradient(135deg, #1a1f3c, #2d1b69)' },
];

const GENRE_BREAKDOWN = [
  { name: 'Classical & Ambient', percent: 42, color: 'var(--accent)', hours: '60h' },
  { name: 'Pop & Commercial',    percent: 26, color: '#3B82F6', hours: '37h' },
  { name: 'Hip-Hop & Beats',     percent: 18, color: '#10B981', hours: '25h' },
  { name: 'Rock & Alternative',  percent: 14, color: '#F59E0B', hours: '20h' },
];

const USER_PLAYLISTS_KEY = 'moodify_saved_playlists';
const USER_PROFILE_KEY = 'moodify_user_profile';

export default function Profile({ onNavigate }) {
  const { likedTracks, recentlyPlayed, playTrack } = usePlayer();

  // Profile info
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_PROFILE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      name: 'Viveka',
      email: 'viveka@moodify.ai',
      bio: 'Exploring curated soundscapes for deep focus, coding flow, and nighttime calm. 🎧',
      joined: 'Member since January 2026',
      badge: 'Premium Master Listener',
    };
  });

  // User Playlists
  const [userPlaylists, setUserPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_PLAYLISTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return mockPlaylists;
  });

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editEmail, setEditEmail] = useState(profile.email);

  const handleSaveProfile = () => {
    const updated = {
      ...profile,
      name: editName.trim() || 'Viveka',
      bio: editBio.trim(),
      email: editEmail.trim() || 'viveka@moodify.ai',
    };
    setProfile(updated);
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setIsEditing(false);
  };

  // Top favorite songs (derived from likedTracks or curated subset)
  const favoriteSongs = mockSongs.filter(s => likedTracks.has(s.id));
  const displaySongs = favoriteSongs.length > 0 ? favoriteSongs.slice(0, 5) : mockSongs.slice(0, 5);

  return (
    <div className="page-content fade-in" style={{ maxWidth: 940, paddingBottom: 60 }}>
      {/* 1. PROFILE HEADER HERO */}
      <div className="profile-hero-card">
        <div className="profile-hero-avatar-wrapper">
          <div className="profile-hero-avatar">
            {profile.name ? profile.name[0].toUpperCase() : 'V'}
          </div>
          <div className="profile-avatar-badge" title="VIP Verified">★</div>
        </div>

        <div className="profile-hero-info">
          <div className="profile-hero-badge-row">
            <span className="profile-vip-tag">✦ {profile.badge}</span>
            <span className="profile-meta-dot">•</span>
            <span className="profile-joined-text">{profile.joined}</span>
          </div>

          <h1 className="profile-hero-name">{profile.name}</h1>
          <div className="profile-hero-email">{profile.email}</div>
          <p className="profile-hero-bio">{profile.bio}</p>

          <div className="profile-hero-actions">
            <button
              className="profile-edit-btn"
              onClick={() => {
                setEditName(profile.name);
                setEditBio(profile.bio);
                setEditEmail(profile.email);
                setIsEditing(true);
              }}
            >
              <span>✎</span> Edit Profile
            </button>

            <button
              className="profile-share-btn"
              onClick={() => onNavigate?.('settings')}
            >
              <span>⚙</span> Settings
            </button>
          </div>
        </div>
      </div>

      {/* 2. LISTENING STATISTICS */}
      <div className="profile-section-heading">
        <div className="profile-section-title">
          <span>📊</span> Listening Statistics
        </div>
        <span className="profile-section-sub">Last 30 days activity</span>
      </div>

      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(229, 9, 20, 0.15)', color: 'var(--accent)' }}>
            🎵
          </div>
          <div className="stat-card-data">
            <div className="stat-card-value">1,428</div>
            <div className="stat-card-label">Songs Played</div>
            <div className="stat-card-trend">↑ 18% vs last month</div>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
            ▤
          </div>
          <div className="stat-card-data">
            <div className="stat-card-value">{userPlaylists.length}</div>
            <div className="stat-card-label">Playlists Created</div>
            <div className="stat-card-trend">{userPlaylists.length} active playlists</div>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
            🎷
          </div>
          <div className="stat-card-data">
            <div className="stat-card-value">Classical</div>
            <div className="stat-card-label">Favorite Genre</div>
            <div className="stat-card-trend">42% of listening time</div>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
            ⏱
          </div>
          <div className="stat-card-data">
            <div className="stat-card-value">142.5 hrs</div>
            <div className="stat-card-label">Listening Time</div>
            <div className="stat-card-trend">Avg 2.4 hrs / day</div>
          </div>
        </div>
      </div>

      {/* 3. FAVORITE MUSIC & GENRES (2 COLUMN DASHBOARD) */}
      <div className="profile-two-col-grid">
        {/* Left Col: Favorite Genre Breakdown & Favorite Artists */}
        <div className="profile-dashboard-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-title">
              <span>🎶</span> Top Genres
            </div>
            <span className="section-link" onClick={() => onNavigate?.('genres')}>Explore</span>
          </div>

          {/* Genre bars */}
          <div className="genre-breakdown-list">
            {GENRE_BREAKDOWN.map((g, i) => (
              <div key={i} className="genre-bar-item">
                <div className="genre-bar-header">
                  <span className="genre-bar-name">{g.name}</span>
                  <span className="genre-bar-hours">{g.hours} ({g.percent}%)</span>
                </div>
                <div className="genre-progress-track">
                  <div
                    className="genre-progress-fill"
                    style={{ width: `${g.percent}%`, background: g.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Top Favorite Artists */}
          <div className="dashboard-card-header" style={{ marginTop: 28 }}>
            <div className="dashboard-card-title">
              <span>⭐</span> Favorite Artists
            </div>
          </div>

          <div className="favorite-artists-list">
            {TOP_ARTISTS.map((artist, idx) => (
              <div key={artist.id} className="favorite-artist-row">
                <div className="artist-rank-num">#{idx + 1}</div>
                <div className="artist-avatar" style={{ background: artist.color }}>
                  {artist.emoji}
                </div>
                <div className="artist-meta">
                  <div className="artist-name">{artist.name}</div>
                  <div className="artist-genre">{artist.genre}</div>
                </div>
                <div className="artist-streams">{artist.streams}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Top Favorite Songs */}
        <div className="profile-dashboard-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-title">
              <span>♥</span> Favorite Songs
            </div>
            <span className="section-link" onClick={() => onNavigate?.('favorites')}>See All ({likedTracks.size})</span>
          </div>

          <div className="profile-songs-list">
            {displaySongs.map((song, i) => (
              <SongRow key={song.id} song={song} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* 4. USER PLAYLISTS */}
      <div style={{ marginTop: 36 }}>
        <div className="profile-section-heading">
          <div className="profile-section-title">
            <span>▤</span> Created Playlists
          </div>
          <button
            className="create-playlist-btn"
            onClick={() => onNavigate?.('library')}
          >
            + New Playlist
          </button>
        </div>

        <div className="library-grid">
          {userPlaylists.map(pl => (
            <PlaylistCard
              key={pl.id}
              playlist={pl}
              onClick={() => onNavigate?.('library')}
            />
          ))}
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Edit Personal Profile</div>
              <button className="modal-close" onClick={() => setIsEditing(false)}>✕</button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Display Name
              </label>
              <input
                className="modal-input"
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                maxLength={40}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                className="modal-input"
                type="email"
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Bio & Music Taste
              </label>
              <textarea
                className="modal-input"
                style={{ height: 80, resize: 'none' }}
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                maxLength={180}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="modal-btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
              <button className="modal-btn-primary" onClick={handleSaveProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
