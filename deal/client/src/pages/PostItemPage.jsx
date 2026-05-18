import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';

export default function PostItemPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // States สำหรับเก็บข้อมูลโพสต์
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. ฟังก์ชันจัดการอัปโหลดรูปภาพ
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  // 2. ฟังก์ชันจัดการ Tag ผู้คน
  const handleTagPeople = () => {
    const username = prompt("ระบุชื่อผู้ใช้ที่ต้องการ Tag (เช่น @jordan):");
    if (username) {
      setTaggedUsers([...taggedUsers, username]);
    }
  };

  // 3. ฟังก์ชันดึงพิกัด Location (GPS)
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          setLocation(`Lat: ${lat}, Lng: ${lng}`);
          setLoading(false);
        },
        (error) => {
          alert("ไม่สามารถเข้าถึงตำแหน่งที่ตั้งได้ กรุณาเปิดการเข้าถึง GPS");
          setLoading(false);
        }
      );
    } else {
      alert("เบราว์เซอร์ของคุณไม่รองรับการดึงตำแหน่งที่ตั้ง");
    }
  };

  // 4. ฟังก์ชันกดปุ่ม Share (ส่งข้อมูลไป Backend)
  const handleShare = async () => {
    if (!imageFile) return alert('กรุณาอัปโหลดรูปภาพก่อนแชร์');
    
    setLoading(true);
    
    // โค้ดสำหรับส่งข้อมูลไปยัง Backend (FormData)
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('caption', caption);
    formData.append('location', location);
    formData.append('tagged_users', JSON.stringify(taggedUsers));

    try {
      // ของจริงจะใช้ fetch POST แบบนี้:
      // await fetch('http://localhost:3001/api/items', { method: 'POST', body: formData });
      
      console.log('ข้อมูลพร้อมส่งไป Backend:', { imageFile, caption, location, taggedUsers });
      
      // จำลองดีเลย์การอัปโหลดให้ดูสมจริง (Mock)
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      alert('แชร์โพสต์สำเร็จ!');
      navigate('/feed'); // แชร์เสร็จเด้งกลับไปหน้า Feed
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการแชร์โพสต์');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-base, #121212)', color: 'white' }}>
      {/* แถบด้านบน */}
      <TopBar title="New post" showBack={true} />

      {/* พื้นที่เนื้อหาที่เลื่อนได้ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        
        {/* ส่วนอัปโหลดรูปภาพ */}
        <div 
          onClick={() => fileInputRef.current.click()}
          style={{
            width: '100%',
            aspectRatio: '1',
            background: 'var(--bg-elevated, #1A1A1A)',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '16px',
            overflow: 'hidden',
            cursor: 'pointer',
            border: '1px dashed var(--border-color, #333)'
          }}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ color: 'var(--text-muted, #888)', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📸</div>
              <span>แตะเพื่อเพิ่มรูปภาพ</span>
            </div>
          )}
        </div>
        {/* ซ่อน Input type file เอาไว้ให้ทำงานเบื้องหลัง */}
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />

        {/* ส่วนพิมพ์แคปชั่น */}
        <textarea
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{ 
            width: '100%', background: 'transparent', border: 'none', color: 'white', 
            fontSize: '15px', minHeight: '60px', outline: 'none', marginBottom: '24px', resize: 'none', fontFamily: 'inherit'
          }}
        />

        {/* เมนูตัวเลือกต่างๆ (Tag, Location, Audio) */}
        <div style={{ background: 'var(--bg-elevated, #1A1A1A)', borderRadius: '12px', overflow: 'hidden' }}>
          
          <button style={{ width: '100%', padding: '16px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color, #333)', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'not-allowed', textAlign: 'left', opacity: 0.5 }}>
            <span style={{ fontSize: '20px' }}>🎵</span> Add audio (Coming soon)
          </button>
          
          <button onClick={handleTagPeople} style={{ width: '100%', padding: '16px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color, #333)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>👤</span> Tag people
            </div>
            {taggedUsers.length > 0 && <span style={{ color: 'var(--primary, #FF4D4F)', fontSize: '13px' }}>{taggedUsers.length} people</span>}
          </button>
          
          <button onClick={handleGetLocation} style={{ width: '100%', padding: '16px', background: 'transparent', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>📍</span> Add location
            </div>
            {location && <span style={{ color: 'var(--primary, #FF4D4F)', fontSize: '13px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{location}</span>}
          </button>
          
        </div>
      </div>

      {/* ปุ่ม Share ด้านล่างสุด (Sticky) */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-color, #333)', background: 'var(--bg-base, #121212)', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
        <button
          onClick={handleShare}
          disabled={!imageFile || loading}
          style={{ 
            width: '100%', padding: '14px', 
            background: imageFile ? 'linear-gradient(135deg, var(--pink, #FF2D78), var(--purple, #5D00FF))' : '#333', 
            color: imageFile ? 'white' : '#888', 
            border: 'none', borderRadius: '24px', fontSize: '16px', fontWeight: 'bold', 
            cursor: imageFile ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            boxShadow: imageFile ? '0 4px 12px rgba(255, 45, 120, 0.3)' : 'none'
          }}
        >
          {loading ? 'กำลังแชร์...' : 'Share'}
        </button>
      </div>
    </div>
  );
}