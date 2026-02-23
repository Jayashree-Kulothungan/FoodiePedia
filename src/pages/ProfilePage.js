import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice';
import { fetchUserReviews, selectUserReviews, selectReviewsLoading } from '../store/slices/reviewsSlice';
import { StarDisplay } from '../components/common/StarRating';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const userReviews = useSelector(selectUserReviews);
  const loading = useSelector(selectReviewsLoading);

  useEffect(() => {
    if (user?.id) dispatch(fetchUserReviews(user.id));
  }, [dispatch, user?.id]);

  if (!user) return null;

  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const avgRating = userReviews.length
    ? (userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length).toFixed(1)
    : null;

  return (
    <div>
      {/* ——— PROFILE HERO ——— */}
      <div className="profile-header">
        <div className="page-container">
          <div className="profile-avatar-lg">{initials}</div>
          <div className="profile-name">{user.name}</div>
          <div style={{ color: 'rgba(253,246,236,0.5)', fontSize: '0.88rem', marginTop: 6 }}>
            {user.email} · Member since {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-number">{userReviews.length}</div>
              <div className="profile-stat-label">Reviews</div>
            </div>
            {avgRating && (
              <div className="profile-stat">
                <div className="profile-stat-number">{avgRating}</div>
                <div className="profile-stat-label">Avg Rating</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ——— REVIEWS ——— */}
      <div className="page-container section">
        <h2 style={{ fontSize: '1.5rem', marginBottom: 24 }}>My Reviews</h2>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner" />
            <span>Loading your reviews…</span>
          </div>
        )}

        {!loading && userReviews.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>✍️</div>
            <h3>No reviews yet</h3>
            <p>Start exploring restaurants and sharing your experiences!</p>
            <Link to="/restaurants" className="btn btn-primary mt-4" style={{ marginTop: 20 }}>
              Explore Restaurants
            </Link>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {userReviews.map(review => (
            <div key={review.id} className="review-card fade-in">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <Link
                  to={`/restaurants/${review.restaurantId}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink)' }}
                >
                  <span style={{ fontSize: '1.8rem' }}>{review.restaurantEmoji}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{review.restaurantName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--stone)' }}>{formatDate(review.date)}</div>
                  </div>
                </Link>
                <StarDisplay rating={review.rating} size="sm" />
              </div>

              <p style={{ color: 'var(--stone)', fontSize: '0.93rem', lineHeight: 1.7 }}>{review.text}</p>

              {review.tags && review.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  {review.tags.map(tag => (
                    <span key={tag} className="badge badge-amber">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
