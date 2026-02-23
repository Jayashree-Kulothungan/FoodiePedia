import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  apiGetReviews,
  apiSubmitReview,
  apiUpdateReview,
  apiDeleteReview,
  apiGetUserReviews,
} from '../../utils/api';
import { computeRatingStats } from '../../utils/mockData';
import { updateRestaurantStats } from './restaurantsSlice';

// ============================================
// THUNKS
// ============================================

export const fetchReviews = createAsyncThunk(
  'reviews/fetchByRestaurant',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const reviews = await apiGetReviews(restaurantId);
      return { restaurantId, reviews };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitReview = createAsyncThunk(
  'reviews/submit',
  async (data, { rejectWithValue, dispatch, getState }) => {
    try {
      const review = await apiSubmitReview(data);
      // Recompute stats and push to restaurants slice
      const state = getState();
      const allReviews = [
        ...Object.values(state.reviews.byRestaurant).flat(),
        review,
      ];
      const stats = computeRatingStats(data.restaurantId, allReviews);
      dispatch(updateRestaurantStats({ restaurantId: data.restaurantId, ...stats }));
      return review;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/update',
  async (data, { rejectWithValue }) => {
    try {
      return await apiUpdateReview(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async ({ reviewId, restaurantId }, { rejectWithValue }) => {
    try {
      await apiDeleteReview(reviewId);
      return { reviewId, restaurantId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async (userId, { rejectWithValue }) => {
    try {
      return await apiGetUserReviews(userId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ============================================
// SLICE
// ============================================

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    byRestaurant: {}, // { restaurantId: [...reviews] }
    userReviews: [],
    loading: false,
    submitting: false,
    error: null,
    submitError: null,
    submitSuccess: false,
  },
  reducers: {
    clearSubmitState(state) {
      state.submitError = null;
      state.submitSuccess = false;
    },
  },
  extraReducers: builder => {
    // FETCH BY RESTAURANT
    builder
      .addCase(fetchReviews.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.byRestaurant[action.payload.restaurantId] = action.payload.reviews;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // SUBMIT
    builder
      .addCase(submitReview.pending, state => { state.submitting = true; state.submitError = null; state.submitSuccess = false; })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.submitting = false;
        state.submitSuccess = true;
        const { restaurantId } = action.payload;
        if (!state.byRestaurant[restaurantId]) state.byRestaurant[restaurantId] = [];
        state.byRestaurant[restaurantId].unshift(action.payload);
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload;
      });

    // UPDATE
    builder.addCase(updateReview.fulfilled, (state, action) => {
      const { restaurantId, id } = action.payload;
      if (state.byRestaurant[restaurantId]) {
        const idx = state.byRestaurant[restaurantId].findIndex(r => r.id === id);
        if (idx !== -1) state.byRestaurant[restaurantId][idx] = action.payload;
      }
    });

    // DELETE
    builder.addCase(deleteReview.fulfilled, (state, action) => {
      const { reviewId, restaurantId } = action.payload;
      if (state.byRestaurant[restaurantId]) {
        state.byRestaurant[restaurantId] = state.byRestaurant[restaurantId].filter(r => r.id !== reviewId);
      }
      state.userReviews = state.userReviews.filter(r => r.id !== reviewId);
    });

    // USER REVIEWS
    builder
      .addCase(fetchUserReviews.pending, state => { state.loading = true; })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.userReviews = action.payload;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubmitState } = reviewsSlice.actions;

// ============================================
// SELECTORS
// ============================================

export const selectReviewsByRestaurant = (state, restaurantId) =>
  state.reviews.byRestaurant[restaurantId] || [];

export const selectUserReviews = state => state.reviews.userReviews;
export const selectReviewsLoading = state => state.reviews.loading;
export const selectReviewsSubmitting = state => state.reviews.submitting;
export const selectReviewsError = state => state.reviews.error;
export const selectSubmitError = state => state.reviews.submitError;
export const selectSubmitSuccess = state => state.reviews.submitSuccess;

export const selectUserHasReviewed = (state, restaurantId, userId) =>
  (state.reviews.byRestaurant[restaurantId] || []).some(r => r.userId === userId);

export default reviewsSlice.reducer;
