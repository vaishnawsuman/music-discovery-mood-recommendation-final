// ================================================================
// MOODIFY — MOCK DATA & CURATED SONGS
// ================================================================

export const mockSongs = [
  // --- CALM & FOCUS CLASSICAL / AMBIENT ---
  { id: 1,  title: 'Nuvole Bianche',           artist: 'Ludovico Einaudi',   genre: 'Classical', mood: 'Calm',   duration: '05:57', emoji: '🎹', color: '#1a1a2e' },
  { id: 2,  title: 'Experience',               artist: 'Ludovico Einaudi',   genre: 'Classical', mood: 'Focus',  duration: '05:15', emoji: '🎻', color: '#16213e' },
  { id: 3,  title: 'River Flows in You',       artist: 'Yiruma',             genre: 'Classical', mood: 'Calm',   duration: '03:06', emoji: '🌊', color: '#0f3460' },
  { id: 4,  title: 'Weightless',               artist: 'Marconi Union',      genre: 'Ambient',   mood: 'Sleep',  duration: '08:08', emoji: '🌌', color: '#1a1a1a' },
  { id: 5,  title: "Comptine d'un autre été",  artist: 'Yann Tiersen',       genre: 'Classical', mood: 'Calm',   duration: '02:20', emoji: '🎠', color: '#2d1b69' },
  { id: 6,  title: 'Clair de Lune',            artist: 'Claude Debussy',     genre: 'Classical', mood: 'Sleep',  duration: '04:52', emoji: '🌙', color: '#0d1b2a' },
  { id: 7,  title: 'Gymnopédie No.1',          artist: 'Erik Satie',         genre: 'Classical', mood: 'Calm',   duration: '03:05', emoji: '🎶', color: '#1b2838' },
  { id: 8,  title: 'The Rain',                 artist: 'Yiruma',             genre: 'Classical', mood: 'Focus',  duration: '03:41', emoji: '🌧️', color: '#2c3e50' },
  
  // --- POP & HAPPY ---
  { id: 9,  title: 'Blinding Lights',          artist: 'The Weeknd',         genre: 'Pop',       mood: 'Energy', duration: '03:20', emoji: '💡', color: '#1a0533' },
  { id: 10, title: 'Kesariya',                 artist: 'Arijit Singh',       genre: 'Pop',       mood: 'Happy',  duration: '04:28', emoji: '🌸', color: '#2d1b00' },
  { id: 11, title: 'Flowers',                  artist: 'Miley Cyrus',        genre: 'Pop',       mood: 'Happy',  duration: '03:20', emoji: '💐', color: '#3d1a2e' },
  { id: 12, title: 'Calm Reflections',         artist: 'Ludovico Einaudi',   genre: 'Classical', mood: 'Calm',   duration: '04:12', emoji: '😌', color: '#0a2a2a' },
  { id: 13, title: 'Imagine',                  artist: 'John Lennon',        genre: 'Rock',      mood: 'Calm',   duration: '03:07', emoji: '✌️', color: '#1a1a0a' },
  { id: 14, title: 'Shape of You',             artist: 'Ed Sheeran',         genre: 'Pop',       mood: 'Happy',  duration: '03:53', emoji: '💚', color: '#0a2a1a' },
  { id: 15, title: 'Stay With Me',             artist: 'Sam Smith',          genre: 'Pop',       mood: 'Calm',   duration: '02:52', emoji: '🫶', color: '#2a0a1a' },

  // --- HIP-HOP & ENERGY / PARTY ---
  { id: 16, title: 'Lose Yourself',            artist: 'Eminem',             genre: 'Hip-Hop',   mood: 'Energy', duration: '05:26', emoji: '🔥', color: '#3b120c' },
  { id: 17, title: 'SICKO MODE',               artist: 'Travis Scott',       genre: 'Hip-Hop',   mood: 'Party',  duration: '05:12', emoji: '🎤', color: '#1e112a' },
  { id: 18, title: "God's Plan",               artist: 'Drake',              genre: 'Hip-Hop',   mood: 'Energy', duration: '03:18', emoji: '🦉', color: '#2b210e' },
  { id: 19, title: 'HUMBLE.',                  artist: 'Kendrick Lamar',     genre: 'Hip-Hop',   mood: 'Energy', duration: '02:57', emoji: '⚡', color: '#330a0a' },

  // --- ROCK & METAL ---
  { id: 20, title: 'Bohemian Rhapsody',        artist: 'Queen',              genre: 'Rock',      mood: 'Energy', duration: '05:55', emoji: '👑', color: '#1a1f3c' },
  { id: 21, title: 'Back In Black',            artist: 'AC/DC',              genre: 'Rock',      mood: 'Energy', duration: '04:15', emoji: '⚡', color: '#111111' },
  { id: 22, title: 'Master of Puppets',        artist: 'Metallica',          genre: 'Metal',     mood: 'Energy', duration: '08:35', emoji: '🤘', color: '#2d0a0a' },
  { id: 23, title: 'Enter Sandman',            artist: 'Metallica',          genre: 'Metal',     mood: 'Energy', duration: '05:31', emoji: '🎸', color: '#1a0000' },
  { id: 24, title: 'The Trooper',              artist: 'Iron Maiden',        genre: 'Metal',     mood: 'Energy', duration: '04:10', emoji: '🗡️', color: '#3d1c00' },

  // --- JAZZ & BLUES ---
  { id: 25, title: 'Autumn Leaves',            artist: 'Miles Davis',        genre: 'Jazz',      mood: 'Focus',  duration: '10:59', emoji: '🎷', color: '#2b1b00' },
  { id: 26, title: 'Take Five',                artist: 'Dave Brubeck',       genre: 'Jazz',      mood: 'Focus',  duration: '05:24', emoji: '☕', color: '#1c241b' },
  { id: 27, title: 'Fly Me to the Moon',       artist: 'Frank Sinatra',      genre: 'Jazz',      mood: 'Happy',  duration: '02:27', emoji: '🌙', color: '#0d2b3a' },
  { id: 28, title: 'The Thrill Is Gone',       artist: 'B.B. King',          genre: 'Blues',     mood: 'Calm',   duration: '05:24', emoji: '🎸', color: '#171a2e' },
  { id: 29, title: 'Sweet Home Chicago',       artist: 'Buddy Guy',          genre: 'Blues',     mood: 'Happy',  duration: '04:47', emoji: '🏙️', color: '#1e243b' },
  { id: 30, title: 'Pride and Joy',            artist: 'Stevie Ray Vaughan', genre: 'Blues',     mood: 'Energy', duration: '03:40', emoji: '⚡', color: '#2b1e10' },

  // --- DISCO & PARTY ---
  { id: 31, title: "Stayin' Alive",            artist: 'Bee Gees',           genre: 'Disco',     mood: 'Party',  duration: '04:45', emoji: '🕺', color: '#3d2800' },
  { id: 32, title: 'Le Freak',                 artist: 'CHIC',               genre: 'Disco',     mood: 'Party',  duration: '05:27', emoji: '🪩', color: '#2c143d' },
  { id: 33, title: 'Don’t Stop ‘Til You Get Enough', artist: 'Michael Jackson', genre: 'Disco', mood: 'Party', duration: '06:05', emoji: '✨', color: '#381c1c' },
  { id: 34, title: 'Levitating',               artist: 'Dua Lipa',           genre: 'Pop',       mood: 'Party',  duration: '03:23', emoji: '💫', color: '#36113b' },
  { id: 35, title: 'Uptown Funk',              artist: 'Mark Ronson ft. Bruno Mars', genre: 'Pop', mood: 'Party', duration: '04:30', emoji: '🎺', color: '#3b2f0a' },

  // --- COUNTRY ---
  { id: 36, title: 'Take Me Home, Country Roads', artist: 'John Denver',    genre: 'Country',   mood: 'Happy',  duration: '03:10', emoji: '🤠', color: '#2e1f0e' },
  { id: 37, title: 'Tennessee Whiskey',        artist: 'Chris Stapleton',    genre: 'Country',   mood: 'Calm',   duration: '04:53', emoji: '🥃', color: '#38200f' },
  { id: 38, title: 'Jolene',                   artist: 'Dolly Parton',       genre: 'Country',   mood: 'Energy', duration: '02:42', emoji: '🌾', color: '#2d1e0e' },

  // --- REGGAE ---
  { id: 39, title: 'Three Little Birds',       artist: 'Bob Marley',         genre: 'Reggae',    mood: 'Happy',  duration: '03:00', emoji: '🌴', color: '#0d2e1b' },
  { id: 40, title: 'Could You Be Loved',       artist: 'Bob Marley',         genre: 'Reggae',    mood: 'Happy',  duration: '03:57', emoji: '💚', color: '#163820' },
  { id: 41, title: 'Red Red Wine',             artist: 'UB40',               genre: 'Reggae',    mood: 'Calm',   duration: '05:21', emoji: '🍷', color: '#2b0f1a' },

  // --- SLEEP & DEEP AMBIENT ---
  { id: 42, title: 'Moonlight Sonata',         artist: 'Ludwig van Beethoven', genre: 'Classical', mood: 'Sleep', duration: '05:12', emoji: '🌕', color: '#081224' },
  { id: 43, title: 'Ocean Waves & Soft Piano', artist: 'Sleep Oasis',        genre: 'Ambient',   mood: 'Sleep',  duration: '06:30', emoji: '🌊', color: '#0a1d2e' },
  { id: 44, title: 'Deep Work Flow',           artist: 'Focus Lab',          genre: 'Ambient',   mood: 'Focus',  duration: '07:15', emoji: '🎯', color: '#0f291e' },
];

