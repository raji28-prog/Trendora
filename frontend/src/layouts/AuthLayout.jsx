import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-primary to-secondary p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
            <span className="text-white font-extrabold text-lg">T</span>
          </div>
          <span className="text-lg font-bold tracking-tight">Trendora</span>
        </div>

        <div className="z-10 max-w-md my-auto flex flex-col gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-extrabold leading-tight tracking-tight"
          >
            Empower Your Local Business Growth
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm text-white/80 leading-relaxed"
          >
            Unify your marketing, manage local campaigns, and unlock powerful insights with our next-generation enterprise SaaS.
          </motion.p>
        </div>

        <div className="z-10 text-xs text-white/60">
          &copy; {new Date().getFullYear()} Trendora Inc. All rights reserved.
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md flex flex-col gap-6"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
