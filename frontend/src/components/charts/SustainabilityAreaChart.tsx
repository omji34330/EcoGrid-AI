import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface MonthlySustainabilityPoint {
  month: string;
  generationKwh: number;
  co2AvoidedKg: number;
  targetKwh: number;
}

// Typical representative year progression for Kanpur microgrid
const MONTHLY_DATA: MonthlySustainabilityPoint[] = [
  { month: 'Oct 25', generationKwh: 1040, co2AvoidedKg: 852.8, targetKwh: 980 },
  { month: 'Nov 25', generationKwh: 980, co2AvoidedKg: 803.6, targetKwh: 950 },
  { month: 'Dec 25', generationKwh: 860, co2AvoidedKg: 705.2, targetKwh: 900 },
  { month: 'Jan 26', generationKwh: 890, co2AvoidedKg: 729.8, targetKwh: 920 },
  { month: 'Feb 26', generationKwh: 1120, co2AvoidedKg: 918.4, targetKwh: 1050 },
  { month: 'Mar 26', generationKwh: 1380, co2AvoidedKg: 1131.6, targetKwh: 1200 },
  { month: 'Apr 26', generationKwh: 1490, co2AvoidedKg: 1221.8, targetKwh: 1350 },
  { month: 'May 26', generationKwh: 1560, co2AvoidedKg: 1279.2, targetKwh: 1400 },
  { month: 'Jun 26', generationKwh: 1280, co2AvoidedKg: 1049.6, targetKwh: 1300 },
  { month: 'Jul 26', generationKwh: 1140, co2AvoidedKg: 934.8, targetKwh: 1200 },
  { month: 'Aug 26', generationKwh: 1190, co2AvoidedKg: 975.8, targetKwh: 1200 },
  { month: 'Sep 26', generationKwh: 1310, co2AvoidedKg: 1074.2, targetKwh: 1250 },
];

export const SustainabilityAreaChart: React.FC = () => {
  return (
    <div className="glass-panel p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            12-Month Renewable Generation & Carbon Mitigation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracking cumulative clean kWh output versus Scope 2 emissions avoided (0.82 kg CO₂/kWh)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ESG Scope 2 Verified
          </span>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="sustainGenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis
              dataKey="month"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155', opacity: 0.3 }}
            />
            <YAxis
              yAxisId="left"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit=" kWh"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit=" kg"
            />
            <Tooltip content={<CustomSustainTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="generationKwh"
              name="Generated Clean Energy (kWh)"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#sustainGenGradient)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="co2AvoidedKg"
              name="CO₂ Avoided (kg)"
              stroke="#06B6D4"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#06B6D4' }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="targetKwh"
              name="Target Output (kWh)"
              stroke="#F59E0B"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface TooltipItem {
  value: number;
  name: string;
  color: string;
}

const CustomSustainTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white shadow-xl text-xs space-y-1.5 min-w-[190px]">
        <p className="font-bold text-slate-300 pb-1 border-b border-white/10">{label} Audit Point</p>
        {payload.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center gap-3">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}:
            </span>
            <span className="font-semibold text-slate-100">{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
