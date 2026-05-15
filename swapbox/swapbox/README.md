# SwapBox — Second-Hand Trading & Auction Platform

A mobile-first web app for swapping and auctioning second-hand items.
Built with React + Vite, zero backend (mock data), ready to extend.

---

## 🎨 Brand Colors
| Color    | Hex       | Usage                  |
|----------|-----------|------------------------|
| Hot Pink | `#FF2D78` | Primary CTA, likes     |
| Purple   | `#5D00FF` | Secondary, chat, bids  |
| Lime     | `#C8FF00` | Success, prices, live  |
| Graphite | `#0D0D0D` | Background             |

## 🗂 Project Structure

```
swapbox/
├── public/
│   └── logo.png
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── BottomNav.jsx / .css
│   │       └── TopBar.jsx / .css
│   ├── data/
│   │   └── mockData.js          ← All mock content lives here
│   ├── pages/
│   │   ├── HomePage.jsx / .css  ← Tinder-style swipe
│   │   ├── ChatPage.jsx / .css  ← Messaging + tracking
│   │   ├── ProfilePage.jsx / .css
│   │   ├── FeedPage.jsx / .css  ← Community posts
│   │   ├── AuctionPage.jsx / .css
│   │   ├── PostItemPage.jsx / .css
│   │   ├── ExchangePage.jsx / .css ← Meetup or shipping
│   │   └── SettingsPage.jsx / .css
│   ├── styles/
│   │   ├── globals.css          ← CSS variables, resets, utilities
│   │   └── forms.css
│   ├── App.jsx                  ← Router
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# http://localhost:5173
```

## 📱 Pages & Features

| Route        | Page         | Features                                                |
|-------------|-------------|---------------------------------------------------------|
| `/`          | Home         | Tinder-style swipe deck, category filter, distance      |
| `/feed`      | Community    | Posts, comments, WTT / Offer / Free filter, search      |
| `/post`      | Post Item    | Upload item with photos, category, condition            |
| `/chat`      | Messages     | Conversation list, chat window, shipment tracking       |
| `/profile`   | Profile      | Stats, item grid, history, reviews                      |
| `/auction`   | Auction      | Live bidding, countdown timers, bid modal               |
| `/exchange`  | Exchange     | Meetup or shipping flow (multi-step)                    |
| `/settings`  | Settings     | Profile, notifications, language, logout                |

## 🔧 Extending the Project

### Add Real Backend
- Replace `src/data/mockData.js` imports with API calls
- Suggested: **Supabase** (auth + DB + realtime) or **Firebase**

### Add Authentication
- Install `@supabase/supabase-js` or `firebase`
- Wrap `<App>` with an `<AuthProvider>`
- Redirect unauthenticated users to a Login page

### Add Real Maps (Meetup)
- Install `react-leaflet` + `leaflet`
- Replace `.map-placeholder` in `ExchangePage.jsx`

### Add Push Notifications
- Use **Firebase Cloud Messaging** or **OneSignal**

### Add Image Uploads
- Use **Supabase Storage** or **Cloudinary**
- Hook into the photo upload area in `PostItemPage.jsx`

### Payment Integration
- **Stripe** or **Omise** (Thai-friendly)
- Hook into `ExchangePage.jsx` shipping fee confirmation

## 📦 Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.22.0",
  "lucide-react": "^0.383.0"
}
```

No UI libraries, no Tailwind — pure CSS with custom properties for easy theming.
