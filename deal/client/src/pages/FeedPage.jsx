import { useState, useEffect } from 'react';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import { AUCTIONS } from '../data/mockData';
import './FeedPage.css';

// Custom Hook สำหรับทำเวลานับถอยหลังการประมูลแบบ Real-time
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

// Component ตัวการ์ดรายการประมูลแต่ละชิ้น
function AuctionCard({ auction, onBid }) {
  const timeLeft = useCountdown(auction.endTime);
  const urgent = (auction.endTime - Date.now()) < 2 * 3600000; // เช็กว่าเหลือน้อยกว่า 2 ชม. ไหม (จะขึ้นไฟลุก)

  return (
    <div className="auction-card">
      <div className="auction-img-wrap">
        <img src={auction.image} alt={auction.title} className="auction-img" />
        {urgent && <div className="auction-hot">🔥 Hot</div>}
      </div>
      <div className="auction-card-body">
        <h3 className="auction-card-title">{auction.title}</h3>
        <div className="auction-price-row">
          <div className="auction-price-col">
            <span className="auction-label">ราคาปัจจุบัน</span>
            <span className="auction-val">฿{auction.currentBid.toLocaleString()}</span>
          </div>
          <div className="auction-price-col" style={{ alignItems: 'flex-end' }}>
            <span className="auction-label">เวลาที่เหลือ</span>
            <span className={`auction-time ${urgent ? 'urgent' : ''}`}>{timeLeft}</span>
          </div>
        </div>
        <button className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: 13, marginTop: '8px' }} onClick={() => onBid(auction)}>
          เสนอราคา (Place Bid)
        </button>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState('live');
  const [biddingOn, setBiddingOn] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  return (
    <div className="feed-page auction-mode">
      {/* ส่วนหัวแสดงชื่อ DEAL Auctions ศูนย์กลางการประมูล */}
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
        {/* แถบ Tabs สลับประเภทการดูฟีดประมูล */}
        <div className="auction-tabs">
          {['live', 'my bids', 'ended'].map((t) => (
            <button
              key={t}
              className={`profile-tab ${activeTab === t ? 'active' : ''}`}
              onClick={() => setActiveTab(t)}
              style={{ textTransform: 'capitalize' }}
            >
              {t === 'live' && '🔴 '}{t === 'my bids' && '🔨 '}{t === 'ended' && '📋 '}{t}
            </button>
          ))}
        </div>

        {/* หมวดหมู่: รายการประมูลที่ยังไม่จบ (Live) */}
        {activeTab === 'live' && (
          <div style={{ padding: '0 0 20px 0' }}>
            <div className="section-header" style={{ padding: '16px' }}>
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

        {/* หมวดหมู่: รายการที่ฉันเคยร่วมประมูล (My Bids) */}
        {activeTab === 'my bids' && (
          <div className="empty-tab">
            <div style={{ fontSize: 40 }}>🔨</div>
            <p>คุณยังไม่ได้ร่วมเสนอราคากับสินค้าใดๆ</p>
          </div>
        )}

        {/* หมวดหมู่: รายการประมูลที่ปิดไปแล้ว (Ended) */}
        {activeTab === 'ended' && (
          <div className="empty-tab">
            <div style={{ fontSize: 40 }}>📋</div>
            <p>ไม่มีรายการประมูลที่จบลงเมื่อเร็วๆ นี้</p>
          </div>
        )}
      </div>

      {/* ป๊อปอัปกรอกตัวเลขเพื่อสู้ราคา (Bid Modal Sheet) */}
      {biddingOn && (
        <div className="overlay" onClick={() => setBiddingOn(null)}>
          <div className="overlay-sheet animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 16, letterSpacing: '0.5px' }}>เสนอราคาของคุณ</h3>

            <div style={{ display: 'flex', gap: 12, marginBottom: 24, background: 'var(--bg-elevated, #1A1A1A)', padding: 12, borderRadius: '12px', border: '1px solid #333' }}>
              <img src={biddingOn.image} alt="" style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'white' }}>{biddingOn.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  ราคาสูงสุดตอนนี้: <span style={{ color: 'var(--lime, #A3E635)', fontWeight: 700 }}>฿{biddingOn.currentBid.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* ส่วนปุ่มปรับราคา + - */}
            <div className="bid-input-wrap">
              <button className="bid-adj-btn" onClick={() => setBidAmount(Math.max(biddingOn.currentBid + 100, Number(bidAmount || biddingOn.currentBid + 100) - 100))}>-</button>
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
              <button className="bid-adj-btn" onClick={() => setBidAmount(Number(bidAmount || biddingOn.currentBid + 100) + 100)}>+</button>
            </div>

            {/* ปุ่มคีย์ลัดสำหรับบวกเพิ่มราคาด่วน */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12, marginBottom: 24 }}>
              {[100, 500, 1000].map(amt => (
                <button key={amt} className="chip" style={{ flex: 1, justifyContent: 'center', height: '36px', cursor: 'pointer' }} onClick={() => setBidAmount(biddingOn.currentBid + amt)}>
                  +฿{amt}
                </button>
              ))}
            </div>

            <button className="btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '24px', fontWeight: 'bold' }} onClick={() => { alert('ส่งราคาประมูลสำเร็จ!'); setBiddingOn(null); setBidAmount(''); }}>
              ยืนยันการเสนอราคา
            </button>
          </div>
        </div>
      )}

      {/* ติดตั้งเมนูด้านล่างสุดอย่างปลอดภัย */}
      <BottomNav />
    </div>
  );
}