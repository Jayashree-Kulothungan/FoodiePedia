import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import restaurantsReducer from './slices/restaurantsSlice';
import reviewsReducer from './slices/reviewsSlice';
import statsReducer from './slices/statsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurants: restaurantsReducer,
    reviews: reviewsReducer,
    stats: statsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
