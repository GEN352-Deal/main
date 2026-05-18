import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes     from './src/routes/auth.js';
import userRoutes     from './src/routes/users.js';
import itemRoutes     from './src/routes/items.js';
import matchRoutes    from './src/routes/matches.js';
import chatRoutes     from './src/routes/chat.js';
import auctionRoutes  from './src/routes/auctions.js';
import exchangeRoutes from './src/routes/exchange.js';
import feedRoutes     from './src/routes/feed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/items',    itemRoutes);
app.use('/api/matches',  matchRoutes);
app.use('/api/chat',     chatRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/feed',     feedRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'SwapBox API running ✅' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
