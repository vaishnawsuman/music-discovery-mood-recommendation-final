import { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';

const THEMES = [
  { id: 'dark',   label: 'Dark',   icon: '🌑' },
  { id: 'light',  label: 'Light',  icon: '☀️' },
  { id: 'system', label: 'System', icon: '💻' },
];

export default function Profile({ onNavigate }) {
  const { theme, setTheme, accent, setAccent, adaptiveMood, setAdaptiveMood, accentColors } = useTheme();
  const { likedTracks, recentlyPlayed } = usePlayer();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="page-content fade-in" style={{ maxWidth: 740 }}>
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #180808 0%, var(--bg-card) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
      }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10B981, #059669)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          fontWeight: 800,
          color: '#ffffff',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
        }}>
          N
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            Viveka
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Premium Mood Listener · Member since 2026
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div
              onClick={() => onNavigate?.('favorites')}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{likedTracks.size}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Favorites</span>
            </div>
            <div
              onClick={() => onNavigate?.('recent')}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{recentlyPlayed.length}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Recently Played</span>
            </div>
            <div
              onClick={() => onNavigate?.('library')}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>6+</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Playlists</span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-header" style={{ marginBottom: 18 }}>
        <div className="page-title">App Preferences</div>
        <div className="page-subtitle">Customize theme, accents and intelligence</div>
      </div>

      {/* Theme */}
      <div className="settings-card" style={{ marginBottom: 18 }}>
        <div className="settings-card-title">Theme Mode</div>
        <div className="settings-theme-options">
          {THEMES.map(t => (
            <div
              key={t.id}
              className={`settings-theme-option${theme === t.id ? ' active' : ''}`}
              onClick={() => setTheme(t.id)}
            >
              <div className="settings-theme-icon">{t.icon}</div>
              <div className="settings-theme-label">{t.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div className="settings-card" style={{ marginBottom: 18 }}>
        <div className="settings-card-title">Accent Color</div>
        <div className="settings-accent-row">
          {Object.entries(accentColors).map(([key, color]) => (
            <div
              key={key}
              className={`accent-swatch${accent === key ? ' active' : ''}`}
              style={{ background: color.hex }}
              onClick={() => setAccent(key)}
              title={color.label}
            />
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)' }}>
          Active Accent: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{accentColors[accent]?.label}</span>
        </div>
      </div>

      {/* Adaptive Mood Theme */}
      <div className="settings-card" style={{ marginBottom: 24 }}>
        <div className="settings-card-title">Adaptive Mood Lighting</div>
        <div className="settings-toggle-row">
          <div className="settings-toggle-info">
            <div className="settings-toggle-label">Dynamic Vibe Responsive UI</div>
            <div className="settings-toggle-desc">
              Automatically morph accent colors and ambient glow based on generated moods.
            </div>
          </div>
          <div
            className={`toggle-switch${adaptiveMood ? ' on' : ''}`}
            onClick={() => setAdaptiveMood(m => !m)}
          >
            <div className="toggle-knob" />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button className="save-settings-btn" onClick={handleSave}>
        {saved ? '✓ Preferences Saved!' : '⊞ Save Preferences'}
      </button>
    </div>
  );
}
