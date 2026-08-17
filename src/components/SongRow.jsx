import { usePlayer } from '../context/PlayerContext.jsx';

export default function SongRow({ song, index, showGenre = true }) {
  const { playTrack, toggleLike, isLiked, currentTrack, isPlaying } = usePlayer();

  const isActive = currentTrack?.id === song.id;
  const liked    = isLiked(song.id);

  return (
    <div
      className={`song-row${isActive ? ' playing' : ''}`}
      onDoubleClick={() => playTrack(song)}
    >
      {/* # */}
      <div className="song-row-num">
        {isActive && isPlaying
          ? <div className="eq-bars" style={{ justifyContent: 'center' }}>
              <div className="eq-bar" /><div className="eq-bar" />
              <div className="eq-bar" /><div className="eq-bar" />
            </div>
          : <span>{index + 1}</span>
        }
      </div>

      {/* Title + Artist */}
      <div className="song-row-info">
        <div
          className="song-row-thumb"
          style={{ background: song.color || 'var(--bg-card-alt)' }}
        >
          <span>{song.emoji || '🎵'}</span>
        </div>
        <div className="song-row-details">
          <div className="song-row-title">{song.title}</div>
          <div className="song-row-artist">{song.artist}</div>
        </div>
      </div>

      {/* Genre */}
      {showGenre && (
        <div className="song-row-genre">{song.genre}</div>
      )}

      {/* Duration */}
      <div className="song-row-duration">{song.duration}</div>

      {/* Actions */}
      <div className="song-row-actions">
        <button
          className={`icon-btn${liked ? ' liked' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }}
          title={liked ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          {liked ? '♥' : '♡'}
        </button>
        <button
          className="play-btn-circle"
          onClick={(e) => { e.stopPropagation(); playTrack(song); }}
          title="Play"
        >
          {isActive && isPlaying ? '❚❚' : '▶'}
        </button>
      </div>
    </div>
  );
}
