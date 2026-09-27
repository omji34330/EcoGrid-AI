import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { DailyGenerationPoint } from '../../types';
import { Calendar, Sun, Wind } from 'lucide-react';

interface GenerationBarChartProps {
  data: DailyGenerationPoint[];
}

export const GenerationBarChart: React.FC<GenerationBarChartProps> = ({ data }) => {
  const total7DayKwh = data.reduce((acc, d) => acc + d.totalKwh, 0);
  const avgDailyKwh = data.length > 0 ? (total7DayKwh / data.length).toFixed(1) : '0';

  return (
    <div className="glass-panel p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              7-Day Renewable Generation Trend
            </h3>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Kanpur History
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Aggregated daily clean energy yield (Solar PV + Wind Turbine)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-600 dark:text-slate-400">7-Day Mean:</span>
          <span className="text-emerald-500 dark:text-emerald-400 font-bold">{avgDailyKwh} kWh/day</span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis
              dataKey="dayLabel"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155', opacity: 0.3 }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit=" kWh"
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }}
              formatter={(value) => (
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {value === 'solarKwh' ? 'Solar PV (kWh)' : 'Wind Turbine (kWh)'}
                </span>
              )}
            />
            <Bar
              dataKey="solarKwh"
              name="solarKwh"
              fill="#F59E0B"
              radius={[4, 4, 0, 0]}
              stackId="generation"
            />
            <Bar
              dataKey="windKwh"
              name="windKwh"
              fill="#0EA5E9"
              radius={[4, 4, 0, 0]}
              stackId="generation"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface TooltipPayloadItem {
  value: number;
  dataKey: string;
  payload: DailyGenerationPoint;
}

const CustomBarTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const pt = payload[0].payload;
    return (
      <div className="p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white shadow-xl text-xs space-y-1.5 min-w-[170px]">
        <p className="font-bold text-slate-300 pb-1 border-b border-white/10 flex items-center justify-between">
          <span>{label} ({pt.date})</span>
        </p>
        <div className="flex justify-between items-center text-amber-400">
          <span className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5" /> Solar:
          </span>
          <span className="font-bold">{pt.solarKwh} kWh</span>
        </div>
        <div className="flex justify-between items-center text-sky-400">
          <span className="flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5" /> Wind:
          </span>
          <span className="font-bold">{pt.windKwh} kWh</span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-white/10 font-bold text-emerald-400">
          <span>Total Clean:</span>
          <span>{pt.totalKwh} kWh</span>
        </div>
        <div className="text-[10px] text-slate-400 flex justify-between">
          <span>CO₂ Avoided:</span>
          <span className="font-semibold text-slate-200">{pt.co2AvoidedKg} kg</span>
        </div>
      </div>
    );
  }
  return null;
};
