# Foodpedia — Restaurant Discovery & Review Platform

A scalable restaurant discovery and review platform built with React, Redux Toolkit, and React Router. Users can browse restaurants, filter by cuisine, submit ratings, and view real-time review analytics across the platform.

---

## Features

- **Restaurant Discovery** — Browse and search restaurants by name, cuisine, or neighborhood
- **Filtering & Sorting** — Filter by cuisine type, sort by rating, review count, or name; filters sync to URL params
- **Restaurant Detail Pages** — Full info sidebar, photo hero, open/closed status, price range, and tag breakdown
- **Review System** — Authenticated users can submit star ratings, write reviews, and tag experiences; ratings aggregate in real time
- **Rating Breakdown** — Per-restaurant animated bar chart showing distribution across all star levels
- **Stats Dashboard** — Platform-wide KPI cards, rating distribution chart, reviews by cuisine ranking, and top-rated restaurants
- **Auth Flow** — Register, login, logout with form validation, persistent session via localStorage, and protected routes
- **User Profile** — View your full review history with restaurant context

---

## Tech Stack

| Layer   | Technology                                                        |
| ------- | ----------------------------------------------------------------- |
| UI      | React 18, React Router v6                                         |
| State   | Redux Toolkit, Redux Thunk                                        |
| Styling | Custom CSS (CSS variables, no framework dependency)               |
| Fonts   | Playfair Display, DM Sans (Google Fonts)                          |
| Data    | Mock REST API with simulated latency + sessionStorage persistence |

---

## Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.js          # Global nav with auth-aware actions
│   │   └── StarRating.js      # StarDisplay + interactive StarPicker
│   ├── restaurant/
│   │   └── RestaurantCard.js  # Card used in grid listings
│   ├── review/
│   │   ├── ReviewCard.js      # Individual review display with delete
│   │   ├── ReviewForm.js      # Authenticated review submission form
│   │   └── RatingBreakdown.js # Animated star distribution chart
│   └── stats/
│       └── StatsDashboard.js  # KPI cards, bar charts, cuisine rankings
├── hooks/
│   └── useToast.js            # Toast notification context + provider
├── pages/
│   ├── HomePage.js            # Hero, featured restaurants, cuisine quick-links
│   ├── RestaurantsPage.js     # Filterable, searchable restaurant grid
│   ├── RestaurantDetailPage.js# Full detail view with reviews
│   ├── LoginPage.js           # Login form with demo account fill
│   ├── RegisterPage.js        # Registration with validation
│   ├── ProfilePage.js         # Protected user review history
│   └── StatsPage.js           # Platform analytics dashboard
├── store/
│   ├── index.js               # Store configuration
│   └── slices/
│       ├── authSlice.js       # Auth state, login/register thunks, selectors
│       ├── restaurantsSlice.js# Normalized restaurant store, filter state
│       ├── reviewsSlice.js    # Reviews by restaurant, submit/delete thunks
│       └── statsSlice.js      # Platform-wide analytics state
└── utils/
    ├── api.js                 # Mock REST API with simulated async delays
    └── mockData.js            # Seed data: restaurants, reviews, users
```

---

## Getting Started

### Prerequisites

- Node.js v16+
- npm v8+

### Installation

```bash
# 1. Clone or unzip the project
cd foodpedia

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at `http://localhost:3000`.

---

## Demo Accounts

No backend required — the app ships with seeded data and an in-memory mock API.

| Name        | Email           | Password |
| ----------- | --------------- | -------- |
| Alex Rivera | alex@demo.com   | demo123  |
| Jordan Kim  | jordan@demo.com | demo123  |

These are also available as one-click fill buttons on the login page.

---

## Architecture Notes

### State Management

The Redux store uses a normalized structure across four slices:

- **`auth`** — Current user, token, loading/error states. Persisted to `localStorage` for session continuity.
- **`restaurants`** — Normalized by ID (`byId` + `allIds`), with filter state (`search`, `cuisine`, `sort`). Detail loading tracked separately.
- **`reviews`** — Keyed by `restaurantId` for O(1) lookup. Submit/delete thunks dispatch rating recalculation back into the restaurants slice.
- **`stats`** — Derived platform analytics computed server-side (in the mock API layer).

### Mock API

`src/utils/api.js` simulates a REST API with:

- Randomized latency (400–700ms) to demonstrate loading states
- `sessionStorage` persistence so data survives page refreshes within a session
- Duplicate review detection, user lookup, and rating aggregation

### Performance Patterns

- Memoized selectors via direct state access patterns (compatible with `reselect`)
- Controlled re-renders through slice-level loading flags
- URL-synced filter state via `useSearchParams` to support deep linking

---

## Available Scripts

```bash
npm start       # Start development server
npm run build   # Create production build
npm test        # Run test suite
```

---

## Potential Extensions

- Replace mock API with a real REST or GraphQL backend (Node/Express, Firebase, Supabase)
- Add image upload for restaurant photos
- Implement pagination or infinite scroll on the restaurant listing
- Add a map view using Google Maps or Mapbox
- Introduce `reselect` for memoized derived selectors at scale
- Add unit tests for Redux slices and integration tests for key user flows
