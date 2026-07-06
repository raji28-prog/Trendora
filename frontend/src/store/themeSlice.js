import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return 'system';
};

const applyTheme = (theme) => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: getInitialTheme(),
  },
  reducers: {
    setTheme(state, action) {
      const theme = action.payload;
      state.theme = theme;
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    },
    initializeTheme(state) {
      applyTheme(state.theme);
    },
  },
});

export const { setTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
export { applyTheme };
