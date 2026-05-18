import { BrowserRouter, Routes, Route } from "react-router-dom";

// ── Components & Layout ──
import BottomNav from "./components/layout/BottomNav";
import ProtectedRoute from './components/ProtectedRoute';

// ── Pages ──
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import FeedPage from "./pages/FeedPage";
import AuctionPage from "./pages/AuctionPage";
import PostItemPage from "./pages/PostItemPage";
import ExchangePage from "./pages/ExchangePage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import ThaiDMock from './pages/ThaiDMock';

// ── Main Shell ──
function AppShell() {
  return (
    <div 
      className="app-shell" 
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}
    >
      {/* เพิ่ม div ครอบ Routes เพื่อให้ส่วนเนื้อหา Scroll ได้โดยไม่ดัน BottomNav ตกจอ */}
      <div className="main-content" style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/thaid" element={<ThaiDMock />} />

          {/* Protected routes */}
          <Route path="/"         element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/chat"     element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/profile"  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/feed"     element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
          <Route path="/auction"  element={<ProtectedRoute><AuctionPage /></ProtectedRoute>} />
          <Route path="/post"     element={<ProtectedRoute><PostItemPage /></ProtectedRoute>} />
          <Route path="/exchange" element={<ProtectedRoute><ExchangePage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
      </div>
      
      {/* BottomNav จะถูกล็อคติดอยู่ด้านล่างเสมอ */}
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