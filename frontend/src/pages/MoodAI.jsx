import { useState } from 'react';
import { moodExamples } from '../data/mockData.js';
import { useTheme } from '../context/ThemeContext.jsx';

const MAX_CHARS = 200;

export default function MoodAI({ onGenerate, initialText = '' }) {
  // Fix: initialText null hone par text null nahi hoga
  const [text, setText] = useState(initialText || '');
  const [loading, setLoading] = useState(false);
  const { applyMoodTheme } = useTheme();

  const handleGenerate = async () => {
    const moodText = (text || '').trim();

    if (!moodText || loading) return;

    setLoading(true);

    // Apply adaptive mood theme
    const lower = moodText.toLowerCase();

    if (
      lower.includes('calm') ||
      lower.includes('peace') ||
      lower.includes('relax')
    ) {
      applyMoodTheme('calm');
    } else if (
      lower.includes('focus') ||
      lower.includes('study') ||
      lower.includes('work') ||
      lower.includes('code')
    ) {
      applyMoodTheme('focus');
    } else if (
      lower.includes('energy') ||
      lower.includes('workout') ||
      lower.includes('run') ||
      lower.includes('gym')
    ) {
      applyMoodTheme('energy');
    } else if (
      lower.includes('happy') ||
      lower.includes('joy') ||
      lower.includes('trip')
    ) {
      applyMoodTheme('happy');
    } else if (
      lower.includes('sleep') ||
      lower.includes('night') ||
      lower.includes('rest')
    ) {
      applyMoodTheme('sleep');
    }

    setLoading(false);

    // Send mood to App.jsx
    onGenerate(moodText);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleExample = (example) => {
    setText(example || '');
  };

  const remaining = MAX_CHARS - text.length;

  return (
    <div className="mood-ai-page fade-in">
      {/* Hero */}
      <div className="mood-ai-hero">
        <h1>Tell us your mood</h1>
        <p>
          Our AI will understand your mood and create the perfect playlist for you.
        </p>

        {/* Waveform Animation */}
        <div className="mood-ai-waveform">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="mood-ai-wave-bar" />
          ))}
        </div>
      </div>

      {/* Input Card */}
      <div className="mood-input-card">
        <textarea
          className="mood-textarea"
          placeholder="I want peaceful music for studying at night..."
          value={text}
          onChange={e => {
            if (e.target.value.length <= MAX_CHARS) {
              setText(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        <div className="mood-textarea-footer">
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Press Enter to generate · Shift+Enter for new line
          </span>

          <span
            className="mood-char-count"
            style={{
              color:
                remaining < 20
                  ? 'var(--accent)'
                  : 'var(--text-muted)',
            }}
          >
            {text.length}/{MAX_CHARS}
          </span>
        </div>
      </div>

      {/* CTA */}
      <button
        className="mood-generate-btn"
        onClick={handleGenerate}
        disabled={!text.trim() || loading}
      >
        {loading ? (
          <>
            <div className="spinner" />
            <span>Understanding your mood...</span>
          </>
        ) : (
          <>
            <span>✦</span>
            <span>✦ Generate My Playlist</span>
          </>
        )}
      </button>

      {/* Examples */}
      <div className="mood-examples">
        <div className="mood-examples-title">
          Try these examples
        </div>

        <div className="mood-examples-grid">
          {moodExamples.map((ex, i) => (
            <button
              key={i}
              className="mood-example-chip"
              onClick={() => handleExample(ex)}
            >
              "{ex}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
