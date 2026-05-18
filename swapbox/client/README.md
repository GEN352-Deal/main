# 🔄 Deal — Trade & Bid

A mobile-first second-hand trading and auction platform where users can swap items Tinder-style, bid in live auctions, and arrange meetups or shipping.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ → [Download here](https://nodejs.org)
- **VS Code** (recommended) → [Download here](https://code.visualstudio.com)

### Installation & Run

1. **Clone or download the project**
```bash
git clone <your-repo-url>
cd deal
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the dev server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

---

## 🎨 Brand Colors

| Color    | Hex       | Usage                        |
|----------|-----------|------------------------------|
| Hot Pink | `#FF2D78` | Primary CTA, likes, actions  |
| Purple   | `#5D00FF` | Chat, bids, secondary        |
| Lime     | `#C8FF00` | Success, prices, live badge  |
| Graphite | `#0D0D0D` | Background                   |

---

## 🗂 Project Structure

```
deal/
├── public/
│   └── logo.png
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── BottomNav.jsx / .css     # Bottom navigation bar
│   │       └── TopBar.jsx / .css        # Top header bar
│   ├── data/
│   │   └── mockData.js                  # All mock content lives here
│   ├── pages/
│   │   ├── HomePage.jsx / .css          # Tinder-style swipe deck
│   │   ├── FeedPage.jsx / .css          # Community posts & search
│   │   ├── ChatPage.jsx / .css          # Messaging + shipment tracking
│   │   ├── AuctionPage.jsx / .css       # Live bidding with countdown
│   │   ├── PostItemPage.jsx / .css      # Upload & list a swap item
│   │   ├── ExchangePage.jsx / .css      # Meetup or shipping flow
│   │   ├── ProfilePage.jsx / .css       # Stats, items, reviews
│   │   └── SettingsPage.jsx / .css      # Account & preferences
│   ├── styles/
│   │   ├── globals.css                  # CSS variables, resets, utilities
│   │   └── forms.css                    # Form shared styles
│   ├── App.jsx                          # Router setup
│   └── main.jsx                         # Entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## 📱 Pages & Features

| Route        | Page         | Features                                                  |
|--------------|--------------|-----------------------------------------------------------|
| `/`          | Home         | Tinder-style swipe deck, category filter, distance filter |
| `/feed`      | Community    | Posts, comments, WTT / Offer / Free filter, search        |
| `/post`      | Post Item    | Upload item with photos, category, condition              |
| `/chat`      | Messages     | Conversation list, chat window, shipment tracking         |
| `/auction`   | Auction      | Live bidding, countdown timers, bid modal                 |
| `/exchange`  | Exchange     | Meetup or shipping flow (multi-step wizard)               |
| `/profile`   | Profile      | Stats, item grid, history, reviews                        |
| `/settings`  | Settings     | Profile, notifications, language, logout                  |

---

## 🔧 Backend (Supabase + Express)

```
deal-backend/
├── server.js
├── database/
│   └── schema.sql          # Run this in Supabase SQL Editor first
└── src/
    ├── config/supabase.js
    ├── middleware/auth.js
    └── routes/
        ├── auth.js          # register, login, logout
        ├── users.js         # profile, location, avatar
        ├── items.js         # CRUD + image upload + distance
        ├── matches.js       # swipe left/right + mutual match
        ├── chat.js          # conversations + real-time messages
        ├── auctions.js      # live bidding + countdown
        ├── exchange.js      # meetup/ship + parcel tracking
        └── feed.js          # posts + likes + comments
```

### Backend Setup

```bash
cd deal-backend
npm install
cp .env.example .env   # ใส่ Supabase keys
npm run dev            # runs on http://localhost:3001
```

### Environment Variables

```env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
PORT=3001
FRONTEND_URL=http://localhost:5173
```

---

## 🗄 Database (PostgreSQL via Supabase)

| Table            | Purpose                        |
|------------------|--------------------------------|
| `users`          | Profiles + location (lat/lng)  |
| `items`          | Swap listings + images         |
| `swipes`         | Like / pass history            |
| `matches`        | Mutual matches                 |
| `conversations`  | Chat threads per match         |
| `messages`       | Real-time chat messages        |
| `auctions`       | Live auction listings          |
| `bids`           | Bid history per auction        |
| `exchanges`      | Meetup or shipping details     |
| `feed_posts`     | Community posts                |
| `post_likes`     | Post likes                     |
| `post_comments`  | Post comments                  |
| `reviews`        | User reviews after swap        |

---

## 📦 Dependencies

**Frontend**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.22.0",
  "lucide-react": "^0.383.0"
}
```

**Backend**
```json
{
  "express": "^4.18.2",
  "@supabase/supabase-js": "^2.39.0",
  "cors": "^2.8.5",
  "dotenv": "^16.4.1",
  "multer": "^1.4.5-lts.1"
}
```

---

## 🚢 Deployment (Free)

| Service  | Purpose             | Free Tier           |
|----------|---------------------|---------------------|
| Vercel   | Frontend hosting    | ✅ Unlimited         |
| Render   | Backend hosting     | ✅ 750 hrs/month     |
| Supabase | DB + Auth + Storage | ✅ 500MB DB          |

**Deploy Frontend (Vercel)**
```bash
# Push to GitHub → connect repo on vercel.com → auto deploy
```

**Deploy Backend (Render)**
```bash
# Push backend folder to GitHub → connect on render.com
# Set environment variables in Render dashboard
```

---

## 👥 Team

| Name | Student ID | Role |
|------|------------|------|
|      |            |      |
|      |            |      |
|      |            |      |

---

## 📄 License

This project is for educational purposes — **GEN352 Course Project**.
