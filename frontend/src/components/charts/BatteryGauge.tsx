import React from 'react';
import { BatteryCharging, Battery, Zap, ShieldCheck, Clock } from 'lucide-react';
import { MICROGRID_HARDWARE } from '../../utils/constants';

interface BatteryGaugeProps {
  socPct: number;
  status: 'charging' | 'discharging' | 'idle';
  flowKw: number;
  capacityKwh?: number;
}

export const BatteryGauge: React.FC<BatteryGaugeProps> = ({
  socPct,
  status,
  flowKw,
  capacityKwh = MICROGRID_HARDWARE.batteryCapacityKwh,
}) => {
  // SVG circular gauge geometry
  const radius = 80;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Arc angle: 260 degrees (leaving 100 degrees open at bottom)
  const arcLength = circumference * (260 / 360);
  const strokeDashoffset = arcLength - (socPct / 100) * arcLength;

  // Color logic
  const getColor = (pct: number) => {
    if (pct > 50) return { main: '#10B981', glow: 'rgba(16, 185, 129, 0.4)', text: 'text-emerald-400' };
    if (pct > 25) return { main: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)', text: 'text-amber-400' };
    return { main: '#EF4444', glow: 'rgba(239, 68, 68, 0.4)', text: 'text-rose-400' };
  };

  const color = getColor(socPct);

  // Runtime calculation
  let runtimeText = 'Stabilized';
  if (status === 'charging' && flowKw > 0.05) {
    const kwhNeeded = ((MICROGRID_HARDWARE.batteryMaxSocPct - socPct) / 100) * capacityKwh;
    const hours = kwhNeeded / flowKw;
    runtimeText = `${hours.toFixed(1)}h to 95% full`;
  } else if (status === 'discharging' && flowKw > 0.05) {
    const kwhRemaining = ((socPct - MICROGRID_HARDWARE.batteryMinSocPct) / 100) * capacityKwh;
    const hours = kwhRemaining / flowKw;
    runtimeText = `${hours.toFixed(1)}h runtime left`;
  }

  return (
    <div className="glass-panel p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Battery State of Charge
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            10.0 kWh LiFePO4 Energy Storage (BESS)
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-xs font-semibold">
          {status === 'charging' ? (
            <>
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400 capitalize">{status}</span>
            </>
          ) : (
            <>
              <Battery className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 capitalize">{status}</span>
            </>
          )}
        </div>
      </div>

      {/* SVG Radial Gauge */}
      <div className="relative flex flex-col items-center justify-center my-3">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform rotate-[140deg] overflow-visible"
        >
          {/* Background track arc */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-slate-200 dark:text-slate-800/80"
          />
          {/* Foreground active arc */}
          <circle
            stroke={color.main}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease',
              filter: `drop-shadow(0 0 8px ${color.glow})`,
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center Text inside gauge */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {socPct.toFixed(1)}%
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
            SOC Level
          </span>
        </div>
      </div>

      {/* Telemetry Footer Grid */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 dark:border-white/5 text-xs">
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Flow Rate</div>
            <div className="font-bold text-slate-800 dark:text-slate-200">
              {flowKw.toFixed(2)} kW
            </div>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Health (SOH)</div>
            <div className="font-bold text-slate-800 dark:text-slate-200">98.6%</div>
          </div>
        </div>

        <div className="col-span-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Estimated Dispatch:
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
            {runtimeText}
          </span>
        </div>
      </div>
    </div>
  );
};
