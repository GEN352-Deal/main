import { Router } from 'express';
import supabase from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ─── Get live auctions ────────────────────────────────────────────────────────
// GET /api/auctions?status=live|ended
router.get('/', async (req, res) => {
  const { status = 'live' } = req.query;
  const now = new Date().toISOString();

  let query = supabase
    .from('auctions')
    .select('*, item:item_id(title, images, condition), seller:seller_id(id, name, avatar_url, rating)')
    .order('end_time', { ascending: true });

  if (status === 'live')  query = query.gt('end_time', now).eq('status', 'active');
  if (status === 'ended') query = query.lt('end_time', now);

  const { data, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ─── Get single auction ───────────────────────────────────────────────────────
// GET /api/auctions/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('auctions')
    .select('*, item:item_id(*), seller:seller_id(id, name, avatar_url, rating), bids(*, bidder:bidder_id(id, name))')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Auction not found' });
  res.json(data);
});

// ─── Create auction ───────────────────────────────────────────────────────────
// POST /api/auctions
// body: { item_id, start_bid, end_time }
router.post('/', requireAuth, async (req, res) => {
  const { item_id, start_bid, end_time } = req.body;
  if (!item_id || !start_bid || !end_time) {
    return res.status(400).json({ error: 'item_id, start_bid and end_time are required' });
  }

  const { data: item } = await supabase.from('items').select('user_id').eq('id', item_id).single();
  if (!item || item.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  const { data, error } = await supabase.from('auctions').insert({
    item_id,
    seller_id: req.user.id,
    start_bid,
    current_bid: start_bid,
    end_time,
    bid_count: 0,
    status: 'active',
  }).select().single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// ─── Place bid ────────────────────────────────────────────────────────────────
// POST /api/auctions/:id/bids
// body: { amount }
router.post('/:id/bids', requireAuth, async (req, res) => {
  const { amount } = req.body;
  const now = new Date().toISOString();

  // ดึง auction ปัจจุบัน
  const { data: auction, error: aErr } = await supabase
    .from('auctions').select('*').eq('id', req.params.id).single();
  if (aErr || !auction) return res.status(404).json({ error: 'Auction not found' });

  // Validation
  if (auction.status !== 'active')        return res.status(400).json({ error: 'Auction is not active' });
  if (new Date(auction.end_time) < new Date()) return res.status(400).json({ error: 'Auction has ended' });
  if (amount <= auction.current_bid)      return res.status(400).json({ error: `Bid must be higher than ฿${auction.current_bid}` });
  if (auction.seller_id === req.user.id)  return res.status(400).json({ error: 'Cannot bid on your own item' });

  // บันทึก bid
  const { data: bid, error: bidErr } = await supabase.from('bids').insert({
    auction_id: req.params.id,
    bidder_id: req.user.id,
    amount,
  }).select().single();
  if (bidErr) return res.status(400).json({ error: bidErr.message });

  // อัปเดต current_bid
  await supabase.from('auctions').update({
    current_bid: amount,
    bid_count: auction.bid_count + 1,
  }).eq('id', req.params.id);

  res.status(201).json(bid);
});

// ─── Get my bids ─────────────────────────────────────────────────────────────
// GET /api/auctions/my/bids
router.get('/my/bids', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('bids')
    .select('*, auction:auction_id(*, item:item_id(title, images))')
    .eq('bidder_id', req.user.id)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
