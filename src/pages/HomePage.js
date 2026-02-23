import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants, selectAllRestaurants, selectRestaurantsLoading } from '../store/slices/restaurantsSlice';
import RestaurantCard from '../components/restaurant/RestaurantCard';

const CUISINE_HIGHLIGHTS = [
  { name: 'Italian', emoji: '🍝' },
  { name: 'Japanese', emoji: '🍜' },
  { name: 'French', emoji: '🥐' },
  { name: 'Mexican', emoji: '🌮' },
  { name: 'Indian', emoji: '🍛' },
  { name: 'BBQ', emoji: '🥩' },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const restaurants = useSelector(selectAllRestaurants);
  const loading = useSelector(selectRestaurantsLoading);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const featured = restaurants.filter(r => r.featured).slice(0, 4);
  const topRated = [...restaurants].sort((a, b) => (b.avg || 0) - (a.avg || 0)).slice(0, 3);

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/restaurants');
    }
  }

  return (
    <div>
      {/* ——— HERO ——— */}
      <section className="hero">
        <div className="hero-bg-pattern" />
        <div className="page-container">
          <div className="hero-content">
            <div className="hero-eyebrow">🍴 Restaurant Discovery Platform</div>
            <h1>
              Find your next<br />
              <em>perfect meal</em>
            </h1>
            <p className="hero-subtitle">
              Discover, rate, and review the best restaurants in your city.
              Real reviews from real food lovers.
            </p>

            <form className="hero-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search cuisine, restaurant, neighborhood…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">{restaurants.length || '8'}+</span>
                <span className="hero-stat-label">Restaurants</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">50+</span>
                <span className="hero-stat-label">Reviews</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">6</span>
                <span className="hero-stat-label">Cuisines</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— CUISINE QUICK LINKS ——— */}
      <section style={{ background: 'white', padding: '28px 0', borderBottom: '1px solid var(--stone-pale)' }}>
        <div className="page-container">
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {CUISINE_HIGHLIGHTS.map(c => (
              <Link
                key={c.name}
                to={`/restaurants?cuisine=${c.name}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--stone-pale)',
                  minWidth: 80,
                  transition: 'all var(--transition)',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--amber-pale)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--stone-pale)'; e.currentTarget.style.transform = ''; }}
              >
                <span style={{ fontSize: '1.8rem' }}>{c.emoji}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--stone)', whiteSpace: 'nowrap' }}>{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ——— FEATURED ——— */}
      <section className="section">
        <div className="page-container">
          <div className="section-header">
            <div>
              <h2 className="section-title">✦ Featured Restaurants</h2>
              <p className="section-subtitle">Hand-picked by our editorial team</p>
            </div>
            <Link to="/restaurants" className="btn btn-outline btn-sm">View all</Link>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner" />
              <span>Loading restaurants…</span>
            </div>
          ) : (
            <div className="restaurant-grid">
              {featured.map((r, i) => (
                <div key={r.id} style={{ animationDelay: `${i * 0.1}s` }}>
                  <RestaurantCard restaurant={r} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ——— TOP RATED ——— */}
      {topRated.length > 0 && (
        <section className="section" style={{ background: 'var(--stone-pale)', paddingTop: 48, paddingBottom: 64 }}>
          <div className="page-container">
            <div className="section-header">
              <div>
                <h2 className="section-title">⭐ Top Rated</h2>
                <p className="section-subtitle">Highest-rated by the community</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {topRated.map(r => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——— CTA ——— */}
      <section className="section" style={{ background: 'var(--ink)', textAlign: 'center' }}>
        <div className="page-container">
          <h2 style={{ fontSize: '2.2rem', color: 'var(--cream)', marginBottom: 16 }}>
            Share your experience
          </h2>
          <p style={{ color: 'rgba(253,246,236,0.6)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            Your reviews help other food lovers discover amazing places. Join the Foodpedia community.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <Link to="/restaurants" className="btn btn-amber btn-lg">Explore Restaurants</Link>
            <Link to="/register" className="btn btn-outline btn-lg" style={{ color: 'var(--cream)', borderColor: 'rgba(253,246,236,0.3)' }}>
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
