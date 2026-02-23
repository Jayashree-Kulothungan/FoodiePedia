import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRestaurantById,
  selectRestaurantById,
  selectDetailLoading,
  selectDetailError,
} from '../store/slices/restaurantsSlice';
import {
  fetchReviews,
  selectReviewsByRestaurant,
  selectReviewsLoading,
} from '../store/slices/reviewsSlice';
import RatingBreakdown from '../components/review/RatingBreakdown';
import ReviewForm from '../components/review/ReviewForm';
import ReviewCard from '../components/review/ReviewCard';
import { StarDisplay } from '../components/common/StarRating';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const restaurant = useSelector(state => selectRestaurantById(state, id));
  const loading = useSelector(selectDetailLoading);
  const error = useSelector(selectDetailError);
  const reviews = useSelector(state => selectReviewsByRestaurant(state, id));
  const reviewsLoading = useSelector(selectReviewsLoading);

  useEffect(() => {
    dispatch(fetchRestaurantById(id));
    dispatch(fetchReviews(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="loading-spinner" style={{ paddingTop: 100 }}>
        <div className="spinner" />
        <span>Loading restaurant…</span>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="page-container" style={{ paddingTop: 60 }}>
        <div className="error-box">⚠ {error || 'Restaurant not found.'}</div>
        <Link to="/restaurants" className="btn btn-primary mt-4">← Back to Restaurants</Link>
      </div>
    );
  }

  const { name, cuisine, priceRange, address, phone, hours, website, description, emoji, tags, neighborhood, openNow, avg, count, breakdown } = restaurant;

  return (
    <div>
      {/* ——— HERO ——— */}
      <div className="restaurant-hero">
        <div
          className="restaurant-hero-image"
          style={{
            background: `linear-gradient(135deg, #2d1a00 0%, #1a0a00 100%)`,
          }}
        >
          <span style={{ fontSize: '7rem', opacity: 0.4, userSelect: 'none' }}>{emoji}</span>
        </div>
        <div className="restaurant-hero-overlay">
          <div className="page-container">
            <div className="restaurant-hero-content fade-in">
              <div style={{ marginBottom: 12 }}>
                <Link
                  to="/restaurants"
                  style={{ color: 'rgba(253,246,236,0.5)', fontSize: '0.85rem' }}
                >
                  ← All Restaurants
                </Link>
              </div>
              <h1 className="restaurant-hero-title">{name}</h1>
              <div className="restaurant-hero-meta">
                <span className="badge badge-amber">{cuisine}</span>
                <span style={{ color: 'rgba(253,246,236,0.6)', fontSize: '0.9rem' }}>{priceRange}</span>
                {avg > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <StarDisplay rating={avg} size="sm" />
                    <span style={{ color: 'var(--cream)', fontWeight: 600 }}>{avg.toFixed(1)}</span>
                    <span style={{ color: 'rgba(253,246,236,0.5)', fontSize: '0.85rem' }}>({count} reviews)</span>
                  </div>
                )}
                <span
                  style={{
                    color: openNow ? '#7bc47a' : 'rgba(253,246,236,0.4)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  {openNow ? '● Open Now' : '● Closed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ——— DETAIL LAYOUT ——— */}
      <div className="page-container">
        <div className="restaurant-detail-layout">
          {/* Main column */}
          <div>
            {/* Description */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: 12 }}>About</h2>
              <p style={{ color: 'var(--stone)', lineHeight: 1.8, fontSize: '0.95rem' }}>{description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                {tags.map(tag => (
                  <span key={tag} className="badge badge-stone">{tag}</span>
                ))}
              </div>
            </div>

            {/* Review Form */}
            <ReviewForm restaurantId={id} />

            {/* Reviews */}
            <div className="reviews-section">
              <h2 style={{ fontSize: '1.4rem', marginBottom: 20 }}>
                Reviews
                {reviews.length > 0 && (
                  <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--stone)', marginLeft: 10 }}>
                    ({reviews.length})
                  </span>
                )}
              </h2>

              {reviewsLoading && (
                <div className="loading-spinner" style={{ padding: '32px 0' }}>
                  <div className="spinner" />
                  <span>Loading reviews…</span>
                </div>
              )}

              {!reviewsLoading && reviews.length === 0 && (
                <div className="empty-state" style={{ padding: '48px 0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>💬</div>
                  <h3>No reviews yet</h3>
                  <p>Be the first to share your experience!</p>
                </div>
              )}

              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            <RatingBreakdown avg={avg} count={count} breakdown={breakdown || {}} />

            <div className="info-card">
              <h3>Details</h3>
              <div className="info-row">
                <span className="info-row-icon">📍</span>
                <span className="info-row-text">{address}</span>
              </div>
              <div className="info-row">
                <span className="info-row-icon">🕐</span>
                <span className="info-row-text">{hours}</span>
              </div>
              <div className="info-row">
                <span className="info-row-icon">📞</span>
                <span className="info-row-text">{phone}</span>
              </div>
              {website && (
                <div className="info-row">
                  <span className="info-row-icon">🌐</span>
                  <a
                    href={`https://${website}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--amber)', fontSize: '0.9rem' }}
                  >
                    {website}
                  </a>
                </div>
              )}
              <div className="info-row">
                <span className="info-row-icon">🗺</span>
                <span className="info-row-text">{neighborhood}</span>
              </div>
            </div>

            <div className="info-card" style={{ background: 'var(--amber-pale)', border: '1px solid rgba(212,130,10,0.2)' }}>
              <h3>Price Range</h3>
              <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                {'$$$$$'.split('').map((s, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '1.2rem',
                      color: i < priceRange.length ? 'var(--amber)' : 'var(--stone-light)',
                    }}
                  >
                    $
                  </span>
                ))}
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--stone)' }}>
                {priceRange === '$' && 'Budget-friendly under $15'}
                {priceRange === '$$' && 'Moderate $15–35 per person'}
                {priceRange === '$$$' && 'Upscale $35–70 per person'}
                {priceRange === '$$$$' && 'Fine dining $70+ per person'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
