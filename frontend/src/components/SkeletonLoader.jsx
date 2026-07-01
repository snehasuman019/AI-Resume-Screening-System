import React from 'react';

const SkeletonLoader = ({ type = 'cards', count = 3 }) => {
  const CardSkeleton = () => (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
        <div className="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="flex gap-1.5">
          <div className="h-5 w-12 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-14 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
      <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex gap-2">
        <div className="h-8 flex-1 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );

  const StatSkeleton = () => (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex items-center gap-4 animate-pulse">
      <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-2 flex-1">
        <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );

  const DetailSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="border-b border-slate-250 dark:border-slate-800 pb-6 space-y-3">
        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3.5 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="h-48 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {type === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: count }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      )}
      {type === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <StatSkeleton key={idx} />
          ))}
        </div>
      )}
      {type === 'detail' && <DetailSkeleton />}
    </>
  );
};

export default SkeletonLoader;
