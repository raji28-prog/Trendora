import { createSlice } from '@reduxjs/toolkit';

const DEVELOPMENT_MODE = false; // Set to false to restore original authentication

const mockUser = {
  id: 'mock-admin-id-123456789012',
  email: 'admin@trendora.com',
  firstName: 'Trendora',
  lastName: 'Admin',
  role: 'ADMIN',
  status: 'ACTIVE',
  emailVerified: true,
  hasBusiness: true
};

const initialState = DEVELOPMENT_MODE ? {
  user: mockUser,
  accessToken: 'mock-access-token',
  isAuthenticated: true,
  loading: false,
  error: null,
} : {
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('accessToken');
    },
    getMeStart(state) {
      state.loading = true;
      state.error = null;
    },
    getMeSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
    getMeFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem('accessToken');
    },
    // Called for transient errors (network down / 503) — keeps the session alive
    getMeTransientError(state, action) {
      state.loading = false;
      state.error = action.payload;
      // isAuthenticated, accessToken and user are intentionally left unchanged
    },
    updateProfileStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.error = null;
    },
    updateProfileFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload);
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  getMeStart,
  getMeSuccess,
  getMeFailure,
  getMeTransientError,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  updateUser,
  setAccessToken,
} = authSlice.actions;

export default authSlice.reducer;
