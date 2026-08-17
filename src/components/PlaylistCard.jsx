import { usePlayer } from '../context/PlayerContext.jsx';

export default function PlaylistCard({ playlist, onClick }) {
  const { playTrack } = usePlayer();

  const handlePlay = (e) => {
    e.stopPropagation();
    // Play first song of a playlist (mock)
    playTrack({ id: playlist.id * 100, title: playlist.title, artist: 'Various Artists', emoji: playlist.emoji, duration: '3:30', color: '#1a1a1a' });
  };

  return (
    <div className="playlist-card" onClick={onClick}>
      <div className="playlist-card-cover" style={{ background: playlist.color }}>
        <span>{playlist.emoji}</span>
        <button className="playlist-card-play" onClick={handlePlay} title="Play">
          <span style={{ color: '#fff', fontSize: 14, marginLeft: 2 }}>▶</span>
        </button>
      </div>
      <div className="playlist-card-body">
        <div className="playlist-card-title">{playlist.title}</div>
        <div className="playlist-card-meta">{playlist.songs} songs</div>
      </div>
    </div>
  );
}