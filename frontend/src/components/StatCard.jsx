import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  const colorSchemes = {
    blue: {
      wrap: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30',
    },
    emerald: {
      wrap: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30',
    },
    indigo: {
      wrap: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30',
    },
    amber: {
      wrap: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30',
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${scheme.wrap}`}>
        {Icon && <Icon className="h-6 w-6" />}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
