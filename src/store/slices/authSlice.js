import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiLogin, apiRegister } from '../../utils/api';

// Persist auth to localStorage
const STORAGE_KEY = 'foodpedia_auth';

function loadAuth() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { user: null, token: null };
}

function saveAuth(user, token) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
  } catch {}
}

function clearAuth() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// ============================================
// THUNKS
// ============================================

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await apiLogin(credentials);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      return await apiRegister(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ============================================
// SLICE
// ============================================

const saved = loadAuth();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: saved.user,
    token: saved.token,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      clearAuth();
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // LOGIN
    builder
      .addCase(loginUser.pending, state => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        saveAuth(action.payload.user, action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // REGISTER
    builder
      .addCase(registerUser.pending, state => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        saveAuth(action.payload.user, action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

// ============================================
// SELECTORS
// ============================================

export const selectCurrentUser = state => state.auth.user;
export const selectIsAuthenticated = state => !!state.auth.token;
export const selectAuthLoading = state => state.auth.loading;
export const selectAuthError = state => state.auth.error;

export default authSlice.reducer;