export const mockPlaylists = [
  {
    id: 1, title: 'Calm Study Session',  songs: 26, emoji: '📚', mood: 'Focus',
    color: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    desc: 'Focus-enhancing classical and ambient pieces',
  },
  {
    id: 2, title: 'Workout Energy',      songs: 34, emoji: '💪', mood: 'Energy',
    color: 'linear-gradient(135deg, #E50914, #8B0000)',
    desc: 'High-energy tracks to push your limits',
  },
  {
    id: 3, title: 'Late Night Vibes',    songs: 20, emoji: '🌃', mood: 'Calm',
    color: 'linear-gradient(135deg, #2d1b69, #11998e)',
    desc: 'Chill beats for nighttime unwinding',
  },
  {
    id: 4, title: 'Happy Morning',       songs: 22, emoji: '☀️', mood: 'Happy',
    color: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    desc: 'Start your day with joyful acoustic and pop hits',
  },
  {
    id: 5, title: 'Focus Time',          songs: 30, emoji: '🎯', mood: 'Focus',
    color: 'linear-gradient(135deg, #10B981, #059669)',
    desc: 'Deep work — zero distractions',
  },
  {
    id: 6, title: 'Party Weekend',       songs: 38, emoji: '🎉', mood: 'Party',
    color: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
    desc: 'Bangers to get the crowd dancing',
  },
  {
    id: 7, title: 'Deep Sleep & Relax',  songs: 18, emoji: '🌙', mood: 'Sleep',
    color: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    desc: 'Gentle ambient soundscapes for deep rest',
  },
  {
    id: 8, title: 'Acoustic Roadtrip',   songs: 25, emoji: '🚗', mood: 'Happy',
    color: 'linear-gradient(135deg, #F97316, #D97706)',
    desc: 'Feel-good anthems for scenic open roads',
  },
];

