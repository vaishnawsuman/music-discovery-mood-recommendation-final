import { createContext, useContext, useState, useEffect } from 'react';
import { mockSongs } from '../data/mockData.js';

const PlayerContext = createContext();

const FAVORITES_KEY = 'moodify_favorites';
const RECENT_KEY = 'moodify_recently_played';
const PLAYLISTS_KEY = 'moodify_saved_playlists';

export function PlayerProvider({ children }) {
  // Current track and playback state
  const [currentTrack, setCurrentTrack] = useState(() => {
    return mockSongs[0] || null;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // percent
  const [volume, setVolume] = useState(75);    // percent
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [currentQueue, setCurrentQueue] = useState(mockSongs);

  // Favorites (Set of track IDs)
  const [likedTracks, setLikedTracks] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
    return new Set([1, 2, 9, 14]); // default curated favorites
  });

  // Recently played tracks (Array of song objects)
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load recently played', e);
    }
    return mockSongs.slice(0, 6); // default recently played
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(likedTracks)));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [likedTracks]);

  // Save recently played to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyPlayed));
    } catch (e) {
      console.error('Failed to save recently played', e);
    }
  }, [recentlyPlayed]);

  // Play track action
  const playTrack = (track, queue = null) => {
    if (!track) return;
    
    if (queue && Array.isArray(queue)) {
      setCurrentQueue(queue);
    }

    if (currentTrack?.id === track.id) {
      setIsPlaying(prev => !prev);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgress(0);

      // Add to recently played without duplicates, newest first
      setRecentlyPlayed(prev => {
        const filtered = prev.filter(s => s.id !== track.id);
        const updated = [track, ...filtered];
        return updated.slice(0, 50); // cap at 50 songs
      });
    }
  };

  // Next Track
  const playNext = () => {
    const queue = currentQueue.length > 0 ? currentQueue : mockSongs;
    if (!currentTrack || queue.length === 0) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      playTrack(queue[randomIndex]);
      return;
    }

    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    playTrack(queue[nextIndex]);
  };

  // Previous Track
  const playPrev = () => {
    const queue = currentQueue.length > 0 ? currentQueue : mockSongs;
    if (!currentTrack || queue.length === 0) return;

    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    playTrack(queue[prevIndex]);
  };

  // Toggle favorite
  const toggleLike = (trackId) => {
    setLikedTracks(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  };

  const isLiked = (trackId) => likedTracks.has(trackId);

  // Get list of favorite song objects
  const getFavoriteSongs = (allSongs = mockSongs) => {
    return allSongs.filter(song => likedTracks.has(song.id));
  };

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      setIsPlaying,
      progress,
      setProgress,
      volume,
      setVolume,
      isShuffle,
      setIsShuffle,
      isRepeat,
      setIsRepeat,
      currentQueue,
      setCurrentQueue,
      recentlyPlayed,
      setRecentlyPlayed,
      likedTracks,
      playTrack,
      playNext,
      playPrev,
      toggleLike,
      isLiked,
      getFavoriteSongs,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
