import { useState, useEffect } from 'react';
import TopBar from '../components/layout/TopBar';
import { AUCTIONS } from '../data/mockData';
import './FeedPage.css';

const TYPE_COLORS = {
  wanted: { label: 'WTT', class: 'badge-purple' },
  giveaway: { label: 'FREE', class: 'badge-lime' },
  offer: { label: 'OFFER', class: 'badge-pink' },
};

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
  const msLeft = auction.endTime - Date.now();
  const urgent = msLeft < 2 * 3600000 && msLeft > 0;

  return (
    <div className={`auction-card ${urgent ? 'auction-card--urgent' : ''}`}>
      <div className="auction-img-wrap">
        <img src={auction.image} alt={auction.title} className="auction-img" />
        {urgent && <div className="auction-hot">🔥 Hot</div>}
        <div className="auction-overlay-gradient" />
      </div>

      <div className="auction-card-body">
        <h3 className="auction-card-title">{auction.title}</h3>

        <div className="auction-meta-row">
          <div className="auction-meta-item">
            <span className="auction-label">ราคาปัจจุบัน</span>
            <span className="auction-val">฿{auction.currentBid.toLocaleString()}</span>
          </div>

          <div className="auction-meta-divider" />

          <div className="auction-meta-item auction-meta-item--right">
            <span className="auction-label">เวลาที่เหลือ</span>
            <span className={`auction-time ${urgent ? 'urgent' : ''}`}>{timeLeft}</span>
          </div>
        </div>

        <button
          className="btn-bid"
          onClick={() => onBid(auction)}
        >
          เสนอราคา
        </button>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState('live');
  const [biddingOn, setBiddingOn] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  const tabs = [
    { key: 'live', icon: '🔴', label: 'Live' },
    { key: 'my bids', icon: '🔨', label: 'My Bids' },
    { key: 'ended', icon: '📋', label: 'Ended' },
  ];

  return (
    <div className="feed-page auction-mode">
      <TopBar
        title="DEAL Auctions"
        rightAction={
          <button className="topbar-icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        }
      />

      <div className="page-content" style={{ flex: 1, overflowY: 'auto' }}>
        {/* Tab Bar */}
        <div className="auction-tabs">
          {tabs.map(({ key, icon, label }) => (
            <button
              key={key}
              className={`auction-tab-btn ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              <span className="tab-icon">{icon}</span>
              <span className="tab-label">{label}</span>
            </button>
          ))}
        </div>

        {/* Live Tab */}
        {activeTab === 'live' && (
          <div className="tab-content">
            <div className="section-header">
              <span className="section-title">รายการประมูลสด</span>
              <span className="badge badge-pink">{AUCTIONS.length} รายการ</span>
            </div>

            <div className="auction-grid">
              {AUCTIONS.map((a) => (
                <AuctionCard key={a.id} auction={a} onBid={setBiddingOn} />
              ))}
            </div>
          </div>
        )}

        {/* My Bids Tab */}
        {activeTab === 'my bids' && (
          <div className="empty-tab">
            <div className="empty-icon">🔨</div>
            <p className="empty-text">คุณยังไม่ได้ร่วมเสนอราคากับสินค้าใดๆ</p>
          </div>
        )}

        {/* Ended Tab */}
        {activeTab === 'ended' && (
          <div className="empty-tab">
            <div className="empty-icon">📋</div>
            <p className="empty-text">ไม่มีรายการประมูลที่จบลงเมื่อเร็วๆ นี้</p>
          </div>
        )}
      </div>

      {/* Bid Modal */}
      {biddingOn && (
        <div className="overlay" onClick={() => setBiddingOn(null)}>
          <div className="overlay-sheet animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h3 className="sheet-title">เสนอราคาของคุณ</h3>

            {/* Item Preview */}
            <div className="bid-item-preview">
              <img src={biddingOn.image} alt="" className="bid-item-img" />
              <div className="bid-item-info">
                <div className="bid-item-name">{biddingOn.title}</div>
                <div className="bid-item-current">
                  ราคาสูงสุดตอนนี้:{' '}
                  <span className="bid-item-price">฿{biddingOn.currentBid.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="bid-input-wrap">
              <button
                className="bid-adj-btn"
                onClick={() => setBidAmount(Math.max(biddingOn.currentBid + 100, Number(bidAmount || biddingOn.currentBid + 100) - 100))}
              >−</button>
              <div className="bid-amount-display">
                <span className="bid-currency">฿</span>
                <input
                  type="number"
                  className="bid-amount-input"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={(biddingOn.currentBid + 100).toString()}
                />
              </div>
              <button
                className="bid-adj-btn"
                onClick={() => setBidAmount(Number(bidAmount || biddingOn.currentBid + 100) + 100)}
              >+</button>
            </div>

            {/* Quick Add Chips */}
            <div className="bid-chips">
              {[100, 500, 1000].map(amt => (
                <button
                  key={amt}
                  className="bid-chip"
                  onClick={() => setBidAmount(biddingOn.currentBid + amt)}
                >
                  +฿{amt.toLocaleString()}
                </button>
              ))}
            </div>

            <button
              className="btn-primary btn-confirm-bid"
              onClick={() => { alert('ส่งราคาประมูลสำเร็จ!'); setBiddingOn(null); setBidAmount(''); }}
            >
              ✓ ยืนยันการเสนอราคา
            </button>
          </div>
        </div>
      )}
    </div>
  );
}