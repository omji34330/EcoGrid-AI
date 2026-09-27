import React from 'react';

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`glass-panel p-6 animate-pulse ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-2 w-14 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
      <div className="h-4 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
    </div>
    <div className="h-8 w-28 rounded bg-slate-200 dark:bg-slate-800 mb-2" />
    <div className="h-3 w-36 rounded bg-slate-200 dark:bg-slate-800" />
  </div>
);

export const ChartSkeleton: React.FC<{ height?: string; className?: string }> = ({
  height = 'h-72',
  className = '',
}) => (
  <div className={`glass-panel p-6 animate-pulse ${className}`}>
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-2">
        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-48 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
    </div>
    <div className={`w-full ${height} rounded-xl bg-slate-200/50 dark:bg-slate-800/40 flex items-center justify-center`}>
      <div className="text-xs text-slate-400 dark:text-slate-600 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        Synchronizing Kanpur microgrid telemetry...
      </div>
    </div>
  </div>
);
