import express from 'express';
import cors    from 'cors';
import dotenv  from 'dotenv';
dotenv.config();

import authRoutes     from './src/routes/auth.js';
import userRoutes     from './src/routes/users.js';
import itemRoutes     from './src/routes/items.js';
import matchRoutes    from './src/routes/matches.js';
import chatRoutes     from './src/routes/chat.js';
import auctionRoutes  from './src/routes/auctions.js';
import exchangeRoutes from './src/routes/exchange.js';
import feedRoutes     from './src/routes/feed.js';
import reviewRoutes   from './src/routes/reviews.js';

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json({ limit: '20mb' }));  // large limit for base64 images

app.use('/api/auth',     authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/items',    itemRoutes);
app.use('/api/matches',  matchRoutes);
app.use('/api/chat',     chatRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/feed',     feedRoutes);
app.use('/api/reviews',  reviewRoutes);

app.get('/', (_req, res) => res.json({ status: '✅ Deal API running', version: '1.0.0' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));