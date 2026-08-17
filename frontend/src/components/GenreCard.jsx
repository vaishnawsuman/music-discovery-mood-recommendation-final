export default function GenreCard({ genre, onClick }) {
  return (
    <div className="genre-card" onClick={onClick} title={genre.name}>
      <div className="genre-icon">
        <span>{genre.emoji}</span>
      </div>
      <div className="genre-name">{genre.name}</div>
      <div className="genre-count">{genre.count}</div>
    </div>
  );
}
