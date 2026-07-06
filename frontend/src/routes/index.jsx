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

const DashboardLayout = React.lazy(() => import('../layouts/DashboardLayout.jsx'));
const AuthLayout = React.lazy(() => import('../layouts/AuthLayout.jsx'));
const Dashboard = React.lazy(() => import('../pages/Dashboard.jsx'));
const Login = React.lazy(() => import('../pages/Login.jsx'));
const Register = React.lazy(() => import('../pages/Register.jsx'));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword.jsx'));
const ResetPassword = React.lazy(() => import('../pages/ResetPassword.jsx'));
const Profile = React.lazy(() => import('../pages/Profile.jsx'));
const Settings = React.lazy(() => import('../pages/Settings.jsx'));
const NotFound = React.lazy(() => import('../pages/NotFound.jsx'));

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
            path: '/profile',
            element: <Suspended><Profile /></Suspended>,
          },
          {
            path: '/settings',
            element: <Suspended><Settings /></Suspended>,
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
