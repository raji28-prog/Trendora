import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice.js';
import Input from '../components/UI/Input.jsx';
import Select from '../components/UI/Select.jsx';
import Button from '../components/UI/Button.jsx';
import api from '../services/api.js';
import { Mail, Lock, User } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'BUSINESS_OWNER',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/api/auth/register', data);
      dispatch(addToast({ type: 'success', message: 'Account created! Please sign in.' }));
      navigate('/login');
    } catch (err) {
      if (!err.response) {
        // Fallback to Demo Mode simulation
        dispatch(addToast({ type: 'success', message: 'Demo Mode: Account simulated successfully! Please sign in.' }));
        navigate('/login');
        return;
      }
      const errMsg = err.response?.data?.error?.message || 'Registration failed. Please try again.';
      dispatch(addToast({ type: 'error', message: errMsg }));
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'BUSINESS_OWNER', label: 'Business Owner' },
    { value: 'USER', label: 'Marketing Team Member' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">Sign Up</h2>
        <p className="text-xs text-textSecondary">Create your Trendora account and start growing</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          type="text"
          icon={User}
          error={errors.name}
          {...register('name', { required: 'Name is required' })}
        />

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

        <Select
          label="I am a..."
          options={roleOptions}
          error={errors.role}
          {...register('role', { required: 'Role selection is required' })}
        />

        <Button type="submit" isLoading={loading} className="w-full mt-2">
          Create Account
        </Button>
      </form>

      <div className="text-center text-xs text-textSecondary mt-2">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
