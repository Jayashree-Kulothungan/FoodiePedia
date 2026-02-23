import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  submitReview,
  selectReviewsSubmitting,
  selectSubmitError,
  selectSubmitSuccess,
  clearSubmitState,
  selectUserHasReviewed,
} from '../../store/slices/reviewsSlice';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/slices/authSlice';
import { StarPicker } from '../common/StarRating';
import { useToast } from '../../hooks/useToast';

const QUICK_TAGS = ['Amazing Food', 'Great Service', 'Good Value', 'Romantic', 'Family Friendly', 'Quick Eats', 'Late Night', 'Cozy', 'Noisy', 'Pricey'];

export default function ReviewForm({ restaurantId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const user = useSelector(selectCurrentUser);
  const isAuth = useSelector(selectIsAuthenticated);
  const submitting = useSelector(selectReviewsSubmitting);
  const submitError = useSelector(selectSubmitError);
  const submitSuccess = useSelector(selectSubmitSuccess);
  const hasReviewed = useSelector(state => selectUserHasReviewed(state, restaurantId, user?.id));

  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (submitSuccess) {
      toast('Your review has been submitted!', 'success');
      setRating(0);
      setText('');
      setSelectedTags([]);
      dispatch(clearSubmitState());
    }
  }, [submitSuccess, dispatch, toast]);

  useEffect(() => {
    return () => dispatch(clearSubmitState());
  }, [dispatch]);

  if (!isAuth) {
    return (
      <div className="review-form-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: 12 }}>✍️</div>
        <h3 style={{ marginBottom: 8 }}>Share your experience</h3>
        <p style={{ color: 'var(--stone)', fontSize: '0.9rem', marginBottom: 20 }}>
          Sign in to write a review for this restaurant.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Sign in to review
        </button>
      </div>
    );
  }

  if (hasReviewed) {
    return (
      <div className="review-form-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: 12 }}>✅</div>
        <h3>You've already reviewed this restaurant</h3>
        <p style={{ color: 'var(--stone)', fontSize: '0.9rem', marginTop: 8 }}>
          Check your profile to edit or delete your review.
        </p>
      </div>
    );
  }

  function validate() {
    const e = {};
    if (rating === 0) e.rating = 'Please select a rating.';
    if (!text.trim() || text.trim().length < 20) e.text = 'Review must be at least 20 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    dispatch(submitReview({
      restaurantId,
      userId: user.id,
      userName: user.name,
      rating,
      text: text.trim(),
      tags: selectedTags,
    }));
  }

  function toggleTag(tag) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  return (
    <div className="review-form-card">
      <h3>✍️ Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <StarPicker value={rating} onChange={val => { setRating(val); setErrors(e => ({ ...e, rating: '' })); }} />
          {errors.rating && <div className="form-error">{errors.rating}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Your Experience</label>
          <textarea
            className={`form-input form-textarea${errors.text ? ' error' : ''}`}
            placeholder="Tell others about the food, service, atmosphere... (min 20 chars)"
            value={text}
            onChange={e => { setText(e.target.value); setErrors(err => ({ ...err, text: '' })); }}
            rows={4}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {errors.text ? (
              <div className="form-error">{errors.text}</div>
            ) : (
              <div />
            )}
            <span style={{ fontSize: '0.78rem', color: 'var(--stone)' }}>{text.length} chars</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Quick Tags (optional)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {QUICK_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`filter-chip${selectedTags.includes(tag) ? ' active' : ''}`}
                style={{ fontSize: '0.78rem', padding: '5px 12px' }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {submitError && <div className="error-box mb-3">{submitError}</div>}

        <button
          type="submit"
          className="btn btn-amber w-full"
          disabled={submitting}
        >
          {submitting ? (
            <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Publishing…</>
          ) : (
            'Publish Review'
          )}
        </button>
      </form>
    </div>
  );
}