export const mockGenres = [
  { id: 'blues',     name: 'Blues',     emoji: '🎸', count: '2.4K songs', desc: 'Soulful guitar riffs & roots' },
  { id: 'classical', name: 'Classical', emoji: '🎹', count: '5.1K songs', desc: 'Timeless orchestral masterworks' },
  { id: 'country',   name: 'Country',   emoji: '🤠', count: '3.2K songs', desc: 'Acoustic storytelling & folk' },
  { id: 'disco',     name: 'Disco',     emoji: '🪩', count: '1.8K songs', desc: 'Groovy 70s dance floor vibes' },
  { id: 'hiphop',    name: 'Hip-Hop',   emoji: '🎤', count: '8.7K songs', desc: 'Beats, bars & dynamic flow' },
  { id: 'jazz',      name: 'Jazz',      emoji: '🎷', count: '4.3K songs', desc: 'Improvisation & smooth swing' },
  { id: 'metal',     name: 'Metal',     emoji: '🤘', count: '3.9K songs', desc: 'Heavy distortion & intense rhythm' },
  { id: 'pop',       name: 'Pop',       emoji: '⭐', count: '12.1K songs', desc: 'Catchy melodies & modern anthems' },
  { id: 'reggae',    name: 'Reggae',    emoji: '🌴', count: '2.1K songs', desc: 'Island rhythms & positive vibrations' },
  { id: 'rock',      name: 'Rock',      emoji: '🎸', count: '9.4K songs', desc: 'Classic riffs, energy & drive' },
];

export const mockMoods = [
  { id: 'happy',  label: 'Happy',  emoji: '😊', mood: 'I want happy and uplifting music to brighten my day', color: 'linear-gradient(135deg, #F59E0B, #EF4444)' },
  { id: 'calm',   label: 'Calm',   emoji: '😌', mood: 'I need calm and peaceful music to relax my mind',       color: 'linear-gradient(135deg, #06B6D4, #3B82F6)' },
  { id: 'focus',  label: 'Focus',  emoji: '🎯', mood: 'I want deep focus music for studying and concentration', color: 'linear-gradient(135deg, #10B981, #059669)' },
  { id: 'energy', label: 'Energy', emoji: '⚡', mood: 'I need high energy music to power my workout',          color: 'linear-gradient(135deg, #E50914, #B91C1C)' },
  { id: 'party',  label: 'Party',  emoji: '🎉', mood: 'I want party music to get the crowd going',             color: 'linear-gradient(135deg, #EC4899, #8B5CF6)' },
  { id: 'sleep',  label: 'Sleep',  emoji: '🌙', mood: 'I need soft and soothing music to help me sleep',       color: 'linear-gradient(135deg, #6366F1, #312E81)' },
];

