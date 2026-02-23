import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetRestaurants, apiGetRestaurant } from '../../utils/api';

// ============================================
// THUNKS
// ============================================

export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await apiGetRestaurants(filters);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'restaurants/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      return await apiGetRestaurant(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ============================================
// SLICE — Normalized structure: byId + allIds
// ============================================

const restaurantsSlice = createSlice({
  name: 'restaurants',
  initialState: {
    byId: {},
    allIds: [],
    loading: false,
    error: null,
    filters: {
      search: '',
      cuisine: 'All',
      sort: 'rating',
    },
    currentId: null,
    detailLoading: false,
    detailError: null,
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = { search: '', cuisine: 'All', sort: 'rating' };
    },
    setCurrentId(state, action) {
      state.currentId = action.payload;
    },
    updateRestaurantStats(state, action) {
      const { restaurantId, avg, count, breakdown } = action.payload;
      if (state.byId[restaurantId]) {
        state.byId[restaurantId].avg = avg;
        state.byId[restaurantId].count = count;
        state.byId[restaurantId].breakdown = breakdown;
      }
    },
  },
  extraReducers: builder => {
    // FETCH ALL
    builder
      .addCase(fetchRestaurants.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        // Normalize
        const byId = {};
        const allIds = [];
        action.payload.forEach(r => {
          byId[r.id] = r;
          allIds.push(r.id);
        });
        state.byId = { ...state.byId, ...byId };
        state.allIds = allIds;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // FETCH ONE
    builder
      .addCase(fetchRestaurantById.pending, state => { state.detailLoading = true; state.detailError = null; })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.byId[action.payload.id] = action.payload;
        state.currentId = action.payload.id;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      });
  },
});

export const { setFilters, resetFilters, setCurrentId, updateRestaurantStats } = restaurantsSlice.actions;

// ============================================
// MEMOIZED SELECTORS
// ============================================

export const selectAllRestaurants = state =>
  state.restaurants.allIds.map(id => state.restaurants.byId[id]);

export const selectRestaurantById = (state, id) => state.restaurants.byId[id];

export const selectCurrentRestaurant = state =>
  state.restaurants.byId[state.restaurants.currentId];

export const selectRestaurantsLoading = state => state.restaurants.loading;
export const selectRestaurantsError = state => state.restaurants.error;
export const selectDetailLoading = state => state.restaurants.detailLoading;
export const selectDetailError = state => state.restaurants.detailError;
export const selectFilters = state => state.restaurants.filters;

// Derive unique cuisines from loaded restaurants
export const selectCuisines = state => {
  const cuisines = new Set(['All']);
  Object.values(state.restaurants.byId).forEach(r => cuisines.add(r.cuisine));
  return Array.from(cuisines);
};

export default restaurantsSlice.reducer;
