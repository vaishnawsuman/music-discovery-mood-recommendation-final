import { useState } from 'react';
import ProfileMenu from './ProfileMenu.jsx';

const NAV_ITEMS = [
  { id: 'home',     label: 'Home',            icon: '⊞' },
  { id: 'moodai',   label: 'Mood AI',         icon: '✦' },
  { id: 'search',   label: 'Search',          icon: '⌕' },
];

const LIBRARY_ITEMS = [
  { id: 'library',  label: 'Playlists',       icon: '▤' },
  { id: 'favorites',label: 'Favorites',       icon: '♡' },
  { id: 'recent',   label: 'Recently Played', icon: '⟳' },
];

const EXPLORE_ITEMS = [
  { id: 'genres',   label: 'Genres',          icon: '◈' },
  { id: 'discover', label: 'Discover',        icon: '◎' },
];

export default function Sidebar({ currentPage, onNavigate }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <div className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">
            <div className="sidebar-logo-icon">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Rounded square border */}
                <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#e63946" strokeWidth="2" fill="none" />
                {/* Waveform / heartbeat line */}
                <polyline
                  points="6,34 14,34 18,28 22,40 26,20 30,44 34,16 38,42 42,24 46,36 50,30 54,34 58,34"
                  stroke="#e63946"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* Sparkle stars */}
                <circle cx="16" cy="18" r="1.2" fill="#e63946" />
                <line x1="16" y1="14" x2="16" y2="22" stroke="#e63946" strokeWidth="0.8" />
                <line x1="12" y1="18" x2="20" y2="18" stroke="#e63946" strokeWidth="0.8" />
                <circle cx="48" cy="16" r="0.8" fill="#e63946" />
                <line x1="48" y1="13" x2="48" y2="19" stroke="#e63946" strokeWidth="0.6" />
                <line x1="45" y1="16" x2="51" y2="16" stroke="#e63946" strokeWidth="0.6" />
              </svg>
            </div>
            <span className="sidebar-brand">
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>MOOD</span>
              <span style={{ color: '#e63946', fontWeight: 800 }}>IFY</span>
            </span>
          </div>
          <div className="sidebar-tagline">— MUSIC FOR EVERY MOOD —</div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <NavItem
              key={item.id}
              item={item}
              active={currentPage === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}

          <div className="sidebar-section-label">Your Library</div>
          {LIBRARY_ITEMS.map(item => (
            <NavItem
              key={item.id}
              item={item}
              active={currentPage === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}

          <div className="sidebar-section-label">Explore</div>
          {EXPLORE_ITEMS.map(item => (
            <NavItem
              key={item.id}
              item={item}
              active={currentPage === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </nav>

        {/* Profile */}
        <div className="sidebar-profile">
          <button
            className="sidebar-profile-btn"
            onClick={() => setProfileOpen(o => !o)}
          >
            <div className="sidebar-avatar">V</div>
            <div className="sidebar-profile-info">
              <div className="sidebar-profile-name">Viveka</div>
              <div className="sidebar-profile-sub">View Profile</div>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>⋯</span>
          </button>
        </div>
      </div>

      {/* Profile dropdown */}
      {profileOpen && (
        <ProfileMenu
          onClose={() => setProfileOpen(false)}
          onNavigate={(page) => { setProfileOpen(false); onNavigate(page); }}
        />
      )}
    </>
  );
}

function NavItem({ item, active, onClick }) {
  return (
    <div
      className={`sidebar-nav-item${active ? ' active' : ''}`}
      onClick={onClick}
      title={item.label}
    >
      <span className="sidebar-nav-icon">{item.icon}</span>
      <span>{item.label}</span>
    </div>
  );
}
