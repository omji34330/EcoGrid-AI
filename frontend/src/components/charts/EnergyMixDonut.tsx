import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Sun, Wind, BatteryCharging, Power } from 'lucide-react';

interface EnergyMixDonutProps {
  solarKw: number;
  windKw: number;
  batteryKw: number; // positive = discharging into system, negative = charging
  gridImportKw: number;
  totalLoadKw: number;
}

const COLORS = {
  Solar: '#F59E0B',
  Wind: '#0EA5E9',
  Battery: '#10B981',
  Grid: '#8B5CF6',
};

export const EnergyMixDonut: React.FC<EnergyMixDonutProps> = ({
  solarKw,
  windKw,
  batteryKw,
  gridImportKw,
  totalLoadKw,
}) => {
  const batteryContribution = Math.max(0, -batteryKw); // When battery is discharging, it feeds the load

  const rawData = [
    { name: 'Solar', value: Math.max(0.05, solarKw), icon: Sun, color: COLORS.Solar },
    { name: 'Wind', value: Math.max(0.05, windKw), icon: Wind, color: COLORS.Wind },
    { name: 'Battery', value: Math.max(0.02, batteryContribution), icon: BatteryCharging, color: COLORS.Battery },
    { name: 'Grid Import', value: Math.max(0, gridImportKw), icon: Power, color: COLORS.Grid },
  ];

  // Filter out zero entries if others dominate
  const totalPower = rawData.reduce((acc, curr) => acc + curr.value, 0);
  const data = rawData.map((d) => ({
    ...d,
    pct: totalPower > 0 ? Math.round((d.value / totalPower) * 100) : 0,
  }));

  const cleanPower = solarKw + windKw + batteryContribution;
  const renewableRatio = totalPower > 0 ? Math.min(100, Math.round((cleanPower / totalPower) * 100)) : 100;

  return (
    <div className="glass-panel p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Live Energy Mix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time generation dispatch & grid feed • Demand: {totalLoadKw.toFixed(2)} kW
          </p>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {renewableRatio}% Clean
        </span>
      </div>

      <div className="relative h-60 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              stroke="transparent"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomDonutTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {totalPower.toFixed(2)}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
            Total kW
          </span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-200 dark:border-white/5 text-xs">
        {data.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2">
                <div
                  className="p-1 rounded-md"
                  style={{ backgroundColor: `${item.color}20`, color: item.color }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {item.name}
                </span>
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {item.value.toFixed(1)} kW
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: {
    color: string;
    pct: number;
  };
}

const CustomDonutTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white shadow-xl text-xs space-y-1">
        <p className="font-bold flex items-center gap-1.5" style={{ color: data.payload.color }}>
          {data.name}
        </p>
        <p className="text-slate-300 font-medium">
          Power: <span className="font-bold text-white">{data.value.toFixed(2)} kW</span>
        </p>
        <p className="text-slate-400 text-[11px]">
          Share: <span className="font-semibold text-emerald-400">{data.payload.pct}%</span>
        </p>
      </div>
    );
  }
  return null;
};
