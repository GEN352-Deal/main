import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import './PostItemPage.css';

const CATEGORIES = [
  { id: 'electronics', label: 'Electronics', emoji: '📱' },
  { id: 'fashion',     label: 'Fashion',     emoji: '👗' },
  { id: 'books',       label: 'Books',       emoji: '📚' },
  { id: 'sports',      label: 'Sports',      emoji: '⚽' },
  { id: 'home',        label: 'Home & Garden', emoji: '🏠' },
  { id: 'toys',        label: 'Toys',        emoji: '🧸' },
  { id: 'music',       label: 'Music',       emoji: '🎸' },
  { id: 'art',         label: 'Art & Crafts', emoji: '🎨' },
  { id: 'games',       label: 'Games',       emoji: '🎮' },
  { id: 'vehicles',    label: 'Vehicles',    emoji: '🚗' },
  { id: 'other',       label: 'Other',       emoji: '📦' },
];

const CONDITIONS = ['Brand New', 'Like New', 'Good', 'Fair', 'Poor'];

export default function PostItemPage() {
  const navigate = useNavigate();
  const fileRef  = useRef(null);

  const [photos, setPhotos]                   = useState([]);
  const [title, setTitle]                     = useState('');
  const [description, setDescription]         = useState('');
  const [category, setCategory]               = useState('');
  const [condition, setCondition]             = useState('');
  const [wantInExchange, setWantInExchange]   = useState('');
  const [taggedUsers, setTaggedUsers]         = useState([]);
  const [location, setLocation]               = useState('');
  const [loadingLoc, setLoadingLoc]           = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [submitted, setSubmitted]             = useState(false);

  // ── Photos ──────────────────────────────────────────────────────────────────
  const handleImageUpload = (e) => {
    const files     = Array.from(e.target.files || []);
    const remaining = 6 - photos.length;
    const newPhotos = files.slice(0, remaining).map(f => ({
      preview: URL.createObjectURL(f),
      file: f,
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (i) => setPhotos(prev => prev.filter((_, idx) => idx !== i));

  // ── Tag people ───────────────────────────────────────────────────────────────
  const handleTagPeople = () => {
    const username = prompt('ระบุชื่อผู้ใช้ที่ต้องการ Tag (เช่น @jordan):');
    if (username?.trim()) setTaggedUsers(prev => [...prev, username.trim()]);
  };

  // ── GPS Location ─────────────────────────────────────────────────────────────
  const handleGetLocation = () => {
    if (!navigator.geolocation) return alert('เบราว์เซอร์ไม่รองรับ GPS');
    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
          const data = await res.json();
          setLocation(data.address?.city || data.address?.town || data.display_name?.split(',')[0] || `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        } catch {
          setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        }
        setLoadingLoc(false);
      },
      () => { alert('ไม่สามารถเข้าถึง GPS ได้'); setLoadingLoc(false); }
    );
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!photos.length) return alert('กรุณาเพิ่มรูปภาพอย่างน้อย 1 รูป');
    if (!title || !category || !condition) return;
    setLoading(true);

    const formData = new FormData();
    photos.forEach(p => formData.append('images', p.file));
    formData.append('title',            title);
    formData.append('description',      description);
    formData.append('category',         category);
    formData.append('condition',        condition);
    formData.append('want_in_exchange', wantInExchange);
    formData.append('location',         location);
    formData.append('tagged_users',     JSON.stringify(taggedUsers));

    try {
      await fetch('/api/items', {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem('deal_token')}` },
      });
    } catch {
      // fallback mock
      await new Promise(r => setTimeout(r, 1000));
    } finally {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => navigate('/profile'), 2000);
    }
  };

  // ── Success ───────────────────────────────────────────────────────────────────
  if (submitted) return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', alignItems:'center', justifyContent:'center', gap:16, padding:24 }}>
      <div style={{ fontSize:72 }}>🎉</div>
      <h2 style={{ fontFamily:'var(--font-display)', fontSize:28, letterSpacing:1, textAlign:'center' }}>ITEM POSTED!</h2>
      <p style={{ color:'var(--text-secondary)', textAlign:'center' }}>Your item is now live. Wait for matches and start swapping!</p>
    </div>
  );

  const canSubmit = photos.length > 0 && title && category && condition;

  return (
    <div className="post-page">
      <TopBar title="Post Item" showBack />

      <div className="page-content">
        <div className="post-form">

          {/* ── Photo grid ────────────────────────────────────────────── */}
          <div className="photo-upload-area">
            {photos[0] ? (
              <div style={{ position:'relative', gridColumn:'span 2', gridRow:'span 2', borderRadius:'var(--radius-sm)', overflow:'hidden', aspectRatio:1 }}>
                <img src={photos[0].preview} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />
                <button className="photo-remove-btn" onClick={() => removePhoto(0)}>✕</button>
              </div>
            ) : (
              <div className="photo-upload-placeholder" onClick={() => fileRef.current?.click()}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                </svg>
                <span>Add Photos</span>
                <span className="photo-sub">Up to 6 photos</span>
              </div>
            )}

            {[1,2,3,4,5].map(i =>
              photos[i] ? (
                <div key={i} style={{ position:'relative', borderRadius:'var(--radius-sm)', overflow:'hidden', aspectRatio:1 }}>
                  <img src={photos[i].preview} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />
                  <button className="photo-remove-btn" onClick={() => removePhoto(i)}>✕</button>
                </div>
              ) : photos.length >= i && photos.length < 6 ? (
                <div key={i} className="photo-small-slot" onClick={() => fileRef.current?.click()}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                </div>
              ) : null
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={handleImageUpload} />

          {/* ── Caption ───────────────────────────────────────────────── */}
          <textarea className="post-caption-input" placeholder="Add a caption..."
            value={description} onChange={e => setDescription(e.target.value)} rows={2} />

          {/* ── Options (Audio / Tag / Location) ─────────────────────── */}
          <div className="post-options-card">
            <button className="post-option-row" disabled style={{ opacity:0.4, cursor:'not-allowed' }}>
              <span className="post-option-icon">🎵</span>
              <span className="post-option-label">Add audio</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>

            <button className="post-option-row" onClick={handleTagPeople}>
              <span className="post-option-icon">👤</span>
              <span className="post-option-label">Tag people</span>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginLeft:'auto' }}>
                {taggedUsers.length > 0 && <span style={{ fontSize:12, color:'var(--pink)' }}>{taggedUsers.length} tagged</span>}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </button>

            <button className="post-option-row" onClick={handleGetLocation}>
              <span className="post-option-icon">📍</span>
              <span className="post-option-label">Add location</span>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginLeft:'auto' }}>
                {loadingLoc
                  ? <span style={{ fontSize:12, color:'var(--text-muted)' }}>Detecting...</span>
                  : location && <span style={{ fontSize:12, color:'var(--pink)', maxWidth:100, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{location}</span>
                }
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </button>
          </div>

          {/* Tagged chips */}
          {taggedUsers.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {taggedUsers.map((u, i) => (
                <span key={i} className="chip" style={{ fontSize:11 }}>
                  @{u}
                  <button onClick={() => setTaggedUsers(prev => prev.filter((_,idx) => idx !== i))} style={{ marginLeft:6, color:'var(--pink)' }}>✕</button>
                </span>
              ))}
            </div>
          )}

          {/* ── Item Title ────────────────────────────────────────────── */}
          <div className="form-group">
            <label className="form-label">Item Title *</label>
            <input type="text" className="input-field" placeholder="e.g. Sony WH-1000XM5 Headphones"
              value={title} onChange={e => setTitle(e.target.value)} maxLength={60} />
            <span className="form-hint">{title.length}/60</span>
          </div>

          {/* ── Category ──────────────────────────────────────────────── */}
          <div className="form-group">
            <label className="form-label">Category *</label>
            <div className="form-chips">
              {CATEGORIES.map(cat => (
                <button key={cat.id} className={`chip ${category === cat.id ? 'active' : ''}`} onClick={() => setCategory(cat.id)}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Condition ─────────────────────────────────────────────── */}
          <div className="form-group">
            <label className="form-label">Condition *</label>
            <div className="condition-options">
              {CONDITIONS.map(c => (
                <button key={c} className={`condition-btn ${condition === c ? 'active' : ''}`} onClick={() => setCondition(c)}>{c}</button>
              ))}
            </div>
          </div>

          {/* ── Want in exchange ──────────────────────────────────────── */}
          <div className="form-group">
            <label className="form-label">Looking to swap for</label>
            <input type="text" className="input-field" placeholder="e.g. Camera, iPad, Laptop (comma separated)"
              value={wantInExchange} onChange={e => setWantInExchange(e.target.value)} />
            <span className="form-hint">List items you'd accept in exchange</span>
          </div>

          {/* ── Auction shortcut ──────────────────────────────────────── */}
          <div className="form-group">
            <label className="form-label">Also post as auction?</label>
            <button className="btn-secondary" style={{ fontSize:13 }} onClick={() => navigate('/auction')}>
              🔨 Create Auction
            </button>
          </div>

          {/* ── Submit ───────────────────────────────────────────────── */}
          <button className="btn-primary" onClick={handleSubmit} disabled={!canSubmit || loading}
            style={{ marginTop:8, background: canSubmit ? 'linear-gradient(135deg,var(--pink),var(--purple))' : undefined }}>
            {loading ? 'Posting...' : 'Post Item for Swap'}
          </button>

        </div>
      </div>
    </div>
  );
}
