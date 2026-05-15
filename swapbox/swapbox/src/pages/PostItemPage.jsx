import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import { CATEGORIES } from '../data/mockData';
import './PostItemPage.css';

const CONDITIONS = ['Brand New', 'Like New', 'Good', 'Fair', 'Poor'];

export default function PostItemPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [wantInExchange, setWantInExchange] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!title || !category || !condition) return;
    setSubmitted(true);
    setTimeout(() => navigate('/profile'), 2000);
  };

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <div style={{ fontSize: 72 }}>🎉</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 1, textAlign: 'center' }}>
          ITEM POSTED!
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
          Your item is now live. Wait for matches and start swapping!
        </p>
      </div>
    );
  }

  return (
    <div className="post-page">
      <TopBar title="Post Item" showBack />

      <div className="page-content">
        <div className="post-form">

          {/* Photo upload */}
          <div className="photo-upload-area">
            <div className="photo-upload-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <span>Add Photos</span>
              <span className="photo-sub">Up to 6 photos</span>
            </div>
          </div>

          {/* Form fields */}
          <div className="form-group">
            <label className="form-label">Item Title *</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Sony WH-1000XM5 Headphones"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
            />
            <span className="form-hint">{title.length}/60</span>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="input-field"
              placeholder="Describe your item's condition, any defects, what's included..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'none' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <div className="form-chips">
              {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                <button
                  key={cat.id}
                  className={`chip ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Condition *</label>
            <div className="condition-options">
              {CONDITIONS.map((c) => (
                <button
                  key={c}
                  className={`condition-btn ${condition === c ? 'active' : ''}`}
                  onClick={() => setCondition(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Looking to swap for</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Camera, iPad, Laptop (comma separated)"
              value={wantInExchange}
              onChange={(e) => setWantInExchange(e.target.value)}
            />
            <span className="form-hint">List items you'd accept in exchange</span>
          </div>

          <div className="form-group">
            <label className="form-label">Also post as auction?</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, fontSize: 13 }}
                onClick={() => navigate('/auction')}
              >
                🔨 Create Auction
              </button>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleSubmit}
            style={{ marginTop: 8 }}
            disabled={!title || !category || !condition}
          >
            Post Item for Swap
          </button>
        </div>
      </div>
    </div>
  );
}
