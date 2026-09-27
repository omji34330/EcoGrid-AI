import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'emerald' | 'cyan' | 'amber' | 'blue' | 'purple';
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  badge?: string;
  className?: string;
}

const colorMap = {
  emerald: {
    bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    glow: 'from-emerald-500/10 to-transparent',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  cyan: {
    bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    glow: 'from-cyan-500/10 to-transparent',
    text: 'text-cyan-400',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  },
  amber: {
    bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    glow: 'from-amber-500/10 to-transparent',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  blue: {
    bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    glow: 'from-blue-500/10 to-transparent',
    text: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  purple: {
    bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    glow: 'from-purple-500/10 to-transparent',
    text: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  color = 'emerald',
  trend,
  badge,
  className = '',
}) => {
  const styles = colorMap[color];

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`glass-panel relative p-6 overflow-hidden transition-all duration-300 group ${className}`}
    >
      {/* Background radial glow */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${styles.glow} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
      />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl border ${styles.bg} transition-transform duration-300 group-hover:scale-105`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-400">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[11px] text-slate-500 dark:text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {badge && (
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${styles.badge}`}>
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {unit}
          </span>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span
            className={`font-semibold flex items-center ${
              trend.isPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          {trend.label && (
            <span className="text-slate-400 dark:text-slate-500 text-[11px]">
              {trend.label}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};
