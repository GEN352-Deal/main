import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ThaiD demo user (จำลองข้อมูลผู้ใช้ที่ผ่านการยืนยันตัวตน)
  const thaidMockUser = {
    id: 'thaid_1234567890',
    name: 'สมชาย ใจดี',
    email: 'somchai@thaid.go.th',
    citizenId: '1101700123456',
    phoneNumber: '0812345678'
  };

  // จำลองการยืนยันตัวตนผ่าน ThaiD (ไม่มีการเช็ค condition อะไร กดแล้วเข้าได้เลย)
  const handleThaiDLogin = async () => {
    setError('');
    setLoading(true);

    // จำลองความล่าช้าในการเรียก API (เพื่อให้เห็น animation)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // เก็บข้อมูล ThaiD ลง localStorage
    localStorage.setItem('thaid_verified', 'true');
    localStorage.setItem('thaid_user', JSON.stringify(thaidMockUser));
    localStorage.setItem('deal_user', JSON.stringify(thaidMockUser));
    // ถ้า onLogin ถูกส่งมาและเป็น function ให้เรียกใช้
    if (onLogin && typeof onLogin === 'function') {
      onLogin({ 
        name: thaidMockUser.name, 
        email: thaidMockUser.email,
        id: thaidMockUser.id,
        citizenId: thaidMockUser.citizenId
      });
    }

    setLoading(false);
    // นำทางไปยังหน้า HomePage
    navigate('/');
  };

  return (
    <div className="login-root login-root--visible">
      {/* Ambient blobs ธีม pink/purple/lime */}
      <div className="login-blob login-blob--pink" />
      <div className="login-blob login-blob--purple" />
      <div className="login-blob login-blob--lime" />

      <div className="login-card">
        {/* Logo + Brand */}
        <div className="login-logo-wrap">
          <div className="login-logo-ring">
            <span className="login-logo-text">DL</span>
          </div>
        </div>
        <h1 className="login-title">
          DEAL<span className="login-title-dot">.</span>
        </h1>
        <div className="login-subtitle">Trade & Bid — Second-hand made easy</div>

        <div className="login-divider" />

        {/* ThaiD Info Box */}
        <div className="login-thaid-info">
          <div className="login-thaid-badge">🔐 ต้องยืนยันตัวตนผ่าน ThaiD</div>
          <p className="login-thaid-desc">
            ระบบของเราใช้การยืนยันตัวตนดิจิทัลของไทย<br />
            เพื่อความปลอดภัยสูงสุด
          </p>
        </div>

        {/* ThaiD Login Button */}
        <button
          className={`login-btn ${loading ? 'login-btn--loading' : ''}`}
          onClick={handleThaiDLogin}
          disabled={loading}
        >
          {loading ? (
            <div className="login-btn-spinner" />
          ) : (
            <>
              <svg
                className="login-thaid-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>เข้าสู่ระบบด้วย ThaiD</span>
            </>
          )}
        </button>

        {error && <p className="login-error-message">{error}</p>}

        {/* Terms */}
        <p className="login-terms">
          โดยการเข้าสู่ระบบคุณยอมรับ{" "}
          <a href="#" className="login-link">ข้อกำหนดและเงื่อนไข</a>{" "}
          และ{" "}
          <a href="#" className="login-link">นโยบายความเป็นส่วนตัว</a>
        </p>
      </div>

      <div className="login-footer">
        <span>ระบบปฏิบัติตาม พ.ร.บ. การรักษาความมั่นคงปลอดภัยไซเบอร์</span>
      </div>
    </div>
  );
}