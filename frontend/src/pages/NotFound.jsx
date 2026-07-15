import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button.jsx';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md flex flex-col items-center gap-4"
      >
        <span
          className="text-8xl font-black text-transparent bg-clip-text leading-none select-none tracking-tighter"
          style={{
            backgroundImage: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
            filter: 'drop-shadow(0 0 16px rgba(124,58,237,0.3))'
          }}
        >
          404
        </span>
        <h1 className="text-3xl font-black text-white mt-1">
          Lost in Space
        </h1>
        <p className="text-sm text-textSecondary leading-relaxed mb-4 max-w-xs font-light">
          The page you are looking for doesn&apos;t exist or has been moved to another coordinate.
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
