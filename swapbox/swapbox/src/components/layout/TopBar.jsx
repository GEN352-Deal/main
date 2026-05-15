import { useNavigate } from 'react-router-dom';
import './TopBar.css';

export default function TopBar({ title, showBack, showLogo, rightAction, subtitle }) {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="topbar-left">
        {showBack && (
          <button className="topbar-back" onClick={() => navigate(-1)} aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
            </svg>
          </button>
        )}
        {showLogo && (
          <div className="topbar-logo">
            <img src="/logo.png" alt="SwapBox" width="32" height="32" />
            <span className="topbar-brand">SWAPBOX</span>
          </div>
        )}
        {title && !showLogo && (
          <div className="topbar-title-group">
            <span className="topbar-title">{title}</span>
            {subtitle && <span className="topbar-subtitle">{subtitle}</span>}
          </div>
        )}
      </div>
      <div className="topbar-right">
        {rightAction}
      </div>
    </header>
  );
}
