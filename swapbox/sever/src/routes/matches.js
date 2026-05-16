import { Router } from 'express';
import supabase from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ─── Swipe on item ────────────────────────────────────────────────────────────
// POST /api/matches/swipe
// body: { item_id, direction: "like" | "pass", my_item_id }
router.post('/swipe', requireAuth, async (req, res) => {
  const { item_id, direction, my_item_id } = req.body;
  if (!item_id || !direction) return res.status(400).json({ error: 'item_id and direction required' });

  // บันทึก swipe
  const { error: swipeErr } = await supabase.from('swipes').upsert({
    swiper_id: req.user.id,
    item_id,
    direction,
  });
  if (swipeErr) return res.status(400).json({ error: swipeErr.message });

  // ถ้า pass ไม่ต้องเช็คอะไร
  if (direction === 'pass') return res.json({ matched: false });

  // เช็ค mutual match — เจ้าของ item นั้น like ของเราด้วยไหม?
  const { data: item } = await supabase.from('items').select('user_id').eq('id', item_id).single();
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const { data: theirSwipe } = await supabase
    .from('swipes')
    .select('id')
    .eq('swiper_id', item.user_id)
    .eq('item_id', my_item_id)
    .eq('direction', 'like')
    .maybeSingle();

  if (!theirSwipe) return res.json({ matched: false });

  // สร้าง match!
  const { data: match, error: matchErr } = await supabase
    .from('matches')
    .insert({
      user_a_id:  req.user.id,
      user_b_id:  item.user_id,
      item_a_id:  my_item_id,
      item_b_id:  item_id,
      status: 'matched',
    })
    .select()
    .single();
  if (matchErr) return res.status(400).json({ error: matchErr.message });

  // สร้าง conversation อัตโนมัติ
  await supabase.from('conversations').insert({ match_id: match.id });

  res.json({ matched: true, match });
});

// ─── Get my matches ───────────────────────────────────────────────────────────
// GET /api/matches
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      user_a:user_a_id(id, name, avatar_url),
      user_b:user_b_id(id, name, avatar_url),
      item_a:item_a_id(id, title, images),
      item_b:item_b_id(id, title, images)
    `)
    .or(`user_a_id.eq.${req.user.id},user_b_id.eq.${req.user.id}`)
    .eq('status', 'matched')
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
