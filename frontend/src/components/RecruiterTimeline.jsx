import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, UploadCloud, Cpu, Trash2, Database, Trash, ShieldCheck } from 'lucide-react';

// Global helper to add log entries from any component
export const addRecruiterLog = (action, details) => {
  try {
    const logs = JSON.parse(localStorage.getItem('recruiter_logs') || '[]');
    const now = new Date();
    const newLog = {
      id: Date.now(),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      action,
      details
    };
    // Limit to latest 15 logs
    localStorage.setItem('recruiter_logs', JSON.stringify([newLog, ...logs].slice(0, 15)));
    // Dispatch custom event to notify component
    window.dispatchEvent(new Event('recruiter_logs_updated'));
  } catch (e) {
    console.error('Failed to write recruiter log:', e);
  }
};

const RecruiterTimeline = () => {
  const [logs, setLogs] = useState([]);

  const loadLogs = () => {
    try {
      let stored = JSON.parse(localStorage.getItem('recruiter_logs') || '[]');
      
      // Seed initial mock logs if empty, so the recruiter always sees a populated dashboard
      if (stored.length === 0) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        stored = [
          {
            id: 1,
            time: '11:20 AM',
            date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            action: 'cv_uploaded',
            details: 'CV Sneha.pdf uploaded successfully.'
          },
          {
            id: 2,
            time: '11:22 AM',
            date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            action: 'candidate_analyzed',
            details: 'Matched CV Sneha.pdf against Job Spec. Score: 87.4%'
          },
          {
            id: 3,
            time: '09:45 AM',
            date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            action: 'stats_recalculated',
            details: 'Recalculated talent match statistics.'
          },
          {
            id: 4,
            time: '04:15 PM',
            date: yesterday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            action: 'cv_uploaded',
            details: 'CV Dipesh.pdf parsed and added.'
          }
        ];
        localStorage.setItem('recruiter_logs', JSON.stringify(stored));
      }
      setLogs(stored);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadLogs();
    
    // Listen for global updates
    window.addEventListener('recruiter_logs_updated', loadLogs);
    return () => window.removeEventListener('recruiter_logs_updated', loadLogs);
  }, []);

  const handleClearLogs = () => {
    localStorage.setItem('recruiter_logs', '[]');
    setLogs([]);
    addRecruiterLog('logs_cleared', 'Cleared activity log trail.');
  };

  const getLogIcon = (action) => {
    switch (action) {
      case 'cv_uploaded':
        return <UploadCloud className="h-3.5 w-3.5 text-blue-500" />;
      case 'candidate_analyzed':
        return <Cpu className="h-3.5 w-3.5 text-emerald-500" />;
      case 'candidate_deleted':
        return <Trash2 className="h-3.5 w-3.5 text-rose-500" />;
      case 'stats_recalculated':
        return <Database className="h-3.5 w-3.5 text-indigo-500" />;
      case 'logs_cleared':
        return <Trash className="h-3.5 w-3.5 text-amber-500" />;
      default:
        return <Clock className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  const getLogTitle = (action) => {
    switch (action) {
      case 'cv_uploaded':
        return 'Resume Uploaded';
      case 'candidate_analyzed':
        return 'AI Analysis Completed';
      case 'candidate_deleted':
        return 'Profile Deleted';
      case 'stats_recalculated':
        return 'Stats Re-indexed';
      case 'logs_cleared':
        return 'Logs Cleared';
      default:
        return 'Activity Logged';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-500" />
          Recruiter Activity Timeline
        </h3>
        <button
          onClick={handleClearLogs}
          className="text-3xs font-semibold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-wider"
        >
          Reset Logs
        </button>
      </div>

      <div className="relative pl-6 space-y-5 max-h-[300px] overflow-y-auto pr-1">
        {/* Vertical Line */}
        <div className="absolute top-1 left-[11px] bottom-1 w-[2px] bg-slate-100 dark:bg-slate-800" />

        <AnimatePresence initial={false}>
          {logs.map((log, idx) => (
            <motion.div
              key={log.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative text-xs group"
            >
              {/* Bullet Icon */}
              <div className="absolute -left-[21px] top-0.5 flex h-[12px] w-[12px] items-center justify-center rounded-full bg-slate-50 dark:bg-slate-950 ring-2 ring-slate-100 dark:ring-slate-800 group-hover:scale-110 transition-transform">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              </div>

              {/* Log Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 shadow-3xs">
                    {getLogIcon(log.action)}
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-350">{getLogTitle(log.action)}</span>
                </div>
                <span className="text-4xs text-slate-400 dark:text-slate-500 font-bold sm:text-right uppercase tracking-wider">
                  {log.date} @ {log.time}
                </span>
              </div>
              <p className="text-slate-550 dark:text-slate-400 mt-1 pl-6 leading-relaxed">
                {log.details}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecruiterTimeline;
