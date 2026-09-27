import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { HourlyEnergyPoint } from '../../types';
import { CloudSun, Zap } from 'lucide-react';

interface WeatherAreaChartProps {
  data: HourlyEnergyPoint[];
}

export const WeatherAreaChart: React.FC<WeatherAreaChartProps> = ({ data }) => {
  const [activeMetric, setActiveMetric] = useState<'generation' | 'weather'>('generation');

  return (
    <div className="glass-panel p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              24-Hour Horizon & Weather Dynamics
            </h3>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Open-Meteo Synced
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Hour-by-hour solar PV, aerodynamic wind yield, and atmospheric temperature profile for Kanpur
          </p>
        </div>

        {/* Metric selector toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveMetric('generation')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'generation'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            Generation (kW)
          </button>
          <button
            onClick={() => setActiveMetric('weather')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'weather'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            Atmosphere (°C & Cloud %)
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === 'generation' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis
                dataKey="hourLabel"
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
                unit=" kW"
              />
              <Tooltip content={<CustomGenerationTooltip />} />
              <Area
                type="monotone"
                dataKey="solarKw"
                name="Solar PV"
                stroke="#F59E0B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#solarGradient)"
              />
              <Area
                type="monotone"
                dataKey="windKw"
                name="Wind Turbine"
                stroke="#0EA5E9"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#windGradient)"
              />
              <Area
                type="monotone"
                dataKey="loadKw"
                name="Site Load"
                stroke="#A855F7"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#loadGradient)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="cloudGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis
                dataKey="hourLabel"
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
              />
              <Tooltip content={<CustomWeatherTooltip />} />
              <Area
                type="monotone"
                dataKey="temperature"
                name="Temperature (°C)"
                stroke="#EF4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
              <Area
                type="monotone"
                dataKey="cloudCover"
                name="Cloud Cover (%)"
                stroke="#06B6D4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#cloudGradient)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-white/5 text-xs">
        <div className="flex items-center gap-6">
          {activeMetric === 'generation' ? (
            <>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                <span className="text-slate-600 dark:text-slate-300">Solar Array (5 kW)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sm shadow-sky-500/50" />
                <span className="text-slate-600 dark:text-slate-300">Wind Turbine (3 kW)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 border border-purple-300" />
                <span className="text-slate-600 dark:text-slate-300">Base Demand (Load)</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-600 dark:text-slate-300">Ambient Temp (°C)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span className="text-slate-600 dark:text-slate-300">Cloud Attenuation (%)</span>
              </div>
            </>
          )}
        </div>

        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          Latitude 26.45°N • Longitude 80.33°E
        </span>
      </div>
    </div>
  );
};

interface TooltipPayloadItem {
  value: number;
  name: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomGenerationTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white shadow-xl text-xs space-y-1.5 min-w-[150px]">
        <p className="font-bold text-slate-300 pb-1 border-b border-white/10 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Time: {label}
        </p>
        {payload.map((item, index) => (
          <div key={index} className="flex justify-between items-center gap-3">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}:
            </span>
            <span className="font-semibold text-slate-100">{item.value} kW</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomWeatherTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white shadow-xl text-xs space-y-1.5 min-w-[150px]">
        <p className="font-bold text-slate-300 pb-1 border-b border-white/10 flex items-center gap-1.5">
          <CloudSun className="w-3.5 h-3.5 text-cyan-400" /> Time: {label}
        </p>
        {payload.map((item, index) => (
          <div key={index} className="flex justify-between items-center gap-3">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}:
            </span>
            <span className="font-semibold text-slate-100">
              {item.value} {item.name.includes('Temp') ? '°C' : '%'}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
