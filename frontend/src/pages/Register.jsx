import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice.js';
import Input from '../components/UI/Input.jsx';
import Select from '../components/UI/Select.jsx';
import Button from '../components/UI/Button.jsx';
import api from '../services/api.js';
import { Mail, Lock, User, Sparkles } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '', role: 'BUSINESS_OWNER' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/api/auth/register', data);
      dispatch(addToast({ type: 'success', message: 'Account created! Please sign in.' }));
      navigate('/login');
    } catch (err) {
      const errMsg =
        !err.response
          ? 'Cannot connect to the server. Please ensure the backend is running.'
          : err.response?.data?.error?.message || 'Registration failed. Please try again.';
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
      <div className="flex flex-col gap-2 text-center">
        <div
          className="inline-flex items-center gap-1.5 self-center px-3 py-1 rounded-full mb-1 text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#A855F7' }}
        >
          <Sparkles className="w-3 h-3" /> Join Trendora
        </div>
        <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
          Create Account
        </h2>
        <p className="text-xs text-textSecondary">Start growing your business with AI marketing</p>
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
            minLength: { value: 6, message: 'At least 6 characters' },
          })}
        />
        <Select
          label="I am a..."
          options={roleOptions}
          error={errors.role}
          {...register('role', { required: 'Role selection is required' })}
        />
        <Button type="submit" isLoading={loading} className="w-full mt-1">
          Create Account
        </Button>
      </form>

      <div className="relative flex items-center gap-3 my-1">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <span className="text-[10px] text-textSecondary font-bold uppercase tracking-widest">or</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
      </div>

      <p className="text-center text-xs text-textSecondary">
        Already have an account?{' '}
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

export default Register;
