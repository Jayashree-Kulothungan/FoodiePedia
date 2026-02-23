import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetStats } from '../../utils/api';

export const fetchStats = createAsyncThunk(
  'stats/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await apiGetStats();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStats.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectStats = state => state.stats.data;
export const selectStatsLoading = state => state.stats.loading;
export const selectStatsError = state => state.stats.error;

export default statsSlice.reducer;
