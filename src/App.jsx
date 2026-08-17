import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import MusicPlayer from './components/MusicPlayer.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import MoodAI from './pages/MoodAI.jsx';
import Recommendations from './pages/Recommendations.jsx';
import Library from './pages/Library.jsx';
import Favorites from './pages/Favorites.jsx';
import RecentlyPlayed from './pages/RecentlyPlayed.jsx';
import Genres from './pages/Genres.jsx';
import Discover from './pages/Discover.jsx';
import Profile from './pages/Profile.jsx';
import './styles.css';

function AppShell() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pendingMood, setPendingMood] = useState(null);
  const [recoMoodText, setRecoMoodText] = useState(null);

  const navigate = (page) => {
    setCurrentPage(page);
    if (page !== 'recommendations') setRecoMoodText(null);
  };

  // Called from Home quick-vibe or MoodAI page
  const handleMoodGenerate = (moodText) => {
    setRecoMoodText(moodText);
    setCurrentPage('recommendations');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            onNavigate={navigate}
            onMoodGenerate={(txt) => {
              setPendingMood(txt);
              navigate('moodai');
            }}
          />
        );
      case 'search':
        return <Search />;
      case 'moodai':
      case 'mood-ai':
        return (
          <MoodAI
            initialText={pendingMood}
            onGenerate={(txt) => {
              setPendingMood(null);
              handleMoodGenerate(txt);
            }}
          />
        );
      case 'recommendations':
        return (
          <Recommendations
            moodText={recoMoodText || 'I want peaceful music for studying at night'}
            onBack={() => navigate('moodai')}
          />
        );
      case 'library':
      case 'playlists':
        return <Library onNavigate={navigate} />;
      case 'favorites':
        return <Favorites onNavigate={navigate} />;
      case 'recent':
      case 'recently-played':
        return <RecentlyPlayed onNavigate={navigate} />;
      case 'genres':
        return <Genres onNavigate={navigate} />;
      case 'discover':
        return <Discover onNavigate={navigate} />;
      case 'profile':
      case 'settings':
        return <Profile onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} onMoodGenerate={handleMoodGenerate} />;
    }
  };

  // Determine which nav item is active
  const activeNav = () => {
    if (currentPage === 'recommendations' || currentPage === 'mood-ai') return 'moodai';
    if (currentPage === 'playlists') return 'library';
    if (currentPage === 'recently-played') return 'recent';
    if (currentPage === 'settings') return 'profile';
    return currentPage;
  };

  return (
    <div className="app-layout">
      {/* Fixed Left Sidebar */}
      <div className="app-sidebar">
        <Sidebar
          currentPage={activeNav()}
          onNavigate={navigate}
        />
      </div>

      {/* Scrollable Main Content */}
      <main className="app-main">
        {renderPage()}
      </main>

      {/* Fixed Bottom Music Player */}
      <div className="app-player">
        <MusicPlayer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <AppShell />
      </PlayerProvider>
    </ThemeProvider>
  );
}