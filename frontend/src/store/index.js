import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import themeReducer from './themeSlice.js';
import uiReducer from './uiSlice.js';
import studioReducer from './studioSlice.js';
import businessReducer from './businessSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    ui: uiReducer,
    studio: studioReducer,
    business: businessReducer,
  },
});

export default store;
