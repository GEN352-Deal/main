import { useState } from 'react';
import TopBar from '../components/layout/TopBar';
import { FEED_POSTS } from '../data/mockData';
import './FeedPage.css';


const TYPE_COLORS = {
  wanted: { label: 'WTT', class: 'badge-purple' },
  giveaway: { label: 'FREE', class: 'badge-lime' },
  offer: { label: 'OFFER', class: 'badge-pink' },
};

function FeedPost({ post }) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const typeInfo = TYPE_COLORS[post.type];

  return (
    <article className="feed-post animate-fadeIn">
      <div className="feed-post-header">
        <div className="feed-post-user">
          <div className="avatar avatar-sm" style={{ background: 'var(--bg-elevated)', border: '2px solid var(--border-active)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--text-muted)">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, display: 'flex', gap: 4, alignItems: 'center' }}>
              {post.user.name}
              {post.user.verified && <span style={{ color: 'var(--lime)', fontSize: 11 }}>✓</span>}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{post.time}</div>
          </div>
        </div>
        <span className={`badge ${typeInfo.class}`}>{typeInfo.label}</span>
      </div>

      <h3 className="feed-post-title">{post.title}</h3>
      <p className="feed-post-body">{post.body}</p>

      {post.images.length > 0 && (
        <img src={post.images[0]} alt="" className="feed-post-img" />
      )}

      <div className="feed-post-tags">
        {post.tags.map((tag) => (
          <span key={tag} className="chip" style={{ fontSize: 11, padding: '3px 10px' }}>#{tag}</span>
        ))}
      </div>

      <div className="feed-post-actions">
        <button
          className={`feed-action-btn ${liked ? 'action-liked' : ''}`}
          onClick={() => setLiked(!liked)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          {post.likes + (liked ? 1 : 0)}
        </button>
        <button className="feed-action-btn" onClick={() => setShowComments(!showComments)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          {post.comments}
        </button>
        <button className="feed-action-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
          </svg>
          Share
        </button>
        <button className="feed-action-btn feed-action-primary" style={{ marginLeft: 'auto' }}>
          💬 Reply
        </button>
      </div>

      {showComments && (
        <div className="feed-comments">
          <div className="feed-comment">
            <span className="feed-comment-user">@alex_k:</span>
            <span className="feed-comment-text">I might have what you're looking for! DM me.</span>
          </div>
          <div className="feed-comment">
            <span className="feed-comment-user">@nina_w:</span>
            <span className="feed-comment-text">Interested! What condition is your item?</span>
          </div>
          <div className="feed-comment-input">
            <input type="text" placeholder="Write a comment..." className="input-field" style={{ fontSize: 13, padding: '8px 12px' }} />
          </div>
        </div>
      )}
    </article>
  );
}

export default function FeedPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showPost, setShowPost] = useState(false);
  const [postText, setPostText] = useState('');
  const [postTitle, setPostTitle] = useState('');

  const filters = ['all', 'wanted', 'offer', 'giveaway'];

  const filtered = FEED_POSTS.filter((p) => {
    const matchFilter = activeFilter === 'all' || p.type === activeFilter;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.body.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="feed-page">
      <TopBar
        title="Community Feed"
        rightAction={
          <button className="btn-primary" style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }} onClick={() => setShowPost(true)}>
            + Post
          </button>
        }
      />

      <div className="page-content">
        {/* Search */}
        <div style={{ padding: '12px 16px 8px' }}>
          <div className="chat-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search items, keywords..."
              className="chat-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="category-strip" style={{ padding: '0 16px 12px' }}>
          {filters.map((f) => (
            <button key={f} className={`chip ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
              {f === 'all' ? '🔍 All' : f === 'wanted' ? '🔄 WTT' : f === 'offer' ? '📤 Offer' : '🎁 Free'}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="feed-posts">
          {filtered.length === 0 ? (
            <div className="empty-tab">
              <div style={{ fontSize: 40 }}>🔍</div>
              <p>No posts found</p>
            </div>
          ) : (
            filtered.map((post) => <FeedPost key={post.id} post={post} />)
          )}
        </div>
      </div>

      {/* Post creator sheet */}
      {showPost && (
        <div className="overlay" onClick={() => setShowPost(false)}>
          <div className="overlay-sheet animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 1, marginBottom: 16 }}>NEW POST</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="text"
                className="input-field"
                placeholder="Post title (e.g. Looking for: Keyboard)"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
              <textarea
                className="input-field"
                placeholder="Describe what you have, what you want, or any details..."
                rows={4}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                style={{ resize: 'none', lineHeight: 1.5 }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                {['WTT', 'Offer', 'Free'].map((t) => (
                  <button key={t} className="chip">{t}</button>
                ))}
              </div>
              <button className="btn-primary" onClick={() => setShowPost(false)}>
                Publish Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
