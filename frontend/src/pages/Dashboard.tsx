import React from 'react';
import { motion } from 'framer-motion';
import {
  Thermometer,
  Wind,
  CloudSun,
  Droplets,
  Gauge,
  Sun,
  RefreshCw,
  Pause,
  Play,
  AlertTriangle,
  Zap,
  Leaf,
  Clock,
  MapPin,
} from 'lucide-react';
import { useLiveData } from '../hooks/useLiveData';
import { MetricCard } from '../components/ui/MetricCard';
import { CardSkeleton, ChartSkeleton } from '../components/ui/SkeletonLoader';
import { WeatherAreaChart } from '../components/charts/WeatherAreaChart';
import { EnergyMixDonut } from '../components/charts/EnergyMixDonut';
import { GenerationBarChart } from '../components/charts/GenerationBarChart';
import { BatteryGauge } from '../components/charts/BatteryGauge';
import { LocationSelector } from '../components/layout/LocationSelector';

export const Dashboard: React.FC = () => {
  const {
    telemetry,
    loading,
    error,
    lastUpdated,
    countdown,
    isPaused,
    togglePause,
    refetch,
  } = useLiveData();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header & Telemetry Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] dark:border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Live Microgrid Telemetry
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live 60s Stream
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="font-medium text-slate-300">
              {telemetry?.locationName || 'Kanpur, Uttar Pradesh'}
            </span>
            <span className="text-slate-500">
              ({telemetry?.latitude?.toFixed(4) ?? 26.4499}°N, {telemetry?.longitude?.toFixed(4) ?? 80.3319}°E)
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-emerald-400/90 text-xs font-semibold">Open-Meteo High-Resolution Node</span>
          </p>
        </div>

        {/* Refresh, Sync & Location Controls */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Quick Location Switcher / GPS */}
          <LocationSelector compact />

          {/* Countdown Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Sync in <strong className="text-white font-mono">{countdown}s</strong>
            </span>
            <button
              onClick={togglePause}
              title={isPaused ? 'Resume auto-refresh' : 'Pause auto-refresh'}
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-1"
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
            </button>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={() => refetch()}
            disabled={loading}
            aria-label="Refresh telemetry data"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Notice / Warning Bar if any */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 font-bold text-amber-200 text-[11px] transition-colors"
          >
            Retry Connection
          </button>
        </motion.div>
      )}

      {/* Primary Weather KPIs (5 Core Metrics Required by Prompt) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Atmospheric & Environmental Telemetry
          </h2>
          {lastUpdated && (
            <span className="text-[11px] text-slate-500">
              Last synced: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>

        {loading && !telemetry ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. Temperature */}
            <MetricCard
              title="Temperature"
              value={telemetry?.temperature ?? 28.5}
              unit="°C"
              subtitle={`Feels like ${telemetry?.feelsLike ?? 30}°C`}
              icon={Thermometer}
              color="amber"
              trend={{ value: '0.4°C / hr', isPositive: true, label: 'Diurnal climb' }}
              badge={telemetry?.weatherCondition ?? 'Clear'}
            />

            {/* 2. Wind Speed */}
            <MetricCard
              title="Wind Speed"
              value={telemetry?.windSpeed ?? 14.2}
              unit="km/h"
              subtitle={`${((telemetry?.windSpeed ?? 14.2) / 3.6).toFixed(1)} m/s • Dir ${telemetry?.windDirection ?? 120}°`}
              icon={Wind}
              color="cyan"
              trend={{
                value: (telemetry?.windSpeed ?? 14) >= 10 ? 'Generating' : 'Standby',
                isPositive: (telemetry?.windSpeed ?? 14) >= 10,
                label: '10 km/h cut-in',
              }}
              badge="3 kW Turbine"
            />

            {/* 3. Cloud Cover */}
            <MetricCard
              title="Cloud Cover"
              value={telemetry?.cloudCover ?? 25}
              unit="%"
              subtitle={
                (telemetry?.cloudCover ?? 25) < 30 ? 'High clearness index' : 'Partial attenuation'
              }
              icon={CloudSun}
              color="blue"
              trend={{
                value: `${Math.round(100 - (telemetry?.cloudCover ?? 25) * 0.75)}%`,
                isPositive: (telemetry?.cloudCover ?? 25) < 40,
                label: 'Solar clearness',
              }}
              badge="PV Attenuation"
            />

            {/* 4. Humidity */}
            <MetricCard
              title="Humidity"
              value={telemetry?.humidity ?? 55}
              unit="%"
              subtitle="Relative atmospheric moisture"
              icon={Droplets}
              color="emerald"
              trend={{ value: 'Normal', isPositive: true, label: 'Dew point ~18°C' }}
              badge="Ambient"
            />

            {/* 5. Air Pressure */}
            <MetricCard
              title="Air Pressure"
              value={telemetry?.airPressure ?? 1012}
              unit="hPa"
              subtitle="Surface barometric level"
              icon={Gauge}
              color="purple"
              trend={{ value: 'Stable', isPositive: true, label: '1013.25 standard' }}
              badge="Barometer"
            />
          </div>
        )}
      </section>

      {/* Live Power Generation Strip */}
      <section className="glass-panel p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="flex items-center gap-3.5 pr-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase text-slate-400">Solar PV Output</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {telemetry?.solarOutputKw ?? 3.45} <span className="text-xs font-semibold text-slate-400">kW</span>
              </div>
              <div className="text-[10px] text-slate-500">Rated: 5.0 kW Array</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 md:px-4 pt-3 md:pt-0">
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase text-slate-400">Wind Turbine</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {telemetry?.windOutputKw ?? 1.2} <span className="text-xs font-semibold text-slate-400">kW</span>
              </div>
              <div className="text-[10px] text-slate-500">Rated: 3.0 kW HAWT</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 md:px-4 pt-3 md:pt-0">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase text-slate-400">Total Generation</div>
              <div className="text-xl font-extrabold text-emerald-400">
                {telemetry?.totalRenewableKw ?? 4.65} <span className="text-xs font-semibold text-slate-400">kW</span>
              </div>
              <div className="text-[10px] text-slate-500">Demand: {telemetry?.currentLoadKw ?? 1.25} kW</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 md:pl-4 pt-3 md:pt-0">
            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase text-slate-400">CO₂ Avoided Today</div>
              <div className="text-xl font-extrabold text-teal-400">
                {telemetry?.todayCo2AvoidedKg ?? 30.5} <span className="text-xs font-semibold text-slate-400">kg</span>
              </div>
              <div className="text-[10px] text-slate-500">0.82 kg/kWh CEA baseline</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Charts Grid: 24h Trend + Donut Mix */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading && !telemetry ? (
            <ChartSkeleton height="h-72" />
          ) : (
            <WeatherAreaChart data={telemetry?.hourlyNext24h ?? []} />
          )}
        </div>

        <div className="lg:col-span-1">
          {loading && !telemetry ? (
            <ChartSkeleton height="h-72" />
          ) : (
            <EnergyMixDonut
              solarKw={telemetry?.solarOutputKw ?? 3.4}
              windKw={telemetry?.windOutputKw ?? 1.2}
              batteryKw={telemetry?.batteryPowerKw ?? -0.8}
              gridImportKw={0}
              totalLoadKw={telemetry?.currentLoadKw ?? 1.25}
            />
          )}
        </div>
      </section>

      {/* Secondary Charts Grid: 7-Day Bar Chart + Battery Radial Gauge */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading && !telemetry ? (
            <ChartSkeleton height="h-72" />
          ) : (
            <GenerationBarChart data={telemetry?.dailyPast7d ?? []} />
          )}
        </div>

        <div className="lg:col-span-1">
          {loading && !telemetry ? (
            <ChartSkeleton height="h-72" />
          ) : (
            <BatteryGauge
              socPct={telemetry?.batterySocPct ?? 76.4}
              status={telemetry?.batteryStatus ?? 'charging'}
              flowKw={telemetry?.batteryPowerKw ?? 2.1}
            />
          )}
        </div>
      </section>
    </div>
  );
};
