import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// สร้างบัญชีใหม่ (Register)
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (error) throw error;
    
    res.status(200).json({ message: 'Registration successful', user: data.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// เข้าสู่ระบบ (Login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    res.status(200).json({ 
      message: 'Login successful', 
      token: data.session.access_token, // ส่ง Token กลับไปให้ Frontend
      user: data.user 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
// Middleware ตรวจสอบ JWT token
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = user;
  next();
};
