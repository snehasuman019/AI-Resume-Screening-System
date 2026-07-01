import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-5 w-5 border-2',
    medium: 'h-10 w-10 border-[3px]',
    large: 'h-16 w-16 border-4',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-6 text-center"
    >
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-500`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse max-w-xs text-center leading-relaxed">
          {text}
        </p>
      )}
    </motion.div>
  );
};

export default LoadingSpinner;
