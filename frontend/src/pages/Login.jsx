import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice.js';
import { addToast } from '../store/uiSlice.js';
import Input from '../components/UI/Input.jsx';
import Button from '../components/UI/Button.jsx';
import PremiumBackground from '../components/UI/PremiumBackground.jsx';
import ToastContainer from '../components/UI/Toast.jsx';
import api from '../services/api.js';
import { User, Lock, Sparkles } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [success, setSuccess] = useState(false);

  // Load remembered User ID
  const rememberedUserId = localStorage.getItem('rememberedUserId') || '';

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: rememberedUserId,
      password: '',
      rememberMe: !!rememberedUserId
    },
  });

  const onSubmit = async (data) => {
    dispatch(loginStart());
    try {
      const response = await api.post('/api/auth/login', {
        email: data.email,
        password: data.password
      });

      const { user, accessToken } = response.data.data;
      
      // Remember me logic
      if (data.rememberMe) {
        localStorage.setItem('rememberedUserId', data.email);
      } else {
        localStorage.removeItem('rememberedUserId');
      }

      dispatch(loginSuccess({ user, accessToken }));
      dispatch(addToast({ type: 'success', message: 'Logged in successfully' }));
      
      // Success transition
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      const errMsg =
        !err.response
          ? 'Cannot connect to the server. Please ensure the backend is running.'
          : err.response?.data?.error?.message || 'Login failed. Please try again.';
      dispatch(loginFailure(errMsg));
      dispatch(addToast({ type: 'error', message: errMsg }));
    }
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center bg-[#09090B] overflow-hidden select-none">
      {/* Premium Animated Background */}
      <PremiumBackground />

      {/* Login Card Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md px-4 relative z-10"
      >
        <div
          className="rounded-[28px] p-8 md:p-10 relative overflow-hidden"
          style={{
            background: 'rgba(15, 15, 23, 0.65)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 32px 64px -16px rgba(0,0,0,0.85), 0 0 0 1px rgba(124,58,237,0.06)',
          }}
        >
          {/* Neon Border Glow Lines */}
          <div
            className="absolute top-0 left-0 right-0 h-[1.5px]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.6) 35%, rgba(168,85,247,0.6) 65%, transparent 100%)',
            }}
          />
          
          {/* Top Loading Progress Line */}
          {loading && (
            <div className="absolute top-0 left-0 right-0 h-[2.5px] overflow-hidden rounded-t-[28px]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#7C3AED]"
                initial={{ x: '-100%', width: '100%', position: 'absolute' }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="login-content"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
              >
                {/* Header */}
                <div className="flex flex-col gap-2 text-center">
                  <div
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center relative overflow-hidden self-center mb-2"
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                      boxShadow: '0 0 24px rgba(124,58,237,0.45)',
                    }}
                  >
                    <span className="text-white font-black text-2xl leading-none z-10">T</span>
                  </div>
                  
                  <div
                    className="inline-flex items-center gap-1.5 self-center px-3 py-1 rounded-full mb-1 text-[9px] font-extrabold uppercase tracking-[0.16em]"
                    style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#A855F7' }}
                  >
                    <Sparkles className="w-3 h-3 text-[#A855F7]" /> Trendora Enterprise
                  </div>
                  
                  <h2 className="text-2xl font-black text-white leading-tight tracking-tight">
                    Welcome Back
                  </h2>
                  <p className="text-xs text-textSecondary leading-relaxed max-w-[280px] self-center">
                    Sign in to access the Enterprise Marketing Platform.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4.5">
                  <Input
                    label="User ID"
                    placeholder="Enter your User ID"
                    type="text"
                    icon={User}
                    error={errors.email}
                    {...register('email', {
                      required: 'User ID is required',
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

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-1 px-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-textSecondary hover:text-white transition-colors duration-150">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-white/10 bg-white/[0.04] text-[#7C3AED] focus:ring-[#7C3AED]/30 transition-all cursor-pointer"
                        style={{ accentColor: '#7C3AED' }}
                        {...register('rememberMe')}
                      />
                      Remember me
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold transition-colors"
                      style={{ color: '#8B5CF6' }}
                      onMouseEnter={(e) => e.target.style.color = '#A855F7'}
                      onMouseLeave={(e) => e.target.style.color = '#8B5CF6'}
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <Button type="submit" isLoading={loading} className="w-full mt-2 py-3 text-sm">
                    Login
                  </Button>
                </form>

                {/* Footer divider and info */}
                <div className="relative flex items-center gap-3 py-1">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <span className="text-[9px] text-textSecondary/50 font-bold uppercase tracking-widest">Enterprise Access</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                </div>

                <p className="text-center text-xs text-textSecondary">
                  Need to setup local credentials?{' '}
                  <Link
                    to="/register"
                    className="font-bold transition-colors"
                    style={{ color: '#8B5CF6' }}
                    onMouseEnter={(e) => e.target.style.color = '#A855F7'}
                    onMouseLeave={(e) => e.target.style.color = '#8B5CF6'}
                  >
                    Register Account
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="success-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                {/* Success Animated Circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6 relative"
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '2px solid #10B981',
                    boxShadow: '0 0 20px rgba(16,185,129,0.3)',
                  }}
                >
                  <motion.svg
                    className="w-8 h-8 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    />
                  </motion.svg>
                </motion.div>
                
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Access Granted</h3>
                <p className="text-xs text-textSecondary max-w-[240px]">
                  Preparing your enterprise workspace, please wait...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Local ToastContainer for login feedback */}
      <ToastContainer />
    </div>
  );
};

export default Login;
