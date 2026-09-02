import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

const THEMES = [
  { id: 'dark',   label: 'Dark Mode',   icon: '🌑', desc: 'Sleek black & dark contrast' },
  { id: 'light',  label: 'Light Mode',  icon: '☀️', desc: 'Clean high-clarity brightness' },
  { id: 'system', label: 'System Match', icon: '💻', desc: 'Sync with OS preference' },
];

const AUDIO_QUALITIES = [
  { id: 'normal',   label: 'Normal',   bitrate: '160 kbps', desc: 'Data saver' },
  { id: 'high',     label: 'High',     bitrate: '320 kbps', desc: 'Rich crystal sound' },
  { id: 'lossless', label: 'Hi-Fi Lossless', bitrate: '24-bit / 96kHz', desc: 'Studio master' },
];

const SETTINGS_STORAGE_KEY = 'moodify_user_settings';

export default function Settings({ onNavigate }) {
  const {
    theme, setTheme,
    accent, setAccent,
    adaptiveMood, setAdaptiveMood,
    accentColors,
  } = useTheme();

  // Playback settings
  const [autoplay, setAutoplay] = useState(true);
  const [audioQuality, setAudioQuality] = useState('high');
  const [crossfade, setCrossfade] = useState(true);
  const [normalizeVolume, setNormalizeVolume] = useState(true);

  // Notification settings
  const [notifications, setNotifications] = useState(true);
  const [recommendationAlerts, setRecommendationAlerts] = useState(true);
  const [newReleases, setNewReleases] = useState(false);

  // Account modal / status
  const [saved, setSaved] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [accountEditModal, setAccountEditModal] = useState(false);
  const [userName, setUserName] = useState('Viveka');
  const [userEmail, setUserEmail] = useState('viveka@moodify.ai');

  // Load saved preferences
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.autoplay !== undefined) setAutoplay(parsed.autoplay);
        if (parsed.audioQuality) setAudioQuality(parsed.audioQuality);
        if (parsed.crossfade !== undefined) setCrossfade(parsed.crossfade);
        if (parsed.normalizeVolume !== undefined) setNormalizeVolume(parsed.normalizeVolume);
        if (parsed.notifications !== undefined) setNotifications(parsed.notifications);
        if (parsed.recommendationAlerts !== undefined) setRecommendationAlerts(parsed.recommendationAlerts);
        if (parsed.userName) setUserName(parsed.userName);
        if (parsed.userEmail) setUserEmail(parsed.userEmail);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSave = () => {
    try {
      const payload = {
        autoplay,
        audioQuality,
        crossfade,
        normalizeVolume,
        notifications,
        recommendationAlerts,
        userName,
        userEmail,
      };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error(e);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    setLogoutModal(false);
    alert('You have been logged out successfully.');
    onNavigate?.('home');
  };

  return (
    <div className="page-content fade-in" style={{ maxWidth: 780, paddingBottom: 60 }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="settings-header-badge">⚙</div>
          <div>
            <div className="page-title">Settings</div>
            <div className="page-subtitle">Manage your audio playback, appearance, notifications, and account</div>
          </div>
        </div>
      </div>

      {/* 1. APPEARANCE SECTION */}
      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">🎨</div>
          <div>
            <div className="settings-section-title">Appearance</div>
            <div className="settings-section-desc">Customize theme modes and ambient accent colors</div>
          </div>
        </div>

        <div className="settings-card">
          {/* Theme selection */}
          <div className="settings-subheading">Theme Mode</div>
          <div className="settings-theme-options">
            {THEMES.map(t => (
              <div
                key={t.id}
                className={`settings-theme-option${theme === t.id ? ' active' : ''}`}
                onClick={() => setTheme(t.id)}
              >
                <div className="settings-theme-icon">{t.icon}</div>
                <div className="settings-theme-label">{t.label}</div>
                <div className="settings-theme-desc">{t.desc}</div>
              </div>
            ))}
          </div>

          {/* Accent color */}
          <div className="settings-subheading" style={{ marginTop: 24 }}>
            Accent Color <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}>(Default: Red)</span>
          </div>
          <div className="settings-accent-row">
            {Object.entries(accentColors).map(([key, color]) => (
              <div
                key={key}
                className={`accent-swatch${accent === key ? ' active' : ''}`}
                style={{ background: color.hex }}
                onClick={() => setAccent(key)}
                title={`${color.label} Accent`}
              />
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
            Selected: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{accentColors[accent]?.label || 'Red'}</span>
          </div>

          {/* Adaptive Mood Theme Toggle */}
          <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
            <div className="settings-toggle-row">
              <div className="settings-toggle-info">
                <div className="settings-toggle-label">Adaptive Mood Lighting</div>
                <div className="settings-toggle-desc">
                  Dynamically tint ambient accents to match the emotion of generated playlists
                </div>
              </div>
              <div
                className={`toggle-switch${adaptiveMood ? ' on' : ''}`}
                onClick={() => setAdaptiveMood(m => !m)}
                role="switch"
                aria-checked={adaptiveMood}
                tabIndex={0}
              >
                <div className="toggle-knob" />
              </div>
            </div>
          </div>

          {adaptiveMood && (
            <div className="settings-preview">
              <div className="preview-label">Live Waveform Theme Preview</div>
              <div className="preview-waveform">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="preview-wave-bar" style={{ animationDelay: `${i * 0.04}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. PLAYBACK SECTION */}
      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">🎧</div>
          <div>
            <div className="settings-section-title">Playback</div>
            <div className="settings-section-desc">Fine-tune audio streaming quality and queue behavior</div>
          </div>
        </div>

        <div className="settings-card">
          {/* Autoplay Toggle */}
          <div className="settings-toggle-row">
            <div className="settings-toggle-info">
              <div className="settings-toggle-label">Autoplay Similar Songs</div>
              <div className="settings-toggle-desc">
                Keep the music flowing with intelligent recommendations when your queue finishes
              </div>
            </div>
            <div
              className={`toggle-switch${autoplay ? ' on' : ''}`}
              onClick={() => setAutoplay(a => !a)}
              role="switch"
              aria-checked={autoplay}
            >
              <div className="toggle-knob" />
            </div>
          </div>

          {/* Audio Quality Selection */}
          <div style={{ marginTop: 18, marginBottom: 18 }}>
            <div className="settings-subheading" style={{ marginBottom: 10 }}>Audio Streaming Quality</div>
            <div className="quality-grid">
              {AUDIO_QUALITIES.map(q => (
                <div
                  key={q.id}
                  className={`quality-card${audioQuality === q.id ? ' active' : ''}`}
                  onClick={() => setAudioQuality(q.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span className="quality-card-label">{q.label}</span>
                    {audioQuality === q.id && <span style={{ color: 'var(--accent)', fontSize: 13 }}>✓</span>}
                  </div>
                  <div className="quality-card-bitrate">{q.bitrate}</div>
                  <div className="quality-card-desc">{q.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Crossfade */}
          <div className="settings-toggle-row">
            <div className="settings-toggle-info">
              <div className="settings-toggle-label">Smooth Crossfade</div>
              <div className="settings-toggle-desc">
                Seamlessly blend track transitions without silence gaps
              </div>
            </div>
            <div
              className={`toggle-switch${crossfade ? ' on' : ''}`}
              onClick={() => setCrossfade(c => !c)}
              role="switch"
              aria-checked={crossfade}
            >
              <div className="toggle-knob" />
            </div>
          </div>

          {/* Normalize Volume */}
          <div className="settings-toggle-row">
            <div className="settings-toggle-info">
              <div className="settings-toggle-label">Normalize Volume</div>
              <div className="settings-toggle-desc">
                Set uniform loudness levels across different tracks and genres
              </div>
            </div>
            <div
              className={`toggle-switch${normalizeVolume ? ' on' : ''}`}
              onClick={() => setNormalizeVolume(n => !n)}
              role="switch"
              aria-checked={normalizeVolume}
            >
              <div className="toggle-knob" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. NOTIFICATIONS SECTION */}
      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">🔔</div>
          <div>
            <div className="settings-section-title">Notifications</div>
            <div className="settings-section-desc">Manage system alerts and personalized discovery updates</div>
          </div>
        </div>

        <div className="settings-card">
          {/* General Notifications */}
          <div className="settings-toggle-row">
            <div className="settings-toggle-info">
              <div className="settings-toggle-label">Push Notifications</div>
              <div className="settings-toggle-desc">
                Receive important playback alerts and app updates
              </div>
            </div>
            <div
              className={`toggle-switch${notifications ? ' on' : ''}`}
              onClick={() => setNotifications(n => !n)}
              role="switch"
              aria-checked={notifications}
            >
              <div className="toggle-knob" />
            </div>
          </div>

          {/* Recommendation Alerts */}
          <div className="settings-toggle-row">
            <div className="settings-toggle-info">
              <div className="settings-toggle-label">Recommendation Alerts</div>
              <div className="settings-toggle-desc">
                Get notified when fresh AI mood playlists and weekly mixes are generated for you
              </div>
            </div>
            <div
              className={`toggle-switch${recommendationAlerts ? ' on' : ''}`}
              onClick={() => setRecommendationAlerts(r => !r)}
              role="switch"
              aria-checked={recommendationAlerts}
            >
              <div className="toggle-knob" />
            </div>
          </div>

          {/* New Releases */}
          <div className="settings-toggle-row">
            <div className="settings-toggle-info">
              <div className="settings-toggle-label">New Releases from Favorite Artists</div>
              <div className="settings-toggle-desc">
                Stay updated when your favorite artists release new tracks or albums
              </div>
            </div>
            <div
              className={`toggle-switch${newReleases ? ' on' : ''}`}
              onClick={() => setNewReleases(nr => !nr)}
              role="switch"
              aria-checked={newReleases}
            >
              <div className="toggle-knob" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. ACCOUNT SECTION */}
      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">👤</div>
          <div>
            <div className="settings-section-title">Account & Security</div>
            <div className="settings-section-desc">Manage your subscription profile and login security</div>
          </div>
        </div>

        <div className="settings-card">
          <div className="account-card-body">
            <div className="account-avatar">
              {userName ? userName[0].toUpperCase() : 'V'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span className="account-user-name">{userName}</span>
                <span className="account-plan-badge">Moodify VIP Master</span>
              </div>
              <div className="account-user-email">{userEmail}</div>
              <div className="account-plan-status">Plan active · Auto-renews Dec 2026</div>
            </div>
            <button
              className="manage-account-btn"
              onClick={() => setAccountEditModal(true)}
            >
              Manage Account
            </button>
          </div>

          <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Session Security</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sign out of your account on this device</div>
            </div>
            <button
              className="logout-action-btn"
              onClick={() => setLogoutModal(true)}
            >
              <span>⎋</span> Logout
            </button>
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <button className="save-settings-btn" onClick={handleSave}>
          {saved ? '✓ Settings Saved Successfully!' : '⊞ Save Settings'}
        </button>
      </div>

      {/* Account Edit Modal */}
      {accountEditModal && (
        <div className="modal-overlay" onClick={() => setAccountEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Edit Account Information</div>
              <button className="modal-close" onClick={() => setAccountEditModal(false)}>✕</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Display Name
              </label>
              <input
                className="modal-input"
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                className="modal-input"
                type="email"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="modal-btn-cancel" onClick={() => setAccountEditModal(false)}>Cancel</button>
              <button
                className="modal-btn-primary"
                onClick={() => {
                  handleSave();
                  setAccountEditModal(false);
                }}
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {logoutModal && (
        <div className="modal-overlay" onClick={() => setLogoutModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 420, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚪</div>
            <div className="modal-title" style={{ marginBottom: 8 }}>Sign Out of Moodify?</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
              Are you sure you want to log out? Your playback state and offline cache will be safely preserved.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="modal-btn-cancel" onClick={() => setLogoutModal(false)}>Cancel</button>
              <button
                className="logout-confirm-btn"
                onClick={handleLogout}
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
