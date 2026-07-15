import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer } from '../components/UI/Toast.jsx';
import FloatingCubes from '../components/UI/FloatingCubes.jsx';
import { Sparkles, Zap, TrendingUp } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex" style={{ background: 'transparent' }}>

      {/* ── Left panel: hero with 3D cubes ──────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between relative overflow-hidden select-none"
        style={{
          background: 'linear-gradient(135deg, #06060A 0%, #0D0918 40%, #0B0B12 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Deep neon glow blobs */}
        <div
          className="absolute top-[-15%] right-[-10%] w-[65%] h-[65%] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.9) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* ── 3D Floating Cubes ─────────────────────────────── */}
        <FloatingCubes />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 p-10">
          <div
            className="w-10 h-10 rounded-[12px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
              boxShadow: '0 0 20px rgba(124,58,237,0.5)',
            }}
          >
            <span className="text-white font-black text-xl leading-none">T</span>
          </div>
          <span className="text-white text-xl font-black tracking-widest">
            Trendora
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 px-10 pb-4 flex flex-col gap-8 my-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col gap-5"
          >
            {/* Eyebrow tag */}
            <span
              className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{
                background: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(124,58,237,0.3)',
                color: '#A855F7',
              }}
            >
              <Sparkles className="w-3 h-3" /> Next-Gen AI Marketing
            </span>

            <h1 className="text-5xl font-black leading-[1.05] text-white tracking-tight">
              Elevate Your<br />
              <span
                className="text-gradient-neon"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Marketing Game
              </span>
            </h1>
            <p className="text-sm text-textSecondary leading-relaxed max-w-sm font-normal">
              Unify your marketing, manage local campaigns, and unlock powerful AI-driven insights with our next-generation enterprise platform.
            </p>
          </motion.div>

          {/* Feature callout card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: 'easeOut' }}
            className="rounded-[20px] p-5 flex flex-col gap-4"
            style={{
              background: 'rgba(124,58,237,0.06)',
              border: '1px solid rgba(124,58,237,0.2)',
              boxShadow: '0 0 40px rgba(124,58,237,0.06)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-textSecondary">
                Campaign Performance
              </span>
              <span
                className="text-[9px] font-bold px-2.5 py-0.5 rounded-full"
                style={{
                  background: 'rgba(124,58,237,0.15)',
                  color: '#A855F7',
                  border: '1px solid rgba(124,58,237,0.3)',
                }}
              >
                Live Insights
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white tracking-tight">
                14,284
              </span>
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12.5%
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div
                className="h-1.5 w-full rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1.4, delay: 0.8, ease: 'easeInOut' }}
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(to right, #7C3AED, #A855F7)',
                    boxShadow: '0 0 8px rgba(124,58,237,0.6)',
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-textSecondary">
                <span>Reach goal progress</span>
                <span className="text-purple-400 font-semibold">72%</span>
              </div>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { label: 'Campaigns', value: '48', icon: Zap },
                { label: 'Posts', value: '312', icon: TrendingUp },
                { label: 'Score', value: '94', icon: Sparkles },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="flex flex-col gap-1 p-2.5 rounded-[10px]"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <Icon className="w-3 h-3 text-purple-400" />
                    <span className="text-base font-black text-white leading-none">{stat.value}</span>
                    <span className="text-[9px] text-textSecondary uppercase tracking-wider">{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 p-10 text-[11px] text-textSecondary/40">
          © {new Date().getFullYear()} Trendora Inc. All rights reserved.
        </div>
      </div>

      {/* ── Right panel: dark glassmorphic form area ───────── */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden"
        style={{ background: '#06060A' }}
      >
        {/* Subtle glow */}
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-60 h-60 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(79,70,229,0.04) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-md flex flex-col gap-6 relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-2">
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                boxShadow: '0 0 16px rgba(124,58,237,0.4)',
              }}
            >
              <span className="text-white font-black">T</span>
            </div>
            <span className="text-white font-black text-lg tracking-widest">Trendora</span>
          </div>

          {/* Glassmorphic form card */}
          <div
            className="rounded-[24px] p-8 md:p-10 relative overflow-hidden"
            style={{
              background: 'rgba(15, 15, 23, 0.7)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 60px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.08)',
            }}
          >
            {/* Neon top border */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.6) 50%, transparent 100%)',
              }}
            />
            <Outlet />
          </div>
        </motion.div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AuthLayout;
