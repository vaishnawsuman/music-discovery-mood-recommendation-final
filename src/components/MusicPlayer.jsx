import { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext.jsx';

export default function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    setProgress,
    volume,
    setVolume,
    isShuffle,
    setIsShuffle,
    isRepeat,
    setIsRepeat,
    playTrack,
    playNext,
    playPrev,
    toggleLike,
    isLiked,
  } = usePlayer();

  const [localProgress, setLocalProgress] = useState(progress);

  useEffect(() => {
    setLocalProgress(progress);
  }, [progress]);

  // Simulate playback progress
  useEffect(() => {
    if (!isPlaying || !currentTrack) return;
    const id = setInterval(() => {
      setLocalProgress(p => {
        if (p >= 100) {
          if (isRepeat) {
            return 0;
          } else {
            playNext();
            return 0;
          }
        }
        return p + 0.25;
      });
    }, 300);
    return () => clearInterval(id);
  }, [isPlaying, currentTrack, isRepeat, playNext]);

  useEffect(() => {
    setProgress(localProgress);
  }, [localProgress, setProgress]);

  const formatTime = (pct, total = '4:00') => {
    if (!total || total === '—') return '0:00';
    const parts = total.split(':').map(Number);
    const m = parts[0] || 0;
    const s = parts[1] || 0;
    const totalSec = m * 60 + s;
    const elapsed = Math.floor((pct / 100) * totalSec);
    const mm = Math.floor(elapsed / 60);
    const ss = elapsed % 60;
    return `${mm}:${ss.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return (
      <div className="music-player" style={{ justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🎵</span>
          <span>Select a song to start playing</span>
        </div>
      </div>
    );
  }

  const liked = isLiked(currentTrack.id);

  return (
    <div className="music-player">
      {/* LEFT — Track Info */}
      <div className="player-left">
        <div className="player-art" style={{ background: currentTrack.color || 'var(--bg-card-alt)' }}>
          <span>{currentTrack.emoji || '🎵'}</span>
        </div>
        <div className="player-track-info">
          <div className="player-track-title">{currentTrack.title}</div>
          <div className="player-track-artist">{currentTrack.artist}</div>
        </div>
        <button
          className={`player-like-btn${liked ? ' liked' : ''}`}
          onClick={() => toggleLike(currentTrack.id)}
          title={liked ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          {liked ? '♥' : '♡'}
        </button>
      </div>

      {/* CENTER — Controls + Progress */}
      <div className="player-center">
        <div className="player-controls">
          <button
            className={`player-ctrl-btn${isShuffle ? ' active' : ''}`}
            onClick={() => setIsShuffle(s => !s)}
            title={isShuffle ? 'Shuffle: On' : 'Shuffle: Off'}
          >
            ⇄
          </button>
          <button
            className="player-ctrl-btn"
            onClick={playPrev}
            title="Previous"
          >
            ⏮
          </button>

          <button
            className="player-play-btn"
            onClick={() => playTrack(currentTrack)}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <span style={{ fontSize: 12, letterSpacing: 1 }}>❚❚</span>
            ) : (
              <span style={{ marginLeft: 2 }}>▶</span>
            )}
          </button>

          <button
            className="player-ctrl-btn"
            onClick={playNext}
            title="Next"
          >
            ⏭
          </button>
          <button
            className={`player-ctrl-btn${isRepeat ? ' active' : ''}`}
            onClick={() => setIsRepeat(r => !r)}
            title={isRepeat ? 'Repeat: On' : 'Repeat: Off'}
          >
            ↺
          </button>
        </div>

        <div className="player-progress">
          <span className="player-time">
            {formatTime(localProgress, currentTrack.duration)}
          </span>
          <div
            className="player-progress-track"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = ((e.clientX - rect.left) / rect.width) * 100;
              setLocalProgress(Math.max(0, Math.min(100, pct)));
            }}
          >
            <div
              className="player-progress-fill"
              style={{ width: `${localProgress}%` }}
            />
          </div>
          <span className="player-time end">{currentTrack.duration || '3:45'}</span>
        </div>
      </div>

      {/* RIGHT — Volume + Visualizer */}
      <div className="player-right">
        {isPlaying && (
          <div className="eq-bars" title="Playing">
            <div className="eq-bar" />
            <div className="eq-bar" />
            <div className="eq-bar" />
            <div className="eq-bar" />
          </div>
        )}
        <div className="player-vol-container">
          <span className="player-vol-icon" title="Volume">🔊</span>
          <div
            className="player-vol-slider"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = ((e.clientX - rect.left) / rect.width) * 100;
              setVolume(Math.max(0, Math.min(100, pct)));
            }}
          >
            <div className="player-vol-fill" style={{ width: `${volume}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
