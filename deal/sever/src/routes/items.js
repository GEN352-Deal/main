import { Router } from 'express';
import supabase from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ─── Get items (Tinder-style swipe feed) ─────────────────────────────────────
// GET /api/items?lat=13.7&lng=100.5&radius=50&category=electronics&exclude=id1,id2
router.get('/', requireAuth, async (req, res) => {
  const { lat, lng, radius = 50, category, exclude } = req.query;
  const excludeIds = exclude ? exclude.split(',') : [];

  let query = supabase
    .from('items_with_distance')   // view ที่คำนวณ distance ไว้แล้ว (ดูใน schema.sql)
    .select('*, user:user_id(id, name, avatar_url, rating, verified)')
    .eq('status', 'available')
    .neq('user_id', req.user.id);  // ไม่แสดงของตัวเอง

  if (category && category !== 'all') query = query.eq('category', category);
  if (excludeIds.length)             query = query.not('id', 'in', `(${excludeIds.join(',')})`);
  if (lat && lng) {
    // ใช้ PostGIS function ที่เขียนใน schema เพื่อกรองระยะ
    query = query.lt('distance_km', Number(radius));
  }

  const { data, error } = await query.order('created_at', { ascending: false }).limit(20);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ─── Get single item ─────────────────────────────────────────────────────────
// GET /api/items/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('items')
    .select('*, user:user_id(id, name, avatar_url, rating, verified)')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Item not found' });
  res.json(data);
});

// ─── Create item ─────────────────────────────────────────────────────────────
// POST /api/items
// body: { title, description, category, condition, want_in_exchange[], images[] (base64) }
router.post('/', requireAuth, async (req, res) => {
  const { title, description, category, condition, want_in_exchange, images } = req.body;
  if (!title || !category || !condition) {
    return res.status(400).json({ error: 'title, category and condition are required' });
  }

  // Upload images to Supabase Storage
  const imageUrls = [];
  if (images && images.length > 0) {
    for (let i = 0; i < Math.min(images.length, 6); i++) {
      const buffer = Buffer.from(images[i], 'base64');
      const path   = `items/${req.user.id}/${Date.now()}_${i}.jpg`;
      const { error: upErr } = await supabase.storage
        .from('uploads')
        .upload(path, buffer, { contentType: 'image/jpeg' });
      if (!upErr) {
        const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(path);
        imageUrls.push(publicUrl);
      }
    }
  }

  // Get user location to attach to item
  const { data: userProfile } = await supabase
    .from('users').select('lat, lng, location').eq('id', req.user.id).single();

  const { data, error } = await supabase.from('items').insert({
    user_id: req.user.id,
    title,
    description,
    category,
    condition,
    want_in_exchange: want_in_exchange || [],
    images: imageUrls,
    lat: userProfile?.lat,
    lng: userProfile?.lng,
    location: userProfile?.location,
    status: 'available',
  }).select().single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// ─── Update item ─────────────────────────────────────────────────────────────
// PATCH /api/items/:id
router.patch('/:id', requireAuth, async (req, res) => {
  const { title, description, category, condition, want_in_exchange, status } = req.body;

  // ตรวจสอบว่าเป็นเจ้าของ
  const { data: item } = await supabase.from('items').select('user_id').eq('id', req.params.id).single();
  if (!item || item.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  const { data, error } = await supabase
    .from('items')
    .update({ title, description, category, condition, want_in_exchange, status })
    .eq('id', req.params.id)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ─── Delete item ─────────────────────────────────────────────────────────────
// DELETE /api/items/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const { data: item } = await supabase.from('items').select('user_id').eq('id', req.params.id).single();
  if (!item || item.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  const { error } = await supabase.from('items').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Deleted' });
});

export default router;
