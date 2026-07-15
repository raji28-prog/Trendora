import React, { Suspense, useEffect } from 'react';
import { Navigate, Outlet, createBrowserRouter, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../components/UI/Spinner.jsx';
import api from '../services/api.js';
import { getMeStart, getMeSuccess, getMeFailure, getMeTransientError } from '../store/authSlice.js';

const DEVELOPMENT_MODE = false; // Set to false to restore original authentication

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  if (DEVELOPMENT_MODE) {
    return <Outlet />;
  }

  const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated && !user && !loading) {
        dispatch(getMeStart());
        try {
          const response = await api.get('/api/auth/me');
          dispatch(getMeSuccess({ user: response.data.data.user }));
        } catch (err) {
          const status = err.response?.status;
          if (!err.response || status === 503) {
            dispatch(getMeTransientError(
              err.response?.data?.error?.message || 'Service temporarily unavailable. Please wait and refresh.'
            ));
            return;
          }
          dispatch(getMeFailure(err.response?.data?.error?.message || 'Session expired'));
        }
      }
    };
    fetchUser();
  }, [isAuthenticated, user, loading, dispatch]);

  if (loading || (isAuthenticated && !user && !error)) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user) {
    if (!user.hasBusiness) {
      if (location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
      }
    } else {
      if (location.pathname === '/onboarding') {
        return <Navigate to="/" replace />;
      }
    }
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated || DEVELOPMENT_MODE) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

import DashboardLayout from '../layouts/DashboardLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
const Dashboard = React.lazy(() => import('../pages/Dashboard.jsx'));
const Businesses = React.lazy(() => import('../pages/Businesses.jsx'));
const AdsCampaigns = React.lazy(() => import('../pages/AdsCampaigns.jsx'));
const Posters = React.lazy(() => import('../pages/Posters.jsx'));
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
// Phase 5 — Advanced Modules
const BusinessProfile = React.lazy(() => import('../pages/BusinessProfile.jsx'));
const Scheduler = React.lazy(() => import('../pages/Scheduler.jsx'));
const Gbp = React.lazy(() => import('../pages/Gbp.jsx'));
const Seo = React.lazy(() => import('../pages/Seo.jsx'));
const AiGenerator = React.lazy(() => import('../pages/AiGenerator.jsx'));
const Team = React.lazy(() => import('../pages/Team.jsx'));
const Billing = React.lazy(() => import('../pages/Billing.jsx'));
const SocialAccounts = React.lazy(() => import('../pages/SocialAccounts.jsx'));
const InstagramAnalytics = React.lazy(() => import('../pages/InstagramAnalytics.jsx'));

// Marketing Design Studio
const MarketingStudio = React.lazy(() => import('../pages/MarketingStudio.jsx'));
const StudioEditor = React.lazy(() => import('../pages/StudioEditor.jsx'));
const OnboardingWizard = React.lazy(() => import('../pages/OnboardingWizard.jsx'));

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
        path: '/onboarding',
        element: <Suspended><OnboardingWizard /></Suspended>,
      },
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
          // Legacy redirects — /ads and /campaigns both point to the merged module
          {
            path: '/ads',
            element: <Navigate to="/ads-campaigns" replace />,
          },
          {
            path: '/campaigns',
            element: <Navigate to="/ads-campaigns" replace />,
          },
          {
            path: '/ads-campaigns',
            element: <Suspended><AdsCampaigns /></Suspended>,
          },
          {
            path: '/posters',
            element: <Suspended><Posters /></Suspended>,
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
          // Services route removed — redirect to businesses
          {
            path: '/services',
            element: <Navigate to="/businesses" replace />,
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
          {
            path: '/social-accounts',
            element: <Suspended><SocialAccounts /></Suspended>,
          },
          {
            path: '/instagram-analytics',
            element: <Suspended><InstagramAnalytics /></Suspended>,
          },
          {
            path: '/marketing-studio',
            element: <Suspended><MarketingStudio /></Suspended>,
          },
        ],
      },
      {
        path: '/marketing-studio/editor/:id',
        element: <Suspended><StudioEditor /></Suspended>,
      },
    ],
  },
  {
    path: '/',
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <Suspended><Login /></Suspended>,
      },
      {
        path: '/',
        element: <AuthLayout />,
        children: [
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
