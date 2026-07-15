import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import store from './store/index.js';
import router from './routes/index.jsx';
import { initializeTheme } from './store/themeSlice.js';
import AnimatedBackground from './components/UI/AnimatedBackground.jsx';
import './index.css';

// Boot theme
store.dispatch(initializeTheme());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AnimatedBackground lives OUTSIDE the router so it persists across all routes */}
    <AnimatedBackground />
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
