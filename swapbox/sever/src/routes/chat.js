import { Router } from 'express';
import supabase from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ─── Get all conversations (chat list) ───────────────────────────────────────
// GET /api/chat/conversations
router.get('/conversations', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      match:match_id(
        user_a:user_a_id(id, name, avatar_url),
        user_b:user_b_id(id, name, avatar_url),
        item_a:item_a_id(id, title, images),
        item_b:item_b_id(id, title, images)
      ),
      messages(text, created_at, sender_id)
    `)
    .order('updated_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  // หา last message และ unread count ต่อ conversation
  const result = data.map(conv => {
    const msgs = conv.messages || [];
    const lastMsg = msgs[msgs.length - 1];
    const unread  = msgs.filter(m => m.sender_id !== req.user.id && !m.read).length;
    return { ...conv, lastMessage: lastMsg, unreadCount: unread };
  });

  res.json(result);
});

// ─── Get messages in a conversation ─────────────────────────────────────────
// GET /api/chat/conversations/:id/messages
router.get('/conversations/:id/messages', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:sender_id(id, name, avatar_url)')
    .eq('conversation_id', req.params.id)
    .order('created_at', { ascending: true });
  if (error) return res.status(400).json({ error: error.message });

  // Mark as read
  await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', req.params.id)
    .neq('sender_id', req.user.id);

  res.json(data);
});

// ─── Send message ─────────────────────────────────────────────────────────────
// POST /api/chat/conversations/:id/messages
// body: { text }
// Note: Real-time delivery จะเกิดขึ้นผ่าน Supabase Realtime ใน frontend
router.post('/conversations/:id/messages', requireAuth, async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'text is required' });

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: req.params.id,
      sender_id: req.user.id,
      text: text.trim(),
      read: false,
    })
    .select('*, sender:sender_id(id, name, avatar_url)')
    .single();
  if (error) return res.status(400).json({ error: error.message });

  // อัปเดต updated_at ของ conversation
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', req.params.id);

  res.status(201).json(data);
});

export default router;
