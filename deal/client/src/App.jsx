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
      {/*
        main-content: ใช้ overflow: hidden เพื่อให้แต่ละ page จัดการ scroll เอง
        ไม่ใช้ overflowY: auto เพราะจะซ้อน scroll layer กับ page-content ข้างใน
        ไม่ต้องมี paddingBottom เพราะ BottomNav อยู่ใน flex flow แล้ว (ไม่ได้ fixed)
      */}
      <div
        className="main-content"
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
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

      {/* BottomNav อยู่ใน flex flow → ไม่บัง content ด้านบนโดยอัตโนมัติ */}
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