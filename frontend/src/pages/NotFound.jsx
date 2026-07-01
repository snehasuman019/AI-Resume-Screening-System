import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[75vh] flex-col items-center justify-center p-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30 mb-6 shadow-sm"
      >
        <AlertTriangle className="h-10 w-10" />
      </motion.div>

      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">404</h1>
      <p className="mt-2 text-lg font-semibold text-slate-600 dark:text-slate-350">Page Not Found</p>
      <p className="mt-3 text-slate-500 dark:text-slate-450 text-sm max-w-sm leading-relaxed">
        The page you are looking for does not exist or has been moved to another URL.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all"
        >
          <Home className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    </motion.div>
  );
};

export default NotFound;
