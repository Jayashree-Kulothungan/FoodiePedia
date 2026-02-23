// ============================================
// API SERVICE — Simulates REST API with delays
// ============================================

import { MOCK_RESTAURANTS, MOCK_REVIEWS, MOCK_USERS, computeRatingStats } from './mockData';

const delay = (ms = 400) => new Promise(res => setTimeout(res, ms + Math.random() * 200));

// Simulate a local DB in memory (persisted to sessionStorage)
function getDB() {
  try {
    const stored = sessionStorage.getItem('foodpedia_db');
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    restaurants: [...MOCK_RESTAURANTS],
    reviews: [...MOCK_REVIEWS],
    users: [...MOCK_USERS],
  };
}

function saveDB(db) {
  try {
    sessionStorage.setItem('foodpedia_db', JSON.stringify(db));
  } catch {}
}

// ============================================
// AUTH API
// ============================================

export async function apiLogin({ email, password }) {
  await delay(600);
  const db = getDB();
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password.');
  const { password: _p, ...safe } = user;
  return { user: safe, token: `token_${user.id}_${Date.now()}` };
}

export async function apiRegister({ name, email, password }) {
  await delay(700);
  const db = getDB();
  if (db.users.find(u => u.email === email)) {
    throw new Error('An account with this email already exists.');
  }
  const newUser = {
    id: `u${Date.now()}`,
    name,
    email,
    password,
    joinedDate: new Date().toISOString().split('T')[0],
  };
  db.users.push(newUser);
  saveDB(db);
  const { password: _p, ...safe } = newUser;
  return { user: safe, token: `token_${newUser.id}_${Date.now()}` };
}

// ============================================
// RESTAURANTS API
// ============================================

export async function apiGetRestaurants({ search = '', cuisine = '', sort = 'rating' } = {}) {
  await delay(500);
  const db = getDB();
  let list = [...db.restaurants];

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.neighborhood.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (cuisine && cuisine !== 'All') {
    list = list.filter(r => r.cuisine === cuisine);
  }

  // Attach live rating data
  list = list.map(r => ({
    ...r,
    ...computeRatingStats(r.id, db.reviews),
  }));

  if (sort === 'rating') list.sort((a, b) => b.avg - a.avg);
  else if (sort === 'reviews') list.sort((a, b) => b.count - a.count);
  else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

  return list;
}

export async function apiGetRestaurant(id) {
  await delay(400);
  const db = getDB();
  const restaurant = db.restaurants.find(r => r.id === id);
  if (!restaurant) throw new Error('Restaurant not found.');
  const stats = computeRatingStats(id, db.reviews);
  return { ...restaurant, ...stats };
}

// ============================================
// REVIEWS API
// ============================================

export async function apiGetReviews(restaurantId) {
  await delay(400);
  const db = getDB();
  const reviews = db.reviews
    .filter(r => r.restaurantId === restaurantId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  return reviews;
}

export async function apiSubmitReview({ restaurantId, userId, userName, rating, text, tags = [] }) {
  await delay(600);
  const db = getDB();

  // Check duplicate
  const existing = db.reviews.find(r => r.restaurantId === restaurantId && r.userId === userId);
  if (existing) throw new Error('You have already reviewed this restaurant.');

  const review = {
    id: `rv${Date.now()}`,
    restaurantId,
    userId,
    userName,
    rating,
    text,
    tags,
    date: new Date().toISOString().split('T')[0],
    helpful: 0,
  };
  db.reviews.push(review);
  saveDB(db);
  return review;
}

export async function apiUpdateReview({ reviewId, rating, text, tags = [] }) {
  await delay(500);
  const db = getDB();
  const idx = db.reviews.findIndex(r => r.id === reviewId);
  if (idx === -1) throw new Error('Review not found.');
  db.reviews[idx] = { ...db.reviews[idx], rating, text, tags };
  saveDB(db);
  return db.reviews[idx];
}

export async function apiDeleteReview(reviewId) {
  await delay(400);
  const db = getDB();
  db.reviews = db.reviews.filter(r => r.id !== reviewId);
  saveDB(db);
  return { success: true };
}

// ============================================
// STATS API
// ============================================

export async function apiGetStats() {
  await delay(500);
  const db = getDB();
  const reviews = db.reviews;
  const restaurants = db.restaurants;

  const totalReviews = reviews.length;
  const totalRestaurants = restaurants.length;
  const avgRating = reviews.length
    ? parseFloat((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(2))
    : 0;

  // Cuisine distribution
  const cuisineCount = {};
  restaurants.forEach(r => {
    cuisineCount[r.cuisine] = (cuisineCount[r.cuisine] || 0) + 1;
  });

  // Rating distribution
  const ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => { ratingDist[r.rating]++; });

  // Top restaurants by avg rating
  const topRestaurants = restaurants
    .map(r => ({ ...r, ...computeRatingStats(r.id, reviews) }))
    .filter(r => r.count > 0)
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5);

  // Reviews per cuisine
  const reviewsByCuisine = {};
  restaurants.forEach(r => {
    const rrs = reviews.filter(rv => rv.restaurantId === r.id);
    reviewsByCuisine[r.cuisine] = (reviewsByCuisine[r.cuisine] || 0) + rrs.length;
  });

  return {
    totalReviews,
    totalRestaurants,
    avgRating,
    cuisineCount,
    ratingDist,
    topRestaurants,
    reviewsByCuisine,
  };
}

export async function apiGetUserReviews(userId) {
  await delay(400);
  const db = getDB();
  return db.reviews
    .filter(r => r.userId === userId)
    .map(rv => {
      const restaurant = db.restaurants.find(r => r.id === rv.restaurantId);
      return { ...rv, restaurantName: restaurant?.name, restaurantEmoji: restaurant?.emoji };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}
