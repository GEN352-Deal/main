import { useState, useEffect } from 'react';
import TopBar from '../components/layout/TopBar';
import { AUCTIONS } from '../data/mockData';
import './AuctionPage.css';

function useCountdown(endTime) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calc = () => {
      const diff = endTime - Date.now();
      if (diff <= 0) { setTimeLeft('Ended'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return timeLeft;
}

function AuctionCard({ auction, onBid }) {
  const timeLeft = useCountdown(auction.endTime);
  const urgent = (auction.endTime - Date.now()) < 2 * 3600000;

  return (
    <div className="auction-card">
      <div className="auction-img-wrap">
        <img src={auction.image} alt={auction.title} className="auction-img" />
        {auction.hot && <span className="auction-hot">🔥 HOT</span>}
        <div className={`auction-timer ${urgent ? 'timer-urgent' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          {timeLeft}
        </div>
      </div>

      <div className="auction-body">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <h3 className="auction-title">{auction.title}</h3>
          <span className="badge badge-gray">{auction.condition}</span>
        </div>

        <div className="auction-price-row">
          <div>
            <div className="auction-price-label">Current Bid</div>
            <div className="auction-price">฿{auction.currentBid.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="auction-price-label">Bids</div>
            <div className="auction-bids">{auction.bids} bids</div>
          </div>
        </div>

        <div className="auction-seller">
          <div className="avatar avatar-sm" style={{ background: 'var(--bg-elevated)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text-muted)">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{auction.seller.name}</span>
          <span style={{ fontSize: 11, color: '#FFB800' }}>★ {auction.seller.rating}</span>
        </div>

        <button className="btn-primary" onClick={() => onBid(auction)}>
          Place Bid
        </button>
      </div>
    </div>
  );
}

function BidModal({ auction, onClose }) {
  const [bidAmount, setBidAmount] = useState(auction.currentBid + 100);
  const timeLeft = useCountdown(auction.endTime);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-sheet animate-slideUp" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        <div className="bid-modal-item">
          <img src={auction.image} alt="" className="bid-modal-img" />
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 15 }}>{auction.title}</h4>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <span className="badge badge-pink">฿{auction.currentBid.toLocaleString()} current</span>
              <span className="badge badge-gray">{auction.bids} bids</span>
            </div>
          </div>
        </div>

        <div className="bid-timer-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          <span style={{ color: 'var(--warning)', fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700 }}>{timeLeft}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>remaining</span>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="filter-label">Your Bid (minimum ฿{(auction.currentBid + 50).toLocaleString()})</label>
          <div className="bid-input-row">
            <button className="bid-adj-btn" onClick={() => setBidAmount(Math.max(auction.currentBid + 50, bidAmount - 100))}>−</button>
            <div className="bid-amount-display">
              <span className="bid-currency">฿</span>
              <input
                type="number"
                className="bid-amount-input"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                min={auction.currentBid + 50}
              />
            </div>
            <button className="bid-adj-btn" onClick={() => setBidAmount(bidAmount + 100)}>+</button>
          </div>
        </div>

        <div className="bid-breakdown">
          <div className="bid-row"><span>Your bid</span><span>฿{bidAmount.toLocaleString()}</span></div>
          <div className="bid-row"><span>Platform fee (2%)</span><span>฿{Math.round(bidAmount * 0.02).toLocaleString()}</span></div>
          <div className="bid-row bid-total"><span>Total if you win</span><span>฿{Math.round(bidAmount * 1.02).toLocaleString()}</span></div>
        </div>

        <button className="btn-primary" onClick={onClose}>
          🔨 Confirm Bid — ฿{bidAmount.toLocaleString()}
        </button>
        <button className="btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default function AuctionPage() {
  const [biddingOn, setBiddingOn] = useState(null);
  const [activeTab, setActiveTab] = useState('live');

  return (
    <div className="auction-page">
      <TopBar
        title="Auction"
        subtitle="Live bidding"
        rightAction={
          <button className="topbar-icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>
        }
      />

      <div className="page-content">
        {/* Tabs */}
        <div className="auction-tabs">
          {['live', 'my bids', 'ended'].map((t) => (
            <button
              key={t}
              className={`profile-tab ${activeTab === t ? 'active' : ''}`}
              onClick={() => setActiveTab(t)}
              style={{ textTransform: 'capitalize' }}
            >
              {t === 'live' && '🔴 '}{t}
            </button>
          ))}
        </div>

        {activeTab === 'live' && (
          <>
            <div className="section-header">
              <span className="section-title">LIVE AUCTIONS</span>
              <span className="badge badge-pink">{AUCTIONS.length} active</span>
            </div>

            <div className="auction-grid">
              {AUCTIONS.map((a) => (
                <AuctionCard key={a.id} auction={a} onBid={setBiddingOn} />
              ))}
            </div>
          </>
        )}

        {activeTab === 'my bids' && (
          <div className="empty-tab">
            <div style={{ fontSize: 40 }}>🔨</div>
            <p>You haven't placed any bids yet</p>
          </div>
        )}

        {activeTab === 'ended' && (
          <div className="empty-tab">
            <div style={{ fontSize: 40 }}>📋</div>
            <p>No ended auctions</p>
          </div>
        )}
      </div>

      {biddingOn && <BidModal auction={biddingOn} onClose={() => setBiddingOn(null)} />}
    </div>
  );
}
