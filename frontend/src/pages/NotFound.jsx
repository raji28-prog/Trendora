import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button.jsx';
import { ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md flex flex-col items-center"
      >
        <span className="text-8xl font-black text-primary/10 tracking-tight select-none">404</span>
        <h1 className="text-2xl font-bold tracking-tight text-textPrimary mt-4 mb-2">Page Not Found</h1>
        <p className="text-xs text-textSecondary leading-relaxed mb-8 max-w-xs">
          The page you are looking for doesn&apos;t exist or has been moved to another location.
        </p>
        <Button
          variant="primary"
          icon={ArrowLeft}
          onClick={() => navigate('/')}
        >
          Back to Safety
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
