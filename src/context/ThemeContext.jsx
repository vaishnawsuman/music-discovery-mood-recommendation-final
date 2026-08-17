import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ACCENT_COLORS = {
  red:    { label: 'Red',    value: '#E50914', hex: '#E50914' },
  purple: { label: 'Purple', value: '#8B5CF6', hex: '#8B5CF6' },
  blue:   { label: 'Blue',   value: '#3B82F6', hex: '#3B82F6' },
  green:  { label: 'Green',  value: '#10B981', hex: '#10B981' },
  orange: { label: 'Orange', value: '#F59E0B', hex: '#F59E0B' },
};

export const MOOD_THEMES = {
  calm:    { accent: 'blue',   label: 'Calm' },
  focus:   { accent: 'green',  label: 'Focus' },
  energy:  { accent: 'red',    label: 'Energy' },
  happy:   { accent: 'orange', label: 'Happy' },
  relax:   { accent: 'purple', label: 'Relax' },
  party:   { accent: 'red',    label: 'Party' },
  sleep:   { accent: 'purple', label: 'Sleep' },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');       // dark | light | system
  const [accent, setAccent] = useState('red');      // red | purple | blue | green | orange
  const [adaptiveMood, setAdaptiveMood] = useState(false);
  const [activeMood, setActiveMood] = useState(null);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    let resolvedTheme = theme;
    if (theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.setAttribute('data-theme', resolvedTheme);
  }, [theme]);

  // Apply accent color
  useEffect(() => {
    const activeAccent = adaptiveMood && activeMood && MOOD_THEMES[activeMood]
      ? MOOD_THEMES[activeMood].accent
      : accent;
    document.documentElement.setAttribute('data-accent', activeAccent === 'red' ? '' : activeAccent);
  }, [accent, adaptiveMood, activeMood]);

  const applyMoodTheme = (mood) => {
    setActiveMood(mood);
  };

  return (
    <ThemeContext.Provider value={{
      theme, setTheme,
      accent, setAccent,
      adaptiveMood, setAdaptiveMood,
      activeMood, applyMoodTheme,
      accentColors: ACCENT_COLORS,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
