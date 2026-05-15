import { useState, useRef, useEffect } from 'react';
import TopBar from '../components/layout/TopBar';
import { SWAP_ITEMS, CATEGORIES } from '../data/mockData';
import './HomePage.css';

// Helper to get placeholder gradient based on index
const GRADIENTS = [
  'linear-gradient(135deg, #1a0533 0%, #2d0066 100%)',
  'linear-gradient(135deg, #330020 0%, #660040 100%)',
  'linear-gradient(135deg, #1a2600 0%, #3d5900 100%)',
  'linear-gradient(135deg, #001933 0%, #003366 100%)',
];

export default function HomePage() {
  const [items, setItems] = useState(SWAP_ITEMS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null); // 'left' | 'right'
  const [match, setMatch] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxDistance, setMaxDistance] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const cardRef = useRef(null);
  const startXRef = useRef(0);

  const current = items[currentIndex];
  const nextItem = items[currentIndex + 1];

  const handleSwipe = (dir) => {
    setSwipeDir(dir);
    setTimeout(() => {
      if (dir === 'right') {
        // Simulate random match
        if (Math.random() > 0.5) {
          setMatch(current);
        }
      }
      setSwipeDir(null);
      setDragX(0);
      setCurrentIndex((i) => Math.min(i + 1, items.length));
    }, 350);
  };

  // Touch / mouse drag
  const onPointerDown = (e) => {
    setDragging(true);
    startXRef.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const x = (e.clientX ?? e.touches?.[0]?.clientX ?? 0) - startXRef.current;
    setDragX(x);
  };
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (dragX > 80) handleSwipe('right');
    else if (dragX < -80) handleSwipe('left');
    else setDragX(0);
  };

  const rotation = dragging ? dragX * 0.08 : 0;
  const likeOpacity = Math.max(0, Math.min(1, dragX / 80));
  const nopeOpacity = Math.max(0, Math.min(1, -dragX / 80));

  return (
    <div className="home-page">
      <TopBar
        showLogo
        rightAction={
          <button className="topbar-icon-btn" onClick={() => setShowFilter(true)} aria-label="Filter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M7 12h10M11 18h2"/>
            </svg>
          </button>
        }
      />

      {/* Category chips */}
      <div className="category-strip">
        {CATEGORIES.slice(0, 7).map((cat) => (
          <button
            key={cat.id}
            className={`chip ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span>{cat.emoji}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Swipe deck */}
      <div className="swipe-deck">
        {/* Next card (behind) */}
        {nextItem && (
          <div className="swipe-card next-card">
            <img
              src={nextItem.images[0]}
              alt={nextItem.title}
              className="card-img"
              onError={(e) => { e.target.style.display='none'; }}
            />
            <div className="card-gradient" style={{ background: GRADIENTS[1] }}/>
          </div>
        )}

        {/* Current card */}
        {current && currentIndex < items.length ? (
          <div
            ref={cardRef}
            className={`swipe-card current-card ${swipeDir ? `swipe-${swipeDir}` : ''}`}
            style={{
              transform: `translateX(${dragging ? dragX : 0}px) rotate(${rotation}deg)`,
              transition: dragging ? 'none' : undefined,
              cursor: dragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={onPointerDown}
            onMouseMove={onPointerMove}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={onPointerDown}
            onTouchMove={onPointerMove}
            onTouchEnd={onPointerUp}
          >
            <img
              src={current.images[0]}
              alt={current.title}
              className="card-img"
              draggable="false"
              onError={(e) => { e.target.style.display='none'; }}
            />
            <div className="card-overlay-gradient" />

            {/* Like / Nope stamps */}
            <div className="stamp stamp-like" style={{ opacity: likeOpacity }}>LIKE ❤️</div>
            <div className="stamp stamp-nope" style={{ opacity: nopeOpacity }}>NOPE 👎</div>

            {/* Card info */}
            <div className="card-info">
              <div className="card-top-badges">
                <span className="badge badge-lime">{current.condition}</span>
                <span className="badge badge-gray">{current.distance} km away</span>
              </div>
              <h2 className="card-title">{current.title}</h2>
              <p className="card-desc">{current.description}</p>

              <div className="card-wants">
                <span className="card-wants-label">Wants in exchange:</span>
                <div className="card-tags">
                  {current.wantInExchange.map((w) => (
                    <span key={w} className="chip" style={{ fontSize: 11, padding: '3px 8px' }}>{w}</span>
                  ))}
                </div>
              </div>

              <div className="card-user">
                <div className="avatar avatar-sm" style={{ background: 'var(--bg-elevated)', border: '2px solid var(--pink)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--text-secondary)">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{current.user.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>★ {current.user.rating}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-deck">
            <div className="empty-deck-icon">🎉</div>
            <h3>You've seen everything!</h3>
            <p>Check back later for new items</p>
            <button className="btn-primary" style={{ width: 'auto', padding: '12px 24px', marginTop: 16 }} onClick={() => setCurrentIndex(0)}>
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {current && currentIndex < items.length && (
        <div className="swipe-actions">
          <button className="swipe-btn swipe-btn-nope" onClick={() => handleSwipe('left')} aria-label="Pass">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <button className="swipe-btn swipe-btn-info" aria-label="View profile">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
          </button>
          <button className="swipe-btn swipe-btn-like" onClick={() => handleSwipe('right')} aria-label="Like">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Match modal */}
      {match && (
        <div className="overlay" onClick={() => setMatch(null)}>
          <div className="match-modal animate-popIn" onClick={(e) => e.stopPropagation()}>
            <div className="match-badge">IT'S A MATCH! 🔥</div>
            <div className="match-avatars">
              <div className="match-avatar-ring pink-ring">
                <div className="avatar avatar-lg" />
              </div>
              <div className="match-icon">🔄</div>
              <div className="match-avatar-ring purple-ring">
                <div className="avatar avatar-lg" />
              </div>
            </div>
            <h3 className="match-title">{match.user.name} liked your item too!</h3>
            <p className="match-sub">You both want each other's items. Start chatting!</p>
            <button className="btn-primary" onClick={() => setMatch(null)}>
              💬 Send a Message
            </button>
            <button className="btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => setMatch(null)}>
              Keep Swiping
            </button>
          </div>
        </div>
      )}

      {/* Filter panel */}
      {showFilter && (
        <div className="overlay" onClick={() => setShowFilter(false)}>
          <div className="overlay-sheet animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 20 }}>FILTERS</h3>

            <div className="filter-section">
              <label className="filter-label">Max Distance: <strong>{maxDistance} km</strong></label>
              <input
                type="range"
                min={1}
                max={100}
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="filter-range"
              />
            </div>

            <div className="filter-section">
              <label className="filter-label">Category</label>
              <div className="filter-chips">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className={`chip ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-primary" onClick={() => setShowFilter(false)}>
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
