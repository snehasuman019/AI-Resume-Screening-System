import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getToastConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800/40',
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />,
          text: 'text-slate-800 dark:text-slate-200',
          bar: 'bg-emerald-500',
        };
      case 'error':
        return {
          bg: 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-800/40',
          icon: <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />,
          text: 'text-slate-800 dark:text-slate-200',
          bar: 'bg-rose-500',
        };
      default: // info / warning
        return {
          bg: 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800/40',
          icon: <Info className="h-4 w-4 text-blue-500 shrink-0" />,
          text: 'text-slate-800 dark:text-slate-200',
          bar: 'bg-blue-500',
        };
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-5 right-4 z-[60] flex flex-col gap-2.5 w-full max-w-sm px-4 sm:px-0 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const config = getToastConfig(toast.type);
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`pointer-events-auto relative overflow-hidden rounded-xl border shadow-lg ${config.bg} transition-colors duration-300`}
              >
                {/* Colored left accent bar */}
                <div className={`absolute left-0 inset-y-0 w-1 ${config.bar}`} />

                <div className="flex items-start gap-3 p-4 pl-5">
                  {config.icon}
                  <p className={`flex-1 text-sm font-medium leading-snug ${config.text}`}>
                    {toast.message}
                  </p>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="shrink-0 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-0.5 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
