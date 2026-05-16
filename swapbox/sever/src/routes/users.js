import { Router } from 'express';
import supabase from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ─── Get user profile ────────────────────────────────────────────────────────
// GET /api/users/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, username, bio, avatar_url, rating, total_reviews, followers, following, successful_swaps, location, verified, created_at')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'User not found' });
  res.json(data);
});

// ─── Update profile ───────────────────────────────────────────────────────────
// PATCH /api/users/me
// body: { name, bio, username }
router.patch('/me', requireAuth, async (req, res) => {
  const { name, bio, username } = req.body;
  const { data, error } = await supabase
    .from('users')
    .update({ name, bio, username })
    .eq('id', req.user.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ─── Update location ─────────────────────────────────────────────────────────
// PATCH /api/users/me/location
// body: { lat, lng, location_name }
router.patch('/me/location', requireAuth, async (req, res) => {
  const { lat, lng, location_name } = req.body;
  const { data, error } = await supabase
    .from('users')
    .update({ lat, lng, location: location_name })
    .eq('id', req.user.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ─── Upload avatar ────────────────────────────────────────────────────────────
// POST /api/users/me/avatar
// body: FormData with file field "avatar"
router.post('/me/avatar', requireAuth, async (req, res) => {
  // Read raw body as buffer (use express.raw or multer in real usage)
  const file   = req.body.file;   // base64 string from frontend
  const buffer = Buffer.from(file, 'base64');
  const path   = `avatars/${req.user.id}/avatar.jpg`;

  const { error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(path, buffer, { contentType: 'image/jpeg', upsert: true });
  if (uploadError) return res.status(400).json({ error: uploadError.message });

  const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(path);

  const { data, error } = await supabase
    .from('users')
    .update({ avatar_url: publicUrl })
    .eq('id', req.user.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ avatar_url: data.avatar_url });
});

// ─── Get user items ───────────────────────────────────────────────────────────
// GET /api/users/:id/items
router.get('/:id/items', async (req, res) => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', req.params.id)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ─── Get user reviews ────────────────────────────────────────────────────────
// GET /api/users/:id/reviews
router.get('/:id/reviews', async (req, res) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, reviewer:reviewer_id(name, avatar_url)')
    .eq('user_id', req.params.id)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
