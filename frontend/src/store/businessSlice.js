import { createSlice } from '@reduxjs/toolkit';

const persistedId = localStorage.getItem('selectedBusinessId') || null;

const initialState = {
  businesses: [],
  selectedBusinessId: persistedId,
  loading: false,
  error: null,
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setBusinessesLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setBusinesses(state, action) {
      state.loading = false;
      state.businesses = action.payload;
    },
    setBusinessesError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedBusiness(state, action) {
      state.selectedBusinessId = action.payload;
      if (action.payload) {
        localStorage.setItem('selectedBusinessId', action.payload);
      } else {
        localStorage.removeItem('selectedBusinessId');
      }
    },
    clearSelectedBusiness(state) {
      state.selectedBusinessId = null;
      localStorage.removeItem('selectedBusinessId');
    },
  },
});

export const {
  setBusinessesLoading,
  setBusinesses,
  setBusinessesError,
  setSelectedBusiness,
  clearSelectedBusiness,
} = businessSlice.actions;

// Selectors
export const selectBusinesses = (state) => state.business.businesses;
export const selectSelectedBusinessId = (state) => state.business.selectedBusinessId;
export const selectSelectedBusiness = (state) => {
  const { businesses, selectedBusinessId } = state.business;
  return businesses.find((b) => b.id === selectedBusinessId) || null;
};
export const selectBusinessLoading = (state) => state.business.loading;

export default businessSlice.reducer;
