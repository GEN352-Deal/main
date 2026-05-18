import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// สร้างรีวิวใหม่
router.post('/', async (req, res) => {
  const { order_id, reviewer_id, target_user_id, rating, comment } = req.body;

  try {
    const { data, error } = await supabase.from('reviews').insert([
      {
        order_id,
        reviewer_id,
        target_user_id,
        rating,
        comment,
        created_at: new Date()
      }
    ]);

    if (error) throw error;

    // เมื่อรีวิวเสร็จ อาจจะต้องไปอัปเดตสถานะออเดอร์เป็น 'completed' ด้วย
    await supabase.from('orders').update({ status: 'completed' }).eq('id', order_id);

    res.status(201).json({ message: 'Review submitted successfully', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;