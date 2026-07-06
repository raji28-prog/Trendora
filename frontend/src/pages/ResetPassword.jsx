import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice.js';
import Input from '../components/UI/Input.jsx';
import Button from '../components/UI/Button.jsx';
import { Lock } from 'lucide-react';
import api from '../services/api.js';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const token = searchParams.get('token') || '';

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (!token) {
      dispatch(addToast({ type: 'error', message: 'Invalid or missing reset token.' }));
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/auth/reset-password', { token, newPassword: data.password });
      dispatch(addToast({ type: 'success', message: 'Password updated successfully! Please sign in.' }));
      navigate('/login');
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || 'An error occurred. Please try again.';
      dispatch(addToast({ type: 'error', message: errMsg }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">Reset Password</h2>
        <p className="text-xs text-textSecondary">Enter your new secure password below</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="New Password"
          placeholder="••••••••"
          type="password"
          icon={Lock}
          error={errors.password}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />

        <Button type="submit" isLoading={loading} className="w-full mt-2">
          Update Password
        </Button>
      </form>

      <div className="text-center text-xs text-textSecondary">
        Return to{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
