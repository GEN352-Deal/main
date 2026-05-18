import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // แก้ไข URL ให้ตรงกับพอร์ตของ Backend ของคุณ (ค่าเริ่มต้นมักจะเป็น 3000 หรือ 5000 หรือ 8000)
  const API_URL = 'http://localhost:5000/api/auth'; 

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) return setError('Please fill in all fields');
    if (mode === 'register' && !name) return setError('Please enter your name');

    setLoading(true);

    try {
      const endpoint = mode === 'register' ? '/register' : '/login';
      const payload = mode === 'register' ? { email, password, name } : { email, password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // หากเป็นการล็อกอิน ให้เก็บ Token และข้อมูล User
      if (mode === 'login' && data.token) {
        localStorage.setItem('token', data.token); // เก็บ Token ไว้ใช้กับ Route อื่นๆ ที่ต้องการ Auth
        onLogin({ 
          name: data.user?.user_metadata?.full_name || 'User', 
          email: data.user?.email,
          id: data.user?.id
        });
        navigate('/');
      } else {
        // หากสมัครสมาชิกเสร็จ อาจจะสลับโหมดให้มาหน้า Login
        setMode('login');
        setError('Registration successful! Please login.');
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" />

      <div className="login-content">
        {/* Logo */}
        <div className="login-logo">
          <img src="/logo.png" alt="Deal" width="64" height="64" style={{ borderRadius: 16 }} />
          <h1 className="login-brand">DEAL</h1>
          <p className="login-tagline">Trade &amp; Bid — Second-hand made easy</p>
        </div>

        {/* Tabs */}
        <div className="login-tabs">
          <button className={`login-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>
            Login
          </button>
          <button className={`login-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>
            Register
          </button>
        </div>

        {/* Form */}
        <div className="login-form">
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Jordan Lee"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {error && <p className="login-error" style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

          <button className="btn-primary login-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? '...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>

          {mode === 'login' && (
            <button className="btn-ghost" style={{ width: '100%', marginTop: 8 }}>
              Forgot password?
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="login-divider"><span>or continue with</span></div>

        {/* Social */}
        <div className="login-social">
          <button className="social-btn" onClick={() => alert('Social login coming soon!')}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button className="social-btn" onClick={() => alert('Social login coming soon!')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}