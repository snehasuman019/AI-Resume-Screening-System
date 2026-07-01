import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, candidateName, matchScore, isDeleting }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400';
    if (score >= 60) return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400';
    if (score >= 40) return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400';
    return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl z-10 transition-colors duration-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header Close Icon */}
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-650 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Warning Icon & Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 id="modal-title" className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Confirm Deletion
              </h3>
            </div>

            {/* Content Details */}
            <div className="mt-4 space-y-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Are you sure you want to permanently delete this candidate screening profile? This action is irreversible.
              </p>

              {/* Candidate Info Box */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3.5 flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate" title={candidateName}>
                    {candidateName}
                  </p>
                  <p className="text-3xs text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                    Candidate Profile
                  </p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${getScoreColor(matchScore)}`}>
                  {matchScore}% Match
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-650/10 transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="h-3 w-3 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Profile
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
