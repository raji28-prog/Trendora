import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice.js';
import Input from '../components/UI/Input.jsx';
import Button from '../components/UI/Button.jsx';
import { Mail } from 'lucide-react';

export const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      dispatch(addToast({ type: 'success', message: 'Password reset link sent to your email.' }));
    } catch (err) {
      dispatch(addToast({ type: 'error', message: 'An error occurred. Please try again.' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center lg:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">Forgot Password</h2>
        <p className="text-xs text-textSecondary">
          {submitted
            ? 'Check your inbox for a link to reset your password'
            : 'Enter your email address to receive a password reset link'}
        </p>
      </div>

      {!submitted ? (
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

          <Button type="submit" isLoading={loading} className="w-full mt-2">
            Send Reset Link
          </Button>
        </form>
      ) : (
        <div className="text-center p-4 bg-background/50 border border-border rounded-lg text-xs text-textSecondary">
          If an account exists for that email, we sent a password reset link.
        </div>
      )}

      <div className="text-center text-xs text-textSecondary">
        Remember your password?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
