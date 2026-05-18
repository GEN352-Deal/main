import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// ดึงรายการคำสั่งซื้อตามสถานะ (to-pay, to-ship, to-receive, to-rate)
router.get('/', async (req, res) => {
  // รับ status จาก query parameter และสมมติว่ามีการส่ง userId มาด้วย (ในระบบจริงควรดึงจาก Token/Session)
  const { status, userId } = req.query; 

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // สมมติชื่อตารางใน Database คือ 'orders'
    let query = supabase.from('orders').select('*').eq('user_id', userId);
    
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;