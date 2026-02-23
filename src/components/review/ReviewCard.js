import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReview } from '../../store/slices/reviewsSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { StarDisplay } from '../common/StarRating';
import { useToast } from '../../hooks/useToast';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function ReviewCard({ review, showDelete = false }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector(selectCurrentUser);

  const isOwner = user?.id === review.userId;

  function handleDelete() {
    if (!window.confirm('Delete your review? This cannot be undone.')) return;
    dispatch(deleteReview({ reviewId: review.id, restaurantId: review.restaurantId }));
    toast('Review deleted.', 'info');
  }

  const initials = review.userName
    ? review.userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const avatarColors = ['#d4820a', '#c44b1e', '#4a6741', '#8c7b6b', '#1a0a00'];
  const colorIndex = review.userId
    ? review.userId.charCodeAt(review.userId.length - 1) % avatarColors.length
    : 0;

  return (
    <div className="review-card fade-in">
      <div className="review-header">
        <div
          className="review-avatar"
          style={{ background: avatarColors[colorIndex] }}
        >
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="review-author">{review.userName}</div>
              <div className="review-date">{formatDate(review.date)}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <StarDisplay rating={review.rating} size="sm" />
              {(showDelete || isOwner) && (
                <button
                  onClick={handleDelete}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--rust)', padding: '4px 8px', fontSize: '0.78rem' }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="review-text">{review.text}</p>

      {review.tags && review.tags.length > 0 && (
        <div className="review-tags">
          {review.tags.map(tag => (
            <span key={tag} className="badge badge-amber">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
