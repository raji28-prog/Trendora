import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice.js';
import { addToast } from '../store/uiSlice.js';
import Input from '../components/UI/Input.jsx';
import Button from '../components/UI/Button.jsx';
import api from '../services/api.js';
import { Mail, Lock } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    dispatch(loginStart());
    try {
      const response = await api.post('/api/auth/login', data);
      const { user, accessToken } = response.data.data;

      dispatch(loginSuccess({ user, accessToken }));
      dispatch(addToast({ type: 'success', message: 'Logged in successfully' }));
      navigate('/');
    } catch (err) {
      if (!err.response) {
        // Fallback to Demo Mode if Backend is offline
        const mockUser = {
          id: 'demo-user-id',
          email: data.email,
          name: 'Demo Business User',
          role: 'ADMIN',
        };
        const mockToken = 'demo-jwt-token';
        dispatch(loginSuccess({ user: mockUser, accessToken: mockToken }));
        dispatch(addToast({ type: 'success', message: 'Demo Mode: Signed in successfully (Backend Offline)' }));
        navigate('/');
        return;
      }
      const errMsg = err.response?.data?.error?.message || 'Login failed. Please try again.';
      dispatch(loginFailure(errMsg));
      dispatch(addToast({ type: 'error', message: errMsg }));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">Sign In</h2>
        <p className="text-xs text-textSecondary">Enter your credentials to access your dashboard</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Email Address"
          placeholder="name@example.com"
          type="email"
          icon={Mail}
          error={errors.email}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
          })}
        />

        <Input
          label="Password"
          placeholder="••••••••"
          type="password"
          icon={Lock}
          error={errors.password}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />

        <div className="flex items-center justify-between mt-1">
          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-primary hover:underline transition-all"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" isLoading={loading} className="w-full mt-2">
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-textSecondary mt-2">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
