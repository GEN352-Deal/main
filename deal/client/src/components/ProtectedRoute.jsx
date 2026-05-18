import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // เช็คว่ามีข้อมูล user ใน localStorage หรือไม่ (ปรับเปลี่ยนตามระบบ Auth จริงของคุณได้)
  const isLoggedIn = !!localStorage.getItem("deal_user"); 
  
  // ถ้าล็อกอินแล้วให้แสดงหน้าเว็บปกติ (children) ถ้ายังให้โยนไปหน้า /login
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}