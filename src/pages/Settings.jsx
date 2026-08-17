import { useState } from 'react';
import { useTheme, ACCENT_COLORS } from '../context/ThemeContext.jsx';

const THEMES = [
  { id: 'dark',   label: 'Dark',   icon: '🌑' },
  { id: 'light',  label: 'Light',  icon: '☀️' },
  { id: 'system', label: 'System', icon: '💻' },
];

export default function Settings() {
  const {
    theme, setTheme,
    accent, setAccent,
    adaptiveMood, setAdaptiveMood,
    accentColors,
  } = useTheme();

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="page-content fade-in" style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div className="page-title">Appearance</div>
        <div className="page-subtitle">Customize how MOODIFY looks and feels</div>
      </div>

      {/* Theme */}
      <div className="settings-card">
        <div className="settings-card-title">Theme</div>
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
      <div className="settings-card">
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
          Currently: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{accentColors[accent]?.label}</span>
        </div>
      </div>

      {/* Adaptive Mood Theme */}
      <div className="settings-card">
        <div className="settings-card-title">Adaptive Mood Theme</div>
        <div className="settings-toggle-row">
          <div className="settings-toggle-info">
            <div className="settings-toggle-label">Adaptive Mood Theme</div>
            <div className="settings-toggle-desc">
              Let the app change theme based on your mood
              <br />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Calm → Blue · Focus → Green · Energy → Red · Happy → Orange · Sleep → Purple
              </span>
            </div>
          </div>
          <div
            className={`toggle-switch${adaptiveMood ? ' on' : ''}`}
            onClick={() => setAdaptiveMood(m => !m)}
          >
            <div className="toggle-knob" />
          </div>
        </div>

        {/* Preview */}
        {adaptiveMood && (
          <div className="settings-preview">
            <div className="preview-label">Preview — Current Theme</div>
            <div className="preview-waveform">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="preview-wave-bar" style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
              }}>▶</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Weightless</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Marconi Union</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save */}
      <button className="save-settings-btn" onClick={handleSave}>
        {saved ? '✓ Changes Saved!' : '⊞ Save Changes'}
      </button>
    </div>
  );
}