export const quickVibes = mockMoods;

export const recentSearches = [
  'Arijit Singh', 'Ludovico Einaudi', 'The Weeknd', 'Metallica', 'Bob Marley', 'Eminem',
];

export const trendingSearches = [
  { id: 9,  title: 'Blinding Lights',   artist: 'The Weeknd',       emoji: '💡' },
  { id: 10, title: 'Kesariya',          artist: 'Arijit Singh',     emoji: '🌸' },
  { id: 1,  title: 'Nuvole Bianche',    artist: 'Ludovico Einaudi', emoji: '🎹' },
  { id: 16, title: 'Lose Yourself',     artist: 'Eminem',           emoji: '🔥' },
  { id: 20, title: 'Bohemian Rhapsody', artist: 'Queen',            emoji: '👑' },
];

export const moodExamples = [
  'I need energetic music for workout',
  'Something relaxing for sleep',
  'Happy songs for a road trip',
  'Focus music for studying',
];

export const recentSongs = mockSongs.slice(0, 8);

// Mock recommendation algorithm for POST /recommend
export const getMockRecommendation = (moodText) => {
  const lower = moodText.toLowerCase();
  let mood = 'Calm';
  let genre = 'Classical / Ambient';
  let tempo = 'Slow';
  let energy = 'Low';
  let songs = mockSongs.filter(s => s.mood === 'Calm').slice(0, 6);
  let why = 'These classical and ambient pieces feature slow tempos, soft dynamics, and minimal percussion — ideal for a calm, focused listening experience that matches your mood perfectly.';

  if (lower.includes('workout') || lower.includes('energy') || lower.includes('run') || lower.includes('gym')) {
    mood = 'Energetic';
    genre = 'Hip-Hop / Rock / Pop';
    tempo = 'Fast (128-140 BPM)';
    energy = 'High';
    songs = mockSongs.filter(s => s.mood === 'Energy' || s.genre === 'Hip-Hop' || s.genre === 'Rock').slice(0, 6);
    why = 'These high-tempo tracks with strong driving beats, powerful vocals, and energetic rhythms will elevate your heart rate and keep you motivated throughout your session.';
  } else if (lower.includes('happy') || lower.includes('road trip') || lower.includes('morning') || lower.includes('joy')) {
    mood = 'Happy & Uplifting';
    genre = 'Pop / Acoustic';
    tempo = 'Upbeat (115-125 BPM)';
    energy = 'Medium-High';
    songs = mockSongs.filter(s => s.mood === 'Happy' || s.genre === 'Pop').slice(0, 6);
    why = 'Bright, cheerful melodies with positive lyrics and infectious upbeat grooves — crafted to instantly elevate your spirits and bring positive energy.';
  } else if (lower.includes('sleep') || lower.includes('rest') || lower.includes('night') || lower.includes('bed')) {
    mood = 'Deep Sleep & Relax';
    genre = 'Ambient / Gentle Piano';
    tempo = 'Very Slow (55-65 BPM)';
    energy = 'Very Low';
    songs = mockSongs.filter(s => s.mood === 'Sleep' || s.genre === 'Ambient').slice(0, 6);
    if (songs.length < 4) songs = mockSongs.slice(0, 5);
    why = 'Extremely gentle, minimal compositions with long sustained notes, warm harmonics, and peaceful dynamics — specially arranged to ease neural tension and invite sleep.';
  } else if (lower.includes('focus') || lower.includes('study') || lower.includes('work') || lower.includes('code') || lower.includes('read')) {
    mood = 'Deep Focus & Flow';
    genre = 'Classical / Minimalist';
    tempo = 'Moderate (70-90 BPM)';
    energy = 'Low-Medium';
    songs = mockSongs.filter(s => s.mood === 'Focus' || s.genre === 'Classical' || s.genre === 'Jazz').slice(0, 6);
    why = 'Carefully selected instrumental pieces that engage the mind without distraction — the absence of lyrics and steady rhythmic structure optimizes your cognitive flow state.';
  } else if (lower.includes('party') || lower.includes('dance') || lower.includes('club')) {
    mood = 'Party & Dance';
    genre = 'Disco / Pop / Hip-Hop';
    tempo = 'High (124-130 BPM)';
    energy = 'Maximum';
    songs = mockSongs.filter(s => s.mood === 'Party' || s.genre === 'Disco').slice(0, 6);
    why = 'Infectious rhythm sections, punchy basslines, and danceable beats designed to get everyone moving and amplify the celebratory atmosphere.';
  }

  if (songs.length === 0) {
    songs = mockSongs.slice(0, 6);
  }

  return {
    moodText,
    analysis: { mood, genre, tempo, energy },
    songs,
    why,
  };
};
