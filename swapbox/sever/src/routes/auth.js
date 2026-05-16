import { Router } from 'express';
import supabase from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ─── Register ─────────────────────────────────────────────────────────────────
// POST /api/auth/register
// body: { email, password, name, username }
router.post('/register', async (req, res) => {
  const { email, password, name, username } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'email, password and name are required' });
  }

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError) return res.status(400).json({ error: authError.message });

  // 2. Create profile in users table
  const { error: profileError } = await supabase.from('users').insert({
    id: authData.user.id,
    name,
    username: username || `@${name.toLowerCase().replace(/\s/g, '')}`,
    email,
  });
  if (profileError) return res.status(400).json({ error: profileError.message });

  res.status(201).json({ message: 'Registered successfully', user: authData.user });
});

// ─── Login ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// body: { email, password }
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });

  res.json({ session: data.session, user: data.user });
});

// ─── Logout ───────────────────────────────────────────────────────────────────
// POST /api/auth/logout
router.post('/logout', requireAuth, async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  await supabase.auth.admin.signOut(token);
  res.json({ message: 'Logged out' });
});

// ─── Get current user ────────────────────────────────────────────────────────
// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.user.id)
    .single();
  if (error) return res.status(404).json({ error: 'User not found' });
  res.json(data);
});

export default router;
