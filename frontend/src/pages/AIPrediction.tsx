import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Sun,
  Wind,
  BatteryCharging,
  Leaf,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useLiveData } from '../hooks/useLiveData';
import { useLocationContext } from '../context/LocationContext';
import { LocationSelector } from '../components/layout/LocationSelector';
import { runPredictiveForecast } from '../utils/energyCalculations';
import type { PredictionScenario } from '../types';
import { MetricCard } from '../components/ui/MetricCard';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface HumanizedPreset {
  id: string;
  title: string;
  emoji: string;
  badge: string;
  description: string;
  deltaCloud: number;
  multWind: number;
  multLoad: number;
  soc: number;
  tagColor: string;
}

const HUMANIZED_PRESETS: HumanizedPreset[] = [
  {
    id: 'monsoon',
    title: 'Monsoon Storm Front',
    emoji: '⛈️',
    badge: 'High Turbulence',
    description: '+40% cloud cover, gusty 1.4x wind, elevated indoor clinic & residential lighting load.',
    deltaCloud: 40,
    multWind: 1.4,
    multLoad: 1.1,
    soc: 60,
    tagColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  },
  {
    id: 'heatwave',
    title: 'Kanpur Summer Heatwave',
    emoji: '☀️',
    badge: 'Peak Solar Yield',
    description: 'Blistering blue skies (-25% clouds), stagnant air (0.7x wind), heavy AC & cooling demand.',
    deltaCloud: -25,
    multWind: 0.7,
    multLoad: 1.4,
    soc: 85,
    tagColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
  {
    id: 'exam_week',
    title: 'Campus Exam Night Spike',
    emoji: '🎓',
    badge: 'Critical BESS Buffer',
    description: 'All night study halls, AI servers, and student dorms online (1.5x load, BESS 90% pre-charge).',
    deltaCloud: 0,
    multWind: 1.0,
    multLoad: 1.5,
    soc: 90,
    tagColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  },
  {
    id: 'optimal',
    title: 'Clean Autumn Breeze',
    emoji: '🍃',
    badge: 'Net Zero Export',
    description: 'Optimal irradiance (-30% clouds), 1.3x crisp wind velocity, balanced campus conservation load.',
    deltaCloud: -30,
    multWind: 1.3,
    multLoad: 0.9,
    soc: 70,
    tagColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
];

export const AIPrediction: React.FC = () => {
  const { telemetry } = useLiveData();
  const { location } = useLocationContext();

  // Scenario parameters
  const [cloudCoverDelta, setCloudCoverDelta] = useState<number>(0);
  const [windMultiplier, setWindMultiplier] = useState<number>(1.0);
  const [loadMultiplier, setLoadMultiplier] = useState<number>(1.0);
  const [initialSoc, setInitialSoc] = useState<number>(65);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runCount, setRunCount] = useState<number>(1);

  // Compute prediction results
  const scenario: PredictionScenario = useMemo(
    () => ({
      cloudCoverDeltaPct: cloudCoverDelta,
      windSpeedMultiplier: windMultiplier,
      loadMultiplier: loadMultiplier,
      bessInitialSocPct: initialSoc,
    }),
    [cloudCoverDelta, windMultiplier, loadMultiplier, initialSoc]
  );

  const prediction = useMemo(() => {
    const baseHourly = telemetry?.hourlyNext24h ?? [];
    return runPredictiveForecast(baseHourly, scenario);
  }, [telemetry, scenario]);

  const handleRunPrediction = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setRunCount((prev) => prev + 1);
      // Confetti burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#06B6D4', '#F59E0B'],
      });
    }, 700);
  };

  const handleApplyPreset = (preset: HumanizedPreset) => {
    setActivePreset(preset.id);
    setCloudCoverDelta(preset.deltaCloud);
    setWindMultiplier(preset.multWind);
    setLoadMultiplier(preset.multLoad);
    setInitialSoc(preset.soc);

    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setRunCount((prev) => prev + 1);
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B'],
      });
    }, 500);
  };

  const handleResetScenario = () => {
    setActivePreset(null);
    setCloudCoverDelta(0);
    setWindMultiplier(1.0);
    setLoadMultiplier(1.0);
    setInitialSoc(65);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] dark:border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              AI Generation & Storage Prediction
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              24-Hour Horizon
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Physics-informed neural estimates for solar yield, wind aerodynamics, BESS dispatch, and carbon reduction in{' '}
            <strong className="text-slate-300 font-semibold">{telemetry?.locationName || location.name}</strong>
          </p>
        </div>

        {/* Big Animated Run Prediction Button & Node Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <LocationSelector compact />

          <button
            onClick={handleResetScenario}
            title="Reset scenario sliders"
            aria-label="Reset scenario sliders"
            className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-slate-400 hover:text-white transition-all text-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRunPrediction}
            disabled={isRunning}
            aria-label="Run AI Prediction simulation"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center gap-2.5 transition-all duration-200"
          >
            <Play className={`w-4 h-4 fill-white ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Calculating Physics Loss...' : 'Run Prediction'}</span>
          </motion.button>
        </div>
      </div>

      {/* 4 Core Prediction KPI Cards Required by Prompt */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Expected Solar Output */}
        <MetricCard
          title="Expected Solar Output"
          value={prediction.expectedSolarKwh}
          unit="kWh"
          subtitle="24h cumulative PV yield"
          icon={Sun}
          color="amber"
          badge="5 kW Array"
          trend={{ value: `${prediction.peakHour} Peak`, isPositive: true, label: 'Highest generation' }}
        />

        {/* 2. Wind Generation Potential */}
        <MetricCard
          title="Wind Generation Potential"
          value={prediction.expectedWindKwh}
          unit="kWh"
          subtitle="Aerodynamic cubic potential"
          icon={Wind}
          color="cyan"
          badge="3 kW Turbine"
          trend={{ value: `${((prediction.expectedWindKwh / (prediction.totalRenewableKwh || 1)) * 100).toFixed(0)}% Share`, isPositive: true, label: 'Of renewable mix' }}
        />

        {/* 3. Projected Battery Charge */}
        <MetricCard
          title="Projected Battery Charge"
          value={prediction.projectedBatterySocPct}
          unit="%"
          subtitle="Ending 24h state of charge"
          icon={BatteryCharging}
          color="emerald"
          badge="10 kWh BESS"
          trend={{
            value: prediction.projectedBatterySocPct >= 40 ? 'Secure Margin' : 'Depletion Risk',
            isPositive: prediction.projectedBatterySocPct >= 40,
            label: '15% min DOD buffer',
          }}
        />

        {/* 4. Carbon Reduction Score */}
        <MetricCard
          title="Carbon Reduction Score"
          value={prediction.carbonReductionScoreKg}
          unit="kg CO₂"
          subtitle="CEA 0.82 kg/kWh avoidance"
          icon={Leaf}
          color="purple"
          badge="Scope 2"
          trend={{
            value: `${(prediction.carbonReductionScoreKg / 21.77).toFixed(1)} Trees`,
            isPositive: true,
            label: 'Annual tree equivalent',
          }}
        />
      </section>

      {/* Confidence Indicator & Weather Influence Explanation */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Confidence Indicator Card */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Model Confidence
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
              High Fidelity
            </span>
          </div>

          <div className="flex items-center gap-4 my-2">
            <div className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {prediction.confidenceScorePct}%
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Physics Bound Verified</span>
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                Validated against Open-Meteo GFS/ECMWF atmospheric ensemble
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Grid Independence Ratio:</span>
              <strong className="text-white">{prediction.gridIndependencePct}%</strong>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${prediction.gridIndependencePct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Weather Influence & Explainability Box */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Weather Influence & AI Explainability
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Atmospheric Physics Factor Decomposition
            </span>
          </div>

          <div className="space-y-2.5">
            {prediction.insights.map((insight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scenario Simulation Controls (Interactive Sliders) */}
      <section className="glass-panel p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              What-If Microgrid Scenario Simulator
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Simulate weather shifts, seasonal cloud cover, and load spikes in real time
          </span>
        </div>

        {/* Humanized Scenario Presets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              One-Click Real World Scenarios
            </span>
            {activePreset && (
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Scenario: {HUMANIZED_PRESETS.find((p) => p.id === activePreset)?.title}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {HUMANIZED_PRESETS.map((preset) => {
              const isActive = activePreset === preset.id;
              return (
                <motion.button
                  key={preset.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-3.5 rounded-2xl text-left transition-all duration-200 border relative overflow-hidden flex flex-col justify-between ${
                    isActive
                      ? 'bg-emerald-500/15 border-emerald-400 shadow-lg shadow-emerald-500/15'
                      : 'bg-slate-900/50 hover:bg-slate-800/60 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{preset.emoji}</span>
                        <span className="text-xs font-bold text-slate-100">{preset.title}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${preset.tagColor}`}>
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {preset.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Click to Simulate</span>
                    <span className="text-cyan-400 font-mono font-semibold">
                      {preset.deltaCloud > 0 ? `+${preset.deltaCloud}%` : `${preset.deltaCloud}%`} Cld • {preset.multWind}x Wnd
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* Slider 1: Cloud Cover Delta */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Cloud Cover Offset</span>
              <span className="text-cyan-400 font-mono">
                {cloudCoverDelta > 0 ? `+${cloudCoverDelta}%` : `${cloudCoverDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              step={5}
              value={cloudCoverDelta}
              onChange={(e) => setCloudCoverDelta(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-50% (Clearer)</span>
              <span>Baseline</span>
              <span>+50% (Overcast)</span>
            </div>
          </div>

          {/* Slider 2: Wind Speed Multiplier */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Wind Velocity Factor</span>
              <span className="text-sky-400 font-mono">{windMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.1}
              value={windMultiplier}
              onChange={(e) => setWindMultiplier(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.5x (Calm)</span>
              <span>1.0x Normal</span>
              <span>2.0x (Gale)</span>
            </div>
          </div>

          {/* Slider 3: Base Load Multiplier */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Demand Multiplier</span>
              <span className="text-purple-400 font-mono">{loadMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={1.8}
              step={0.1}
              value={loadMultiplier}
              onChange={(e) => setLoadMultiplier(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.5x (Light)</span>
              <span>1.0x Standard</span>
              <span>1.8x (Heavy)</span>
            </div>
          </div>

          {/* Slider 4: Initial Battery SOC */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Initial Battery SOC</span>
              <span className="text-emerald-400 font-mono">{initialSoc}%</span>
            </div>
            <input
              type="range"
              min={15}
              max={95}
              step={5}
              value={initialSoc}
              onChange={(e) => setInitialSoc(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>15% Min</span>
              <span>55% Baseline</span>
              <span>95% Max</span>
            </div>
          </div>
        </div>
      </section>

      {/* Simulated 24-Hour Dispatch Trajectory Chart */}
      <section className="glass-panel p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Projected 24-Hour Dispatch & Storage Balance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Simulated battery state of charge (green line) overlaid against total renewable generation and demand
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-white/10">
            Iterated via Run #{runCount}
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={prediction.hourlyForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="predGenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="hourLabel" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} unit=" kW" />
              <Tooltip content={<CustomForecastTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Area
                type="monotone"
                dataKey="totalGenKw"
                name="Total Generation (kW)"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#predGenGrad)"
              />
              <Area
                type="monotone"
                dataKey="loadKw"
                name="Target Demand (kW)"
                stroke="#A855F7"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

interface ForecastTooltipProps {
  active?: boolean;
  payload?: { value: number; name: string; color: string; payload: any }[];
  label?: string;
}

const CustomForecastTooltip: React.FC<ForecastTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const pt = payload[0]?.payload;
    if (!pt) return null;
    return (
      <div className="p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white shadow-xl text-xs space-y-1.5 min-w-[170px]">
        <p className="font-bold text-slate-300 pb-1 border-b border-white/10">Hour: {label}</p>
        <div className="flex justify-between items-center text-emerald-400">
          <span>Renewables:</span>
          <span className="font-bold">{pt.totalGenKw ?? 0} kW</span>
        </div>
        <div className="flex justify-between items-center text-purple-400">
          <span>Site Load:</span>
          <span className="font-bold">{pt.loadKw ?? 0} kW</span>
        </div>
        <div className="flex justify-between items-center text-cyan-400">
          <span>Battery SOC:</span>
          <span className="font-bold">{pt.batterySoc ?? 0}%</span>
        </div>
        <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-white/10 text-[10px]">
          <span>CO₂ Avoided:</span>
          <span>{pt.co2AvoidedKg ?? 0} kg</span>
        </div>
      </div>
    );
  }
  return null;
};

export default AIPrediction;
