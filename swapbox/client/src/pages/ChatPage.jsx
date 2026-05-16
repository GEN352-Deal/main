import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import { CHAT_CONVERSATIONS, MESSAGES, TRACKING_STEPS } from '../data/mockData';
import './ChatPage.css';

function TrackingView({ onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-sheet animate-slideUp" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="2">
            <path d="M1 3h15l3 9H1z"/><circle cx="6" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>
          </svg>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 1 }}>SHIPMENT TRACKING</h3>
        </div>

        <div className="tracking-id">
          <span className="tracking-id-label">Tracking No.</span>
          <span className="tracking-id-val">SBX-2024-KTX847</span>
        </div>

        <div className="tracking-route">
          <div className="tracking-address">
            <span className="tracking-addr-label">From</span>
            <span className="tracking-addr-val">Jordan Lee • Bangkok 10400</span>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          <div className="tracking-address">
            <span className="tracking-addr-label">To</span>
            <span className="tracking-addr-val">Mia T. • Bangkok 10120</span>
          </div>
        </div>

        <div className="tracking-steps">
          {TRACKING_STEPS.map((step, i) => (
            <div key={step.id} className={`tracking-step ${step.done ? 'done' : ''}`}>
              <div className="tracking-step-line-wrap">
                <div className={`tracking-dot ${step.done ? 'dot-done' : ''}`}>
                  {step.done && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  )}
                </div>
                {i < TRACKING_STEPS.length - 1 && (
                  <div className={`tracking-line ${step.done ? 'line-done' : ''}`} />
                )}
              </div>
              <div className="tracking-step-info">
                <span className="tracking-step-label">{step.label}</span>
                <span className="tracking-step-time">{step.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="tracking-eta">
          <span>Estimated Delivery</span>
          <strong>Jan 16, 2024</strong>
        </div>
      </div>
    </div>
  );
}

function ChatWindow({ convo, onBack }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(MESSAGES);
  const [showTracking, setShowTracking] = useState(false);

  const send = () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { id: `m${Date.now()}`, sender: 'me', text: message, time: 'now' }]);
    setMessage('');
  };

  return (
    <div className="chat-window">
      <header className="chat-header">
        <button className="topbar-back" onClick={onBack} style={{ background: 'none' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
          </svg>
        </button>
        <div className="chat-header-user">
          <div className="chat-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--text-muted)">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            <span className="status-dot status-online" style={{ position: 'absolute', bottom: 1, right: 1, border: '2px solid var(--bg)' }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{convo.user.name}</div>
            <div style={{ fontSize: 11, color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>Online</div>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="topbar-icon-btn" onClick={() => setShowTracking(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 3h15l3 9H1z"/><circle cx="6" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>
            </svg>
          </button>
          <button className="topbar-icon-btn" onClick={() => navigate('/exchange')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Item match banner */}
      <div className="match-banner">
        <img src={convo.item.image} alt="" className="match-banner-img" />
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>MATCHED ITEM</div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{convo.item.title}</div>
        </div>
        <button className="badge badge-pink" onClick={() => navigate('/exchange')}>Arrange Swap →</button>
      </div>

      {/* Messages */}
      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-bubble ${msg.sender === 'me' ? 'msg-me' : 'msg-them'}`}>
            <div className="bubble-text">{msg.text}</div>
            <div className="bubble-time">{msg.time}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input-bar">
        <button className="chat-attach-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>
        <input
          type="text"
          className="input-field chat-input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button className={`chat-send-btn ${message.trim() ? 'active' : ''}`} onClick={send}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>

      {showTracking && <TrackingView onClose={() => setShowTracking(false)} />}
    </div>
  );
}

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState(null);

  if (activeChat) {
    return <ChatWindow convo={activeChat} onBack={() => setActiveChat(null)} />;
  }

  return (
    <div className="chat-list-page">
      <TopBar
        title="Messages"
        subtitle={`${CHAT_CONVERSATIONS.filter(c => c.unread > 0).length} unread`}
        rightAction={
          <button className="topbar-icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 19H6.931A1.922 1.922 0 015 17.087V8h14v2.5"/><path d="M14 22l7-7m0 4v-4h-4"/>
            </svg>
          </button>
        }
      />

      <div className="page-content">
        <div className="chat-search-wrap">
          <div className="chat-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Search conversations..." className="chat-search-input" />
          </div>
        </div>

        <div className="section-header">
          <span className="section-title">MATCHES</span>
          <span className="badge badge-pink">{CHAT_CONVERSATIONS.length} chats</span>
        </div>

        <div className="chat-list">
          {CHAT_CONVERSATIONS.map((convo) => (
            <button key={convo.id} className="chat-item" onClick={() => setActiveChat(convo)}>
              <div className="chat-item-avatar">
                <div className="avatar avatar-md" style={{ background: 'var(--bg-elevated)', border: '2px solid var(--purple)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--text-muted)">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </div>
                {convo.user.online && (
                  <span className="status-dot status-online" style={{ position: 'absolute', bottom: 2, right: 2, border: '2px solid var(--bg-card)' }} />
                )}
              </div>
              <div className="chat-item-content">
                <div className="chat-item-top">
                  <span className="chat-item-name">{convo.user.name}</span>
                  <span className="chat-item-time">{convo.time}</span>
                </div>
                <div className="chat-item-bottom">
                  <img src={convo.item.image} alt="" className="chat-item-thumb" />
                  <span className="chat-item-msg">{convo.lastMessage}</span>
                  {convo.unread > 0 && (
                    <span className="nav-badge" style={{ position: 'static', marginLeft: 'auto' }}>{convo.unread}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
