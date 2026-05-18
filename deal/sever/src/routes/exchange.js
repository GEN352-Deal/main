import { Router } from 'express';
import supabase from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ─── Create exchange arrangement ─────────────────────────────────────────────
// POST /api/exchange
// body: { match_id, method: "meetup"|"ship", details: { ... } }
router.post('/', requireAuth, async (req, res) => {
  const { match_id, method, details } = req.body;
  if (!match_id || !method) return res.status(400).json({ error: 'match_id and method required' });

  const payload = {
    match_id,
    initiated_by: req.user.id,
    method,
    status: 'pending',
    ...(method === 'meetup' ? {
      meetup_location: details.location,
      meetup_time:     details.time,
      meetup_phone:    details.phone,
    } : {
      from_address:    details.fromAddress,
      to_address:      details.toAddress,
      courier:         details.courier,
      shipping_fee:    details.shippingFee,
    }),
  };

  const { data, error } = await supabase.from('exchanges').insert(payload).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// ─── Confirm exchange ─────────────────────────────────────────────────────────
// PATCH /api/exchange/:id/confirm
router.patch('/:id/confirm', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('exchanges')
    .update({ status: 'confirmed' })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ─── Add tracking number (after shipping) ────────────────────────────────────
// PATCH /api/exchange/:id/tracking
// body: { tracking_number, courier }
router.patch('/:id/tracking', requireAuth, async (req, res) => {
  const { tracking_number, courier } = req.body;
  if (!tracking_number) return res.status(400).json({ error: 'tracking_number required' });

  const { data, error } = await supabase
    .from('exchanges')
    .update({
      tracking_number,
      courier,
      status: 'shipped',
    })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ─── Get tracking steps for an exchange ──────────────────────────────────────
// GET /api/exchange/:id/tracking
router.get('/:id/tracking', requireAuth, async (req, res) => {
  const { data: exchange, error } = await supabase
    .from('exchanges')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Exchange not found' });

  // สร้าง tracking steps จากสถานะ
  const steps = buildTrackingSteps(exchange);
  res.json({ exchange, steps });
});

function buildTrackingSteps(exchange) {
  const statuses = ['pending', 'confirmed', 'shipped', 'in_transit', 'delivered'];
  const labels   = ['Swap Confirmed', 'Item Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
  const currentIdx = statuses.indexOf(exchange.status);

  return labels.map((label, i) => ({
    id:    i + 1,
    label,
    done:  i <= currentIdx,
    time:  i <= currentIdx ? exchange.updated_at : null,
  }));
}

// ─── Get exchanges related to a match ────────────────────────────────────────
// GET /api/exchange/match/:match_id
router.get('/match/:match_id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('exchanges')
    .select('*')
    .eq('match_id', req.params.match_id)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
