import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side: Premium clean white column */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FAFAFB] p-16 flex-col justify-between text-textPrimary relative overflow-hidden select-none border-r border-border">
        {/* Glow Effects (Soft Purple) */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-[80px] pointer-events-none" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.25] bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="flex items-center gap-3 z-10">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-border shadow-sm">
            <span className="text-primary font-black text-lg">T</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-textPrimary">Trendora</span>
        </div>

        <div className="z-10 max-w-md my-auto flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col gap-3"
          >
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-textPrimary">
              Empower Your Local Business Growth
            </h1>
            <p className="text-sm text-textSecondary leading-relaxed font-normal">
              Unify your marketing, manage local campaigns, and unlock powerful insights with our next-generation enterprise SaaS.
            </p>
          </motion.div>

          {/* Premium Floating Card Teaser - Light Theme */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="relative rounded-2xl border border-border bg-white p-6 shadow-premium flex flex-col gap-4 mt-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">Campaign Performance</span>
              <span className="text-[9px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full border border-primary/20">
                Live Insights
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-textPrimary">14,284</span>
              <span className="text-xs font-semibold text-emerald-600">+12.5%</span>
            </div>
            <div className="flex flex-col gap-2 mt-1">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "72%" }}
                  transition={{ duration: 1.0, delay: 0.5, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>
              <div className="flex justify-between text-[10px] text-textSecondary">
                <span>Reach goal progress</span>
                <span>72%</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="z-10 text-xs text-textSecondary">
          &copy; {new Date().getFullYear()} Trendora Inc. All rights reserved.
        </div>
      </div>

      {/* Right side: Clean auth forms column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-md flex flex-col gap-6"
        >
          <div className="rounded-2xl border border-border bg-surface p-8 shadow-premium md:p-10">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
