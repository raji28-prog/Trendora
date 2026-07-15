import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice.js';
import Input from '../components/UI/Input.jsx';
import Button from '../components/UI/Button.jsx';
import { Mail, CheckCircle2 } from 'lucide-react';
import api from '../services/api.js';

export const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/forgot-password', data);
      setSubmitted(true);
      dispatch(addToast({ type: 'success', message: 'Password reset link generated!' }));
      if (response.data.data?.token) {
        dispatch(addToast({ type: 'info', message: `Dev Token: ${response.data.data.token}`, duration: 10000 }));
      }
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || 'An error occurred. Please try again.';
      dispatch(addToast({ type: 'error', message: errMsg }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
          {submitted ? 'Check Your Email' : 'Forgot Password?'}
        </h2>
        <p className="text-xs text-textSecondary leading-relaxed">
          {submitted
            ? 'If an account exists for that email, we sent a password reset link.'
            : 'Enter your email address to receive a password reset link'}
        </p>
      </div>

      {submitted ? (
        <div
          className="flex flex-col items-center gap-4 p-6 rounded-[16px] text-center"
          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          <p className="text-sm text-textSecondary">
            Check your inbox and follow the instructions to reset your password.
          </p>
        </div>
      ) : (
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
          <Button type="submit" isLoading={loading} className="w-full mt-1">
            Send Reset Link
          </Button>
        </form>
      )}

      <p className="text-center text-xs text-textSecondary">
        Remember your password?{' '}
        <Link
          to="/login"
          className="font-bold transition-colors"
          style={{ color: '#8B5CF6' }}
          onMouseEnter={(e) => e.target.style.color = '#A855F7'}
          onMouseLeave={(e) => e.target.style.color = '#8B5CF6'}
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
