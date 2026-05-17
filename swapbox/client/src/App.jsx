import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import FeedPage from './pages/FeedPage';
import AuctionPage from './pages/AuctionPage';
import PostItemPage from './pages/PostItemPage';
import ExchangePage from './pages/ExchangePage';
import SettingsPage from './pages/SettingsPage';

function AppShell() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/auction" element={<AuctionPage />} />
        <Route path="/post" element={<PostItemPage />} />
        <Route path="/exchange" element={<ExchangePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>

      {/* แสดง Bottom Navigation ทุกหน้า */}
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}