import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import './SettingsPage.css';

const SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: '👤', label: 'Edit Profile', sub: 'Name, bio, photo', action: 'profile-edit' },
      { icon: '🔒', label: 'Password & Security', sub: 'Change password, 2FA' },
      { icon: '📧', label: 'Email', sub: 'jordan@email.com', action: 'email' },
      { icon: '📱', label: 'Phone Number', sub: '+66 8x-xxxx-xxxx' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: '🔔', label: 'Notifications', sub: 'Matches, messages, bids', toggle: true },
      { icon: '📍', label: 'Location', sub: 'Bangkok, Thailand' },
      { icon: '🌐', label: 'Language', sub: 'English', action: 'language' },
      { icon: '🌙', label: 'Dark Mode', sub: 'Always on', toggle: true, defaultOn: true },
    ],
  },
  {
    title: 'Payments',
    items: [
      { icon: '💳', label: 'Payment Methods', sub: 'Add cards, PromptPay' },
      { icon: '📊', label: 'Transaction History', sub: 'View all payments' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: '❓', label: 'Help Center', sub: 'FAQs and guides' },
      { icon: '🐛', label: 'Report a Bug', sub: 'Something not working?' },
      { icon: '⭐', label: 'Rate the App', sub: 'Leave a review' },
      { icon: '📄', label: 'Terms & Privacy', sub: 'Legal stuff' },
    ],
  },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const [toggles, setToggles] = useState({ notifications: true, darkMode: true });

  const toggleSwitch = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-page">
      <TopBar title="Settings" showBack />

      <div className="page-content">
        {/* User mini card */}
        <div className="settings-user-card">
          <div className="avatar avatar-lg" style={{ border: '2px solid var(--pink)', flexShrink: 0 }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="var(--text-muted)">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Jordan Lee</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>@jordanlee</div>
            <span className="badge badge-lime" style={{ marginTop: 4, display: 'inline-flex' }}>✓ Verified</span>
          </div>
          <button className="btn-ghost" onClick={() => navigate('/profile')} style={{ marginLeft: 'auto' }}>
            View Profile
          </button>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.title} className="settings-section">
            <div className="settings-section-label">{section.title}</div>
            <div className="settings-list">
              {section.items.map((item) => {
                const toggleKey = item.label.toLowerCase().replace(' & ', '_').replace(' ', '_');
                const isToggle = item.toggle;
                return (
                  <button key={item.label} className="settings-item" onClick={!isToggle ? () => {} : undefined}>
                    <span className="settings-item-icon">{item.icon}</span>
                    <div className="settings-item-text">
                      <span className="settings-item-label">{item.label}</span>
                      <span className="settings-item-sub">{item.sub}</span>
                    </div>
                    {isToggle ? (
                      <div
                        className={`toggle-switch ${toggles[toggleKey] ? 'on' : ''}`}
                        onClick={() => toggleSwitch(toggleKey)}
                      >
                        <div className="toggle-thumb" />
                      </div>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div style={{ padding: '8px 16px 32px' }}>
          <button className="settings-logout" onClick={() => navigate('/')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Log Out
          </button>
          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            DEAL v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}
