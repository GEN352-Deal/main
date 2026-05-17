import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, PlusSquare, User, Package } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/feed', icon: Package, label: 'Feed' },
    { path: '/post', icon: PlusSquare, label: 'Post' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav">
      {navItems.map(({ path, icon: Icon, label }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          className={`nav-item ${isActive(path) ? 'active' : ''}`}
          aria-label={label}
        >
          <Icon className="nav-icon" size={24} strokeWidth={2} />
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}