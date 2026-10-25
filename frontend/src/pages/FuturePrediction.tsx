import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Sun,
  Wind,
  BatteryCharging,
  Leaf,
  Calendar,
  TrendingUp,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Clock,
  ArrowUpRight,
  CloudSun,
  Cloud,
  CloudRain,
  ShieldAlert,
} from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { LocationSelector } from '../components/layout/LocationSelector';
import {
  fetchLiveUpcomingDaysForecast,
  generateUpcomingDaysForecast,
} from '../utils/energyCalculations';
import type { MultiDayForecastSummary } from '../types';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Bar,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const FuturePrediction: React.FC = () => {
  const { location } = useLocationContext();

  // Forecast Horizon: 3, 7, or 14 upcoming days
  const [horizonDays, setHorizonDays] = useState<number>(7);

  // Scenario stress-testing sliders
  const [cloudCoverDelta, setCloudCoverDelta] = useState<number>(0);
  const [windMultiplier, setWindMultiplier] = useState<number>(1.0);
  const [loadMultiplier, setLoadMultiplier] = useState<number>(1.0);

  // Active chart view tab
  const [activeTab, setActiveTab] = useState<'balance' | 'grid' | 'battery' | 'weather'>('balance');

  // Selected day for detailed 24-hour drill-down
  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);

  // Loading & data states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<MultiDayForecastSummary | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch or recompute upcoming days data
  const loadForecast = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchLiveUpcomingDaysForecast(location, horizonDays, {
        cloudCoverDeltaPct: cloudCoverDelta,
        windSpeedMultiplier: windMultiplier,
        loadMultiplier: loadMultiplier,
      });
      setSummary(data);
      setLastUpdated(new Date());
    } catch {
      // Guaranteed fallback to physics generator
      const fallback = generateUpcomingDaysForecast(location, horizonDays, {
        cloudCoverDeltaPct: cloudCoverDelta,
        windSpeedMultiplier: windMultiplier,
        loadMultiplier: loadMultiplier,
      });
      setSummary(fallback);
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  }, [location, horizonDays, cloudCoverDelta, windMultiplier, loadMultiplier]);

  useEffect(() => {
    loadForecast();
  }, [loadForecast]);

  // Selected day details for modal/drill-down
  const selectedDay = useMemo(() => {
    if (!summary || !summary.days.length) return null;
    if (!selectedDayDate) return summary.days[0];
    return summary.days.find((d) => d.date === selectedDayDate) ?? summary.days[0];
  }, [summary, selectedDayDate]);

  // Quick climate presets
  const applyPreset = (preset: 'heatwave' | 'monsoon' | 'windstorm' | 'weekend') => {
    switch (preset) {
      case 'heatwave':
        setCloudCoverDelta(-20);
        setWindMultiplier(0.8);
        setLoadMultiplier(1.35);
        break;
      case 'monsoon':
        setCloudCoverDelta(45);
        setWindMultiplier(1.3);
        setLoadMultiplier(1.1);
        break;
      case 'windstorm':
        setCloudCoverDelta(10);
        setWindMultiplier(1.6);
        setLoadMultiplier(1.0);
        break;
      case 'weekend':
        setCloudCoverDelta(0);
        setWindMultiplier(1.0);
        setLoadMultiplier(0.75);
        break;
    }
  };

  const resetSliders = () => {
    setCloudCoverDelta(0);
    setWindMultiplier(1.0);
    setLoadMultiplier(1.0);
  };

  // Export forecast to CSV
  const handleExportCSV = () => {
    if (!summary || !summary.days.length) return;

    const headers = [
      'Date',
      'Day',
      'Weather Condition',
      'Max Temp (C)',
      'Min Temp (C)',
      'Avg Wind (km/h)',
      'Cloud Cover (%)',
      'Solar Yield (kWh)',
      'Wind Yield (kWh)',
      'Total Generation (kWh)',
      'Campus Demand (kWh)',
      'Net Grid Exchange (kWh)',
      'Self Sufficiency (%)',
      'Min Battery Buffer SOC (%)',
      'Peak Battery Charge SOC (%)',
      'CO2 Avoided (kg)',
      'AI Confidence (%)',
      'Status Badge',
    ];

    const rows = summary.days.map((d) => [
      d.date,
      `"${d.fullDayLabel}"`,
      `"${d.weatherCondition}"`,
      d.tempMaxC,
      d.tempMinC,
      d.avgWindSpeedKmh,
      d.avgCloudCoverPct,
      d.solarYieldKwh,
      d.windYieldKwh,
      d.totalRenewableKwh,
      d.campusDemandKwh,
      d.netGridKwh,
      d.selfSufficiencyPct,
      d.bessMinBufferSocPct,
      d.bessPeakChargeSocPct,
      d.co2AvoidedKg,
      d.confidenceScorePct,
      `"${d.statusBadge}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecogrid-future-prediction-${location.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}-${horizonDays}days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Weather icon helper
  const getWeatherIcon = (condition: string, cloudPct: number) => {
    if (condition.includes('Rain') || condition.includes('Thunder')) {
      return <CloudRain className="w-5 h-5 text-sky-400" />;
    }
    if (cloudPct > 60 || condition.includes('Overcast')) {
      return <Cloud className="w-5 h-5 text-slate-400" />;
    }
    if (cloudPct > 30 || condition.includes('Partly')) {
      return <CloudSun className="w-5 h-5 text-amber-400" />;
    }
    return <Sun className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 dark:border-cyan-500/15">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Physics-Informed Multi-Day Predictor
            </span>
            <span className="text-xs text-slate-400 font-medium">
              PS ID 26200 • Smart India Hackathon
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Upcoming Days Energy Prediction
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            Multi-day meteorological forecasting and physics-grounded energy modeling for{' '}
            <span className="text-emerald-400 font-semibold">{location.name}</span>. Predicts solar radiation, wind yield, campus demand, and battery SOC.
          </p>
        </div>

        {/* Right side controls: Location & Horizon & Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          <LocationSelector />

          {/* Horizon Selector */}
          <div className="flex items-center bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setHorizonDays(3)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                horizonDays === 3
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3 Days
            </button>
            <button
              onClick={() => setHorizonDays(7)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                horizonDays === 7
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Days (Weekly)
            </button>
            <button
              onClick={() => setHorizonDays(14)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                horizonDays === 14
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              14 Days (Fortnight)
            </button>
          </div>

          {/* Refresh button with last updated indicator */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 hidden xl:inline">
              Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <button
              onClick={loadForecast}
              disabled={isLoading}
              title={`Recalculate forecast (Updated ${lastUpdated.toLocaleTimeString()})`}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm shadow-emerald-500/10"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Banner */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Total Projected Renewable Generation */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-500/25 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Total Clean Gen
              </span>
              <span className="text-[10px] text-slate-500">{summary.horizonDays}d Total</span>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-white">
              {summary.totalProjectedKwh}{' '}
              <span className="text-xs font-semibold text-slate-400">kWh</span>
            </div>
            <div className="mt-1 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Avg {summary.avgDailyRenewableKwh} kWh / day</span>
            </div>
          </motion.div>

          {/* Solar PV Contribution */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/25 shadow-lg"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-amber-400 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5" /> Solar PV Yield
              </span>
              <span className="text-[10px] text-slate-500">5 kW</span>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-white">
              {summary.totalSolarKwh}{' '}
              <span className="text-xs font-semibold text-slate-400">kWh</span>
            </div>
            <div className="mt-1 text-[11px] text-amber-400/90 font-medium">
              {Math.round((summary.totalSolarKwh / Math.max(1, summary.totalProjectedKwh)) * 100)}% of total yield
            </div>
          </motion.div>

          {/* Wind Turbine Contribution */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-sky-500/25 shadow-lg"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-sky-400 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5" /> Wind Turbine
              </span>
              <span className="text-[10px] text-slate-500">3 kW</span>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-white">
              {summary.totalWindKwh}{' '}
              <span className="text-xs font-semibold text-slate-400">kWh</span>
            </div>
            <div className="mt-1 text-[11px] text-sky-400/90 font-medium">
              {Math.round((summary.totalWindKwh / Math.max(1, summary.totalProjectedKwh)) * 100)}% of total yield
            </div>
          </motion.div>

          {/* Projected Campus Demand */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-purple-500/25 shadow-lg"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-purple-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Campus Demand
              </span>
              <span className="text-[10px] text-slate-500">Load</span>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-white">
              {summary.totalDemandKwh}{' '}
              <span className="text-xs font-semibold text-slate-400">kWh</span>
            </div>
            <div className="mt-1 text-[11px] text-purple-400/90 font-medium">
              {summary.avgSelfSufficiencyPct}% Self-Sufficiency
            </div>
          </motion.div>

          {/* Net Grid Balance */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className={`p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border shadow-lg ${
              summary.netGridBalanceKwh >= 0 ? 'border-emerald-500/30' : 'border-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span
                className={`font-semibold flex items-center gap-1 ${
                  summary.netGridBalanceKwh >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" /> Net Grid Balance
              </span>
              <span className="text-[10px] text-slate-500">Utility</span>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-white">
              {summary.netGridBalanceKwh > 0 ? `+${summary.netGridBalanceKwh}` : summary.netGridBalanceKwh}{' '}
              <span className="text-xs font-semibold text-slate-400">kWh</span>
            </div>
            <div
              className={`mt-1 text-[11px] font-medium ${
                summary.netGridBalanceKwh >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {summary.netGridBalanceKwh >= 0 ? 'Clean Green Export' : 'Supplemental Grid Draw'}
            </div>
          </motion.div>

          {/* CO2 Emissions Avoided */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-teal-500/25 shadow-lg"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-teal-400 flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5" /> CO₂ Offset
              </span>
              <span className="text-[10px] text-slate-500">ESG</span>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-white">
              {summary.totalCo2AvoidedKg}{' '}
              <span className="text-xs font-semibold text-slate-400">kg</span>
            </div>
            <div className="mt-1 text-[11px] text-teal-400/90 font-medium">
              ~{(summary.totalCo2AvoidedKg * 0.05).toFixed(1)} Trees Equivalent
            </div>
          </motion.div>
        </div>
      )}

      {/* 3. Interactive Multi-Day Forecast Visualizations */}
      {summary && (
        <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 dark:border-cyan-500/15 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                Upcoming Days Generation & Demand Horizon
              </h2>
              <p className="text-xs text-slate-400">
                Interactive daily breakdown across the upcoming {summary.horizonDays} days
              </p>
            </div>

            {/* Chart View Tabs */}
            <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-white/10 text-xs font-medium">
              <button
                onClick={() => setActiveTab('balance')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'balance'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Energy Yield vs Load
              </button>
              <button
                onClick={() => setActiveTab('grid')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'grid'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Net Grid Exchange
              </button>
              <button
                onClick={() => setActiveTab('battery')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'battery'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                BESS Battery Buffer
              </button>
              <button
                onClick={() => setActiveTab('weather')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'weather'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Atmospheric Trends
              </button>
            </div>
          </div>

          {/* Active Chart Display */}
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'balance' ? (
                <ComposedChart data={summary.days} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="dayLabel" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} unit=" kWh" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '1rem',
                      color: '#f8fafc',
                    }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="solarYieldKwh" name="Solar Yield (kWh)" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="gen" />
                  <Bar dataKey="windYieldKwh" name="Wind Yield (kWh)" fill="#0ea5e9" radius={[4, 4, 0, 0]} stackId="gen" />
                  <Line type="monotone" dataKey="campusDemandKwh" name="Campus Demand (kWh)" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              ) : activeTab === 'grid' ? (
                <AreaChart data={summary.days} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="dayLabel" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} unit=" kWh" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '1rem',
                      color: '#f8fafc',
                    }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
                  <defs>
                    <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="netGridKwh" name="Net Grid Balance (kWh)" stroke="#10b981" strokeWidth={2.5} fill="url(#gridGrad)" />
                  <Line type="monotone" dataKey="selfSufficiencyPct" name="Self Sufficiency (%)" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4 }} />
                </AreaChart>
              ) : activeTab === 'battery' ? (
                <ComposedChart data={summary.days} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="dayLabel" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} domain={[0, 100]} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '1rem',
                      color: '#f8fafc',
                    }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="bessPeakChargeSocPct" name="Peak Midday Saturation SOC (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="bessMinBufferSocPct" name="Minimum Overnight Buffer SOC (%)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              ) : (
                <ComposedChart data={summary.days} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="dayLabel" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '1rem',
                      color: '#f8fafc',
                    }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="tempMaxC" name="Max Temp (°C)" fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="peakWindSpeedKmh" name="Peak Wind (km/h)" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="avgCloudCoverPct" name="Cloud Cover (%)" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 4. Upcoming Days Cards Grid */}
      {summary && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Upcoming Days Prediction Cards
              </h2>
              <p className="text-xs text-slate-400">
                Click any day card to inspect its full 24-hour generation & storage profile
              </p>
            </div>

            <div className="text-xs text-slate-400">
              Showing <span className="text-emerald-400 font-bold">{summary.days.length}</span> upcoming days
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {summary.days.map((day, idx) => {
              const isSelected = selectedDay?.date === day.date;
              return (
                <motion.div
                  key={day.date}
                  whileHover={{ scale: 1.015 }}
                  onClick={() => setSelectedDayDate(day.date)}
                  className={`cursor-pointer p-4 rounded-2xl backdrop-blur-md border transition-all relative overflow-hidden flex flex-col justify-between gap-3 shadow-lg ${
                    isSelected
                      ? 'bg-slate-900/95 border-emerald-500 shadow-emerald-500/15'
                      : 'bg-slate-900/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Top Bar: Date & Weather Condition */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{day.fullDayLabel}</span>
                        {idx === 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            Tomorrow
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <span>{day.weatherCondition}</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      {getWeatherIcon(day.weatherCondition, day.avgCloudCoverPct)}
                    </div>
                  </div>

                  {/* Weather KPIs */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5 text-[11px]">
                    <div>
                      <div className="text-slate-400 text-[10px]">Temperature</div>
                      <div className="font-bold text-white">
                        {day.tempMaxC}° <span className="text-slate-500 font-normal">/ {day.tempMinC}°</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Peak Wind</div>
                      <div className="font-bold text-sky-400">{day.peakWindSpeedKmh} km/h</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Clouds</div>
                      <div className="font-bold text-slate-300">{day.avgCloudCoverPct}%</div>
                    </div>
                  </div>

                  {/* Generation Breakdown */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Total Clean Yield</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {day.totalRenewableKwh} <span className="text-[10px] font-normal text-slate-400">kWh</span>
                      </span>
                    </div>

                    {/* Solar vs Wind progress split bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                      <div
                        style={{
                          width: `${(day.solarYieldKwh / Math.max(0.1, day.totalRenewableKwh)) * 100}%`,
                        }}
                        className="h-full bg-amber-400"
                        title={`Solar: ${day.solarYieldKwh} kWh`}
                      />
                      <div
                        style={{
                          width: `${(day.windYieldKwh / Math.max(0.1, day.totalRenewableKwh)) * 100}%`,
                        }}
                        className="h-full bg-sky-400"
                        title={`Wind: ${day.windYieldKwh} kWh`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-amber-400 font-medium">Solar: {day.solarYieldKwh} kWh</span>
                      <span className="text-sky-400 font-medium">Wind: {day.windYieldKwh} kWh</span>
                    </div>
                  </div>

                  {/* Campus Demand & Net Balance */}
                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400">Demand: {day.campusDemandKwh} kWh</span>
                      <span className="text-[10px] text-slate-500">SOC: {day.bessMinBufferSocPct}% – {day.bessPeakChargeSocPct}%</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        day.netGridKwh >= 0
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {day.netGridKwh > 0 ? `+${day.netGridKwh} kWh` : `${day.netGridKwh} kWh`}
                    </span>
                  </div>

                  {/* Advisory Note */}
                  <div className="text-[10px] text-slate-400 leading-snug line-clamp-2 italic">
                    "{day.advisoryNote}"
                  </div>

                  {/* Bottom Footer: Drill-down hint */}
                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5 text-slate-400">
                    <span className="text-slate-400">AI Confidence: {day.confidenceScorePct}%</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                      View 24h Profile →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Drill-Down: Detailed 24-Hour Profile for Selected Day */}
      {selectedDay && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 shadow-2xl space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Detailed 24-Hour Hourly Profile
                </span>
                <span className="text-xs text-slate-400 font-medium">Selected Forecast Inspection</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                {selectedDay.fullDayLabel} — Microgrid Dispatch
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Hourly solar elevation, wind gust aerodynamics, campus baseline demand, and LiFePO₄ battery SOC trajectory.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-400">Total Generation</div>
                <div className="text-lg font-extrabold text-emerald-400">{selectedDay.totalRenewableKwh} kWh</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Campus Demand</div>
                <div className="text-lg font-extrabold text-purple-400">{selectedDay.campusDemandKwh} kWh</div>
              </div>
            </div>
          </div>

          {/* 24-Hour Continuous Area Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={selectedDay.hourlyBreakdown} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="hourLabel" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" kW" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '1rem',
                    color: '#f8fafc',
                  }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="solarKw" name="Solar PV (kW)" fill="#f59e0b" stroke="#f59e0b" fillOpacity={0.3} />
                <Area type="monotone" dataKey="windKw" name="Wind Turbine (kW)" fill="#0ea5e9" stroke="#0ea5e9" fillOpacity={0.25} />
                <Line type="monotone" dataKey="loadKw" name="Campus Load (kW)" stroke="#a855f7" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="batterySoc" name="Battery SOC (%)" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="4 4" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5">
              <span className="text-slate-400 font-medium">BESS Storage Envelope</span>
              <div className="text-sm font-bold text-white mt-1">
                {selectedDay.bessMinBufferSocPct}% Min <span className="text-slate-500 font-normal">to</span> {selectedDay.bessPeakChargeSocPct}% Max
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5">
              <span className="text-slate-400 font-medium">Grid Independence</span>
              <div className="text-sm font-bold text-emerald-400 mt-1">
                {selectedDay.selfSufficiencyPct}% Self-Powered
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5">
              <span className="text-slate-400 font-medium">Carbon Avoidance</span>
              <div className="text-sm font-bold text-teal-400 mt-1">
                {selectedDay.co2AvoidedKg} kg CO₂ saved
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 6. AI Scenario Modeling & Climate Stress-Testing Sliders */}
      <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 dark:border-cyan-500/15 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              AI Predictive Scenario Modeling & Stress-Testing
            </h2>
            <p className="text-xs text-slate-400">
              Simulate climate anomalies and campus load surges for upcoming days. Microgrid recalculates in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyPreset('heatwave')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            >
              ☀️ Heatwave AC Surge
            </button>
            <button
              onClick={() => applyPreset('monsoon')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
            >
              ⛈️ Monsoon Cloud Front
            </button>
            <button
              onClick={() => applyPreset('windstorm')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 transition-all"
            >
              💨 High Wind Gusts
            </button>
            <button
              onClick={() => applyPreset('weekend')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition-all"
            >
              🍃 Weekend Conservation
            </button>
            <button
              onClick={resetSliders}
              title="Reset sliders"
              className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-white/5 border border-white/10 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Cloud Cover Slider */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" /> Cloud Cover Anomaly
              </span>
              <span className="font-mono font-bold text-amber-400">
                {cloudCoverDelta > 0 ? `+${cloudCoverDelta}%` : `${cloudCoverDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min={-40}
              max={50}
              step={5}
              value={cloudCoverDelta}
              onChange={(e) => setCloudCoverDelta(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-40% Clear Sky</span>
              <span>Baseline (0%)</span>
              <span>+50% Overcast</span>
            </div>
          </div>

          {/* Wind Multiplier Slider */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-sky-400" /> Wind Velocity Multiplier
              </span>
              <span className="font-mono font-bold text-sky-400">{windMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.6}
              max={1.8}
              step={0.1}
              value={windMultiplier}
              onChange={(e) => setWindMultiplier(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.6x Stagnant</span>
              <span>1.0x Normal</span>
              <span>1.8x High Gale</span>
            </div>
          </div>

          {/* Campus Demand Multiplier Slider */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <BatteryCharging className="w-4 h-4 text-purple-400" /> Campus Load Multiplier
              </span>
              <span className="font-mono font-bold text-purple-400">{loadMultiplier.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.7}
              max={1.6}
              step={0.05}
              value={loadMultiplier}
              onChange={(e) => setLoadMultiplier(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.7x Vacation</span>
              <span>1.0x Standard</span>
              <span>1.6x Exam/Fest Surge</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Strategic AI Microgrid Advisory */}
      {summary && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-cyan-950/40 border border-emerald-500/25 shadow-2xl space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">
              AI Microgrid Dispatch Recommendations for {location.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Optimal Generation Peak
              </span>
              <p>
                <strong>{summary.bestGenerationDay.dayLabel}</strong> is projected as your highest yield day with{' '}
                <span className="text-emerald-400 font-bold">{summary.bestGenerationDay.totalKwh} kWh</span> clean energy.
                Ideal for energy-intensive campus tasks, battery calibration cycles, and EV fleet rapid charging.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Generation Dip & Caution Day
              </span>
              <p>
                <strong>{summary.lowestGenerationDay.dayLabel}</strong> experiences lowest generation yield ({summary.lowestGenerationDay.totalKwh} kWh).
                Recommend scheduling non-critical laboratory loads on prior days and pre-charging BESS to &ge; 85% during low-tariff overnight windows.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
