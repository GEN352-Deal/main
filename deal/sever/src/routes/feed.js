import { Router } from 'express';
import supabase from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ─── Get feed posts ───────────────────────────────────────────────────────────
// GET /api/feed?type=all|wanted|offer|giveaway&search=keyword
router.get('/', async (req, res) => {
  const { type, search } = req.query;

  let query = supabase
    .from('feed_posts')
    .select('*, author:user_id(id, name, avatar_url, verified), like_count, comment_count')
    .order('created_at', { ascending: false })
    .limit(30);

  if (type && type !== 'all') query = query.eq('type', type);
  if (search) query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%`);

  const { data, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ─── Create post ─────────────────────────────────────────────────────────────
// POST /api/feed
// body: { title, body, type, tags[], image (base64 optional) }
router.post('/', requireAuth, async (req, res) => {
  const { title, body, type, tags, image } = req.body;
  if (!title || !body || !type) return res.status(400).json({ error: 'title, body and type required' });

  let imageUrl = null;
  if (image) {
    const buffer = Buffer.from(image, 'base64');
    const path   = `feed/${req.user.id}/${Date.now()}.jpg`;
    const { error: upErr } = await supabase.storage
      .from('uploads').upload(path, buffer, { contentType: 'image/jpeg' });
    if (!upErr) {
      const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(path);
      imageUrl = publicUrl;
    }
  }

  const { data, error } = await supabase.from('feed_posts').insert({
    user_id: req.user.id,
    title,
    body,
    type,
    tags: tags || [],
    images: imageUrl ? [imageUrl] : [],
  }).select().single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// ─── Like / Unlike post ───────────────────────────────────────────────────────
// POST /api/feed/:id/like
router.post('/:id/like', requireAuth, async (req, res) => {
  const { data: existing } = await supabase
    .from('post_likes').select('id').eq('post_id', req.params.id).eq('user_id', req.user.id).maybeSingle();

  if (existing) {
    await supabase.from('post_likes').delete().eq('id', existing.id);
    return res.json({ liked: false });
  }
  await supabase.from('post_likes').insert({ post_id: req.params.id, user_id: req.user.id });
  res.json({ liked: true });
});

// ─── Get comments ─────────────────────────────────────────────────────────────
// GET /api/feed/:id/comments
router.get('/:id/comments', async (req, res) => {
  const { data, error } = await supabase
    .from('post_comments')
    .select('*, author:user_id(id, name, avatar_url)')
    .eq('post_id', req.params.id)
    .order('created_at', { ascending: true });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ─── Add comment ─────────────────────────────────────────────────────────────
// POST /api/feed/:id/comments
// body: { text }
router.post('/:id/comments', requireAuth, async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'text required' });

  const { data, error } = await supabase.from('post_comments').insert({
    post_id: req.params.id,
    user_id: req.user.id,
    text: text.trim(),
  }).select('*, author:user_id(id, name, avatar_url)').single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

export default router;
