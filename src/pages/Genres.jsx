import { useState } from 'react';
import GenreCard from '../components/GenreCard.jsx';
import SongRow from '../components/SongRow.jsx';
import { mockGenres, mockSongs } from '../data/mockData.js';

export default function Genres({ onNavigate }) {
  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState(null);

  const filteredGenres = mockGenres.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const genreSongs = activeGenre
    ? mockSongs.filter(s => s.genre?.toLowerCase() === activeGenre.name.toLowerCase())
    : [];

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div className="page-title">Explore Genres</div>
        <div className="page-subtitle">10 genres </div>
      </div>

      {/* Genre Search */}
      <div className="genres-search" style={{ marginBottom: 24 }}>
        <div className="search-bar" style={{ borderRadius: 'var(--radius-md)', padding: '10px 16px' }}>
          <span className="search-bar-icon">⌕</span>
          <input
            type="text"
            placeholder="Search genres..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', color: 'var(--text-primary)', fontSize: 14 }}
          />
          {search && (
            <button
              style={{ color: 'var(--text-muted)', fontSize: 14 }}
              onClick={() => setSearch('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredGenres.length > 0 ? (
        <div className="genres-grid" style={{ marginBottom: activeGenre ? 32 : 0 }}>
          {filteredGenres.map(genre => {
            const isSelected = activeGenre?.id === genre.id;
            return (
              <div
                key={genre.id}
                style={{
                  position: 'relative',
                  border: isSelected ? '1px solid var(--accent)' : undefined,
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <GenreCard
                  genre={genre}
                  onClick={() => setActiveGenre(isSelected ? null : genre)}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎵</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
            No genres found
          </div>
          <div style={{ fontSize: 13 }}>Try a different search term</div>
        </div>
      )}

      {/* Active Genre Songs View */}
      {activeGenre && (
        <div className="fade-in" style={{ marginTop: 24 }}>
          <div className="section-header">
            <div>
              <div className="section-title">
                {activeGenre.emoji} {activeGenre.name} Songs ({genreSongs.length})
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {activeGenre.desc || 'GTZAN audio collection'}
              </div>
            </div>
            <button
              onClick={() => setActiveGenre(null)}
              style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}
            >
              Close (✕)
            </button>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '28px 2fr 1.5fr 1fr 80px 80px',
              gap: 12,
              padding: '0 12px 10px',
              borderBottom: '1px solid var(--border)',
              marginBottom: 4,
            }}>
              {['#', 'Title', 'Artist', 'Genre', 'Duration', ''].map((h, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: 'var(--text-muted)',
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {genreSongs.length > 0 ? (
              genreSongs.map((song, i) => (
                <SongRow key={song.id} song={song} index={i} />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                No sample songs available in preview for this genre.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
