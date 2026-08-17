import { useState, useMemo } from 'react';
import SongRow from '../components/SongRow.jsx';
import { mockSongs, recentSearches, trendingSearches } from '../data/mockData.js';

const TABS = ['All', 'Songs', 'Artists', 'Albums', 'Playlists'];

export default function Search() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [recentList, setRecentList] = useState(recentSearches);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return mockSongs.filter(s =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.artist.toLowerCase().includes(query.toLowerCase()) ||
      s.genre.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const handleRecentClick = (term) => {
    setQuery(term);
  };

  const clearRecent = (term, e) => {
    e.stopPropagation();
    setRecentList(l => l.filter(t => t !== term));
  };

  return (
    <div className="page-content fade-in">
      {/* Search Header */}
      <div className="search-header">
        <div className="search-bar-large">
          <span style={{ fontSize: 18, color: 'var(--text-muted)' }}>⌕</span>
          <input
            autoFocus
            type="text"
            placeholder="Search songs, artists, albums..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button
              style={{ color: 'var(--text-muted)', fontSize: 16 }}
              onClick={() => setQuery('')}
              title="Clear"
            >
              ✕
            </button>
          )}
          <button className="search-filter-btn" title="Filter">
            ⊞
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {TABS.map(tab => (
            <div
              key={tab}
              className={`tab-item${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      {query.trim() ? (
        <div style={{ marginBottom: 32 }}>
          <div className="section-header" style={{ marginBottom: 16 }}>
            <div className="section-title">Search Results</div>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{results.length} results</span>
          </div>
          {results.length > 0 ? (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '28px 2fr 1.5fr 1fr 80px 80px', gap: 12, padding: '0 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>#</span>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>Title</span>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>Artist</span>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>Genre</span>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>Duration</span>
                <span></span>
              </div>
              {results.map((song, i) => (
                <SongRow key={song.id} song={song} index={i} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>No results found</div>
              <div style={{ fontSize: 13 }}>Try searching for a different song, artist, or genre</div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Recent Searches */}
          {recentList.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div className="section-header">
                <div className="section-title">Recent Searches</div>
                <span className="section-link" onClick={() => setRecentList([])}>See all</span>
              </div>
              <div className="search-chips">
                {recentList.map(term => (
                  <div key={term} className="search-chip" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => handleRecentClick(term)}>
                    <span style={{ fontSize: 11 }}>⟳</span>
                    <span>{term}</span>
                    <span
                      style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 2 }}
                      onClick={(e) => clearRecent(term, e)}
                    >✕</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div>
            <div className="section-header">
              <div className="section-title">Trending Searches</div>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '28px 2fr 1.5fr 1fr 80px 80px', gap: 12, padding: '0 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>#</span>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>Title</span>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>Artist</span>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>Genre</span>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>Duration</span>
                <span></span>
              </div>
              {mockSongs.slice(8, 13).map((song, i) => (
                <SongRow key={song.id} song={song} index={i} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
