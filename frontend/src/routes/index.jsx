import React, { Suspense, useEffect } from 'react';
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../components/UI/Spinner.jsx';
import api from '../services/api.js';
import { getMeStart, getMeSuccess, getMeFailure } from '../store/authSlice.js';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated && !user && !loading) {
        dispatch(getMeStart());
        try {
          const response = await api.get('/api/auth/me');
          dispatch(getMeSuccess({ user: response.data.data.user }));
        } catch (err) {
          if (!err.response) {
            // Simulated local session for demo when server is offline
            dispatch(getMeSuccess({
              user: {
                id: 'demo-user-id',
                email: 'demo@trendora.com',
                name: 'Demo Business User',
                role: 'ADMIN'
              }
            }));
            return;
          }
          dispatch(getMeFailure(err.response?.data?.error?.message || 'Session expired'));
        }
      }
    };
    fetchUser();
  }, [isAuthenticated, user, loading, dispatch]);

  if (loading || (isAuthenticated && !user)) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

import DashboardLayout from '../layouts/DashboardLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
const Dashboard = React.lazy(() => import('../pages/Dashboard.jsx'));
const Businesses = React.lazy(() => import('../pages/Businesses.jsx'));
const Ads = React.lazy(() => import('../pages/Ads.jsx'));
const Posters = React.lazy(() => import('../pages/Posters.jsx'));
const Campaigns = React.lazy(() => import('../pages/Campaigns.jsx'));
const Analytics = React.lazy(() => import('../pages/Analytics.jsx'));
const Leads = React.lazy(() => import('../pages/Leads.jsx'));
const Reviews = React.lazy(() => import('../pages/Reviews.jsx'));
const Login = React.lazy(() => import('../pages/Login.jsx'));
const Register = React.lazy(() => import('../pages/Register.jsx'));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword.jsx'));
const ResetPassword = React.lazy(() => import('../pages/ResetPassword.jsx'));
const Profile = React.lazy(() => import('../pages/Profile.jsx'));
const Settings = React.lazy(() => import('../pages/Settings.jsx'));
const NotFound = React.lazy(() => import('../pages/NotFound.jsx'));
// Phase 4 & 5 Pages
const Services = React.lazy(() => import('../pages/Services.jsx'));
const BusinessProfile = React.lazy(() => import('../pages/BusinessProfile.jsx'));
const Scheduler = React.lazy(() => import('../pages/Scheduler.jsx'));
const Gbp = React.lazy(() => import('../pages/Gbp.jsx'));
const Seo = React.lazy(() => import('../pages/Seo.jsx'));
const AiGenerator = React.lazy(() => import('../pages/AiGenerator.jsx'));
const Team = React.lazy(() => import('../pages/Team.jsx'));
const Billing = React.lazy(() => import('../pages/Billing.jsx'));

const Suspended = ({ children }) => (
  <Suspense
    fallback={
      <div className="h-full w-full flex items-center justify-center p-8 bg-background">
        <Spinner size="md" />
      </div>
    }
  >
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          {
            path: '/',
            element: <Suspended><Dashboard /></Suspended>,
          },
          {
            path: '/businesses',
            element: <Suspended><Businesses /></Suspended>,
          },
          {
            path: '/ads',
            element: <Suspended><Ads /></Suspended>,
          },
          {
            path: '/posters',
            element: <Suspended><Posters /></Suspended>,
          },
          {
            path: '/campaigns',
            element: <Suspended><Campaigns /></Suspended>,
          },
          {
            path: '/analytics',
            element: <Suspended><Analytics /></Suspended>,
          },
          {
            path: '/leads',
            element: <Suspended><Leads /></Suspended>,
          },
          {
            path: '/reviews',
            element: <Suspended><Reviews /></Suspended>,
          },
          {
            path: '/profile',
            element: <Suspended><Profile /></Suspended>,
          },
          {
            path: '/settings',
            element: <Suspended><Settings /></Suspended>,
          },
          // Phase 4 — Services
          {
            path: '/services',
            element: <Suspended><Services /></Suspended>,
          },
          // Phase 5 — Advanced Modules
          {
            path: '/business-profile',
            element: <Suspended><BusinessProfile /></Suspended>,
          },
          {
            path: '/scheduler',
            element: <Suspended><Scheduler /></Suspended>,
          },
          {
            path: '/gbp',
            element: <Suspended><Gbp /></Suspended>,
          },
          {
            path: '/seo',
            element: <Suspended><Seo /></Suspended>,
          },
          {
            path: '/ai-generator',
            element: <Suspended><AiGenerator /></Suspended>,
          },
          {
            path: '/team',
            element: <Suspended><Team /></Suspended>,
          },
          {
            path: '/billing',
            element: <Suspended><Billing /></Suspended>,
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <PublicRoute />,
    children: [
      {
        path: '/',
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: <Suspended><Login /></Suspended>,
          },
          {
            path: '/register',
            element: <Suspended><Register /></Suspended>,
          },
          {
            path: '/forgot-password',
            element: <Suspended><ForgotPassword /></Suspended>,
          },
          {
            path: '/reset-password',
            element: <Suspended><ResetPassword /></Suspended>,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Suspended><NotFound /></Suspended>,
  },
]);

export default router;
