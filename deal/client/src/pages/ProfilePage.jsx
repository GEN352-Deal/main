import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import { USER_PROFILE } from '../data/mockData';
import './ProfilePage.css';

const TABS = ['Items', 'To Send', 'To Receive', 'History', 'Reviews'];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Items');
  const profile = USER_PROFILE;

  return (
    <div className="profile-page">
      <TopBar
        title="Profile"
        rightAction={
          <button className="topbar-icon-btn" onClick={() => navigate('/settings')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          </button>
        }
      />

      <div className="page-content">
        {/* Profile header */}
        <div className="profile-header">
          <div className="profile-avatar-wrap">
            <div className="avatar avatar-xl profile-avatar">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--text-muted)">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <button className="profile-edit-avatar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
          </div>
          <h2 className="profile-name">{profile.name}</h2>
          <p className="profile-username">{profile.username}</p>
          <p className="profile-bio">{profile.bio}</p>

          <div className="profile-badges">
            {profile.verified && <span className="badge badge-lime">✓ Verified</span>}
            <span className="badge badge-purple">★ {profile.rating} ({profile.totalReviews})</span>
            <span className="badge badge-gray">📍 {profile.location}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="stat-num">{profile.followers}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-divider" />
          <div className="profile-stat">
            <span className="stat-num">{profile.following}</span>
            <span className="stat-label">Following</span>
          </div>
          <div className="stat-divider" />
          <div className="profile-stat">
            <span className="stat-num gradient-text">{profile.successfulSwaps}</span>
            <span className="stat-label">Swaps</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, padding: '0 16px 16px' }}>
          <button className="btn-primary" style={{ flex: 1 }} onClick={() => navigate('/post')}>
            + Post Item
          </button>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/settings')}>
            Edit Profile
          </button>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Items grid */}
        {activeTab === 'Items' && (
          <div className="items-grid">
            {profile.myItems.map((item) => (
              <div key={item.id} className="item-card">
                <div className="item-card-img-wrap">
                  <img src={item.image} alt={item.title} className="item-card-img" />
                  <div className={`item-status-badge ${item.status === 'swapped' ? 'status-swapped' : 'status-available'}`}>
                    {item.status === 'swapped' ? 'Swapped' : 'Available'}
                  </div>
                </div>
                <div className="item-card-info">
                  <span className="item-card-title">{item.title}</span>
                  <span className="item-card-likes">♡ {item.likes}</span>
                </div>
              </div>
            ))}

            {/* Add new item */}
            <button className="item-card-add" onClick={() => navigate('/post')}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              <span>Add Item</span>
            </button>
          </div>
        )}

        {activeTab === 'To Send' && (
          <div className="empty-tab">
            <div style={{ fontSize: 40 }}>📦</div>
            <p>No items pending shipment</p>
          </div>
        )}
        {activeTab === 'To Receive' && (
          <div className="empty-tab">
            <div style={{ fontSize: 40 }}>🎁</div>
            <p>No incoming items</p>
          </div>
        )}
        {activeTab === 'History' && (
          <div className="history-list">
            <div className="history-item">
              <img src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=60" alt="" className="history-img" />
              <div className="history-info">
                <span className="history-title">Canon 50mm f/1.4</span>
                <span className="history-sub">Swapped with Mia T. · Jan 10, 2024</span>
              </div>
              <span className="badge badge-green">Done</span>
            </div>
            <div className="history-item">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60" alt="" className="history-img" />
              <div className="history-info">
                <span className="history-title">Nike Air Max 95</span>
                <span className="history-sub">Swapped with Pom S. · Dec 28, 2023</span>
              </div>
              <span className="badge badge-green">Done</span>
            </div>
          </div>
        )}
        {activeTab === 'Reviews' && (
          <div className="reviews-list">
            {[
              { name: 'Mia T.', rating: 5, text: 'Super fast response, items exactly as described. Great trader!', time: 'Jan 11' },
              { name: 'Pom S.', rating: 5, text: 'Smooth swap, very trustworthy. Highly recommend!', time: 'Dec 29' },
              { name: 'Alex K.', rating: 4, text: 'Good experience. Minor delay in delivery but communicated well.', time: 'Nov 15' },
            ].map((review, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <div className="review-user">
                    <div className="avatar avatar-sm" style={{ background: 'var(--bg-elevated)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text-muted)">
                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{review.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <span key={j} style={{ color: j < review.rating ? '#FFB800' : 'var(--border-active)', fontSize: 12 }}>★</span>
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{review.text}</p>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{review.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
