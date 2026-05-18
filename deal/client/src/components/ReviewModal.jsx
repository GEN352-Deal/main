import { useState } from 'react';

export default function ReviewModal({ order, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    // ของจริงจะใช้ fetch POST ไปที่ http://localhost:3001/api/reviews
    console.log('Submit Review:', { orderId: order.id, rating, comment });
    alert('ส่งรีวิวสำเร็จ!');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
      <div style={{ backgroundColor: 'var(--bg-elevated, #1A1A1A)', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '350px', border: '1px solid var(--border-color, #333)' }}>
        <h3 style={{ margin: '0 0 16px 0', textAlign: 'center', color: 'var(--text-primary)' }}>ให้คะแนนคำสั่งซื้อ</h3>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button 
              key={star}
              onClick={() => setRating(star)}
              style={{ background: 'none', border: 'none', fontSize: '32px', color: star <= rating ? '#FFB800' : '#444', cursor: 'pointer' }}
            >
              ★
            </button>
          ))}
        </div>

        <textarea 
          placeholder="เขียนความรู้สึกของคุณต่อการแลกเปลี่ยนครั้งนี้..." 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ width: '100%', height: '100px', marginBottom: '20px', padding: '12px', boxSizing: 'border-box', borderRadius: '8px', background: 'var(--bg-base, #000)', color: 'var(--text-primary)', border: '1px solid var(--border-color, #333)' }}
        />

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--border-color, #333)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}>
            ยกเลิก
          </button>
          <button onClick={handleSubmit} style={{ flex: 1, padding: '12px', background: 'var(--primary, #FF4D4F)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}