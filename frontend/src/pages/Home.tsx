import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sun,
  Wind,
  BatteryCharging,
  BarChart3,
  Bot,
  MapPin,
  Award,
  Activity,
  Cpu,
  Sparkles,
  Rotate3d,
} from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { LocationSelector } from '../components/layout/LocationSelector';
import { useLiveData } from '../hooks/useLiveData';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { LiveOperatorNarrator } from '../components/ui/LiveOperatorNarrator';
import { InteractiveEnergyFlow } from '../components/charts/InteractiveEnergyFlow';
import { CommunityImpactStories } from '../components/ui/CommunityImpactStories';
import { MicrogridDigitalTwin3D } from '../components/3d/MicrogridDigitalTwin3D';
import { Card3DTilt } from '../components/3d/Card3DTilt';
import { AtmosphereGlobe3D } from '../components/3d/AtmosphereGlobe3D';

export const Home: React.FC = () => {
  const { location } = useLocationContext();
  const { telemetry } = useLiveData();
  const [activeVisualizer, setActiveVisualizer] = useState<'3d' | 'schematic'>('3d');

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Animated Atmosphere / Aurora Grid Effect */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-cyan-500/20 blur-[130px] pointer-events-none animate-aurora" />
      <div className="absolute top-2/3 right-10 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[110px] pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none animate-float-delayed" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-16 md:pt-24 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* SIH 2026 Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-8 shadow-lg shadow-emerald-500/10 backdrop-blur-md"
        >
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Smart India Hackathon 2026</span>
          <span className="w-1 h-1 rounded-full bg-emerald-400" />
          <span className="text-slate-300">PS ID: 26200</span>
          <span className="w-1 h-1 rounded-full bg-emerald-400" />
          <span className="text-cyan-400">Software Category</span>
        </motion.div>

        {/* Humanized Operator Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-xs sm:text-sm font-semibold text-emerald-400 mb-3 tracking-wide uppercase flex items-center justify-center gap-1.5"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{greeting}, {location.name.split(',')[0]} Grid Operator</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.12]"
        >
          Smart Renewable Energy{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Intelligence Powered by AI
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          EcoGrid AI combines live meteorological telemetry, physics-informed solar and wind forecasting,
          battery storage analytics, and automated ESG carbon reporting for {location.name}'s clean energy transition.
        </motion.p>

        {/* Location & Node Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs text-slate-400"
        >
          <LocationSelector compact />

          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/60 font-mono text-[11px] text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>{location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E</span>
          </span>

          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-emerald-500/20 text-emerald-400 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Synced via Open-Meteo High-Res</span>
          </span>
        </motion.div>

        {/* 3D Holographic Location Globe Beacon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="my-3 flex justify-center"
        >
          <AtmosphereGlobe3D
            latitude={location.latitude}
            longitude={location.longitude}
            locationName={location.name}
          />
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <Activity className="w-5 h-5 group-hover:animate-pulse" />
            <span>View Live Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/prediction"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 dark:bg-white/5 hover:bg-white/15 backdrop-blur-md border border-slate-300 dark:border-white/15 text-slate-800 dark:text-white font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Run AI Prediction</span>
          </Link>
        </motion.div>
      </section>

      {/* Live Operator Narrative Bar (Humanized commentary on live grid state) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <LiveOperatorNarrator telemetry={telemetry} />
      </section>

      {/* Live Impact Statistics Strip with Animated Counters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 text-center interactive-card">
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">
              <AnimatedCounter value={96.2} decimals={1} suffix="%" />
            </div>
            <div className="text-xs uppercase font-semibold text-slate-400 mt-1">Grid Efficiency</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Low-loss inverter stage</div>
          </div>

          <div className="glass-panel p-5 text-center interactive-card">
            <div className="text-3xl font-extrabold text-cyan-400 font-mono">
              <AnimatedCounter value={0.82} decimals={2} suffix=" kg" />
            </div>
            <div className="text-xs uppercase font-semibold text-slate-400 mt-1">CO₂ Avoided / kWh</div>
            <div className="text-[11px] text-slate-500 mt-0.5">CEA India official baseline</div>
          </div>

          <div className="glass-panel p-5 text-center interactive-card">
            <div className="text-3xl font-extrabold text-amber-400 font-mono">
              <AnimatedCounter value={24} suffix="-Hr" />
            </div>
            <div className="text-xs uppercase font-semibold text-slate-400 mt-1">Predictive Horizon</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Physics-guided AI dispatch</div>
          </div>

          <div className="glass-panel p-5 text-center interactive-card">
            <div className="text-3xl font-extrabold text-purple-400 font-mono">
              <AnimatedCounter value={8.0} decimals={1} suffix=" kW" />
            </div>
            <div className="text-xs uppercase font-semibold text-slate-400 mt-1">Hybrid Capacity</div>
            <div className="text-[11px] text-slate-500 mt-0.5">5 kW Solar + 3 kW Wind</div>
          </div>
        </div>
      </section>

      {/* Interactive Microgrid Visualization Center: 3D Digital Twin & Schematic Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Interactive Power Visualization
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Live Microgrid Digital Twin & Flow
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Explore the 3D physics-rendered digital twin or switch to schematic energy conduits
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 self-start sm:self-auto shadow-lg backdrop-blur-md">
            <button
              onClick={() => setActiveVisualizer('3d')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeVisualizer === '3d'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Rotate3d className="w-4 h-4" />
              <span>3D Digital Twin</span>
            </button>
            <button
              onClick={() => setActiveVisualizer('schematic')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeVisualizer === 'schematic'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Schematic Flow</span>
            </button>
          </div>
        </div>

        {/* View Mode Rendering */}
        <AnimatePresence mode="wait">
          {activeVisualizer === '3d' ? (
            <motion.div
              key="3d-twin-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <MicrogridDigitalTwin3D telemetry={telemetry} />
            </motion.div>
          ) : (
            <motion.div
              key="schematic-flow-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <InteractiveEnergyFlow telemetry={telemetry} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Real Lives Touched in Kanpur (Community Impact Stories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CommunityImpactStories />
      </section>

      {/* Key Innovation Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Core Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
            Engineered for Autonomous Microgrid Management
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2">
            Eliminating reactive energy management with proactive meteorological modeling and AI forecasting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card3DTilt>
            <div className="glass-panel p-6 hover:border-emerald-500/30 transition-all duration-300 h-full">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Atmospheric Solar Modeling
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Dynamically computes solar zenith angles, daylight clearness attenuation, and mono-Si cell temperature derating across Kanpur's high-variance climate.
              </p>
            </div>
          </Card3DTilt>

          {/* Card 2 */}
          <Card3DTilt>
            <div className="glass-panel p-6 hover:border-cyan-500/30 transition-all duration-300 h-full">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Cubic Aerodynamic Wind Yield
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Models turbine fluid dynamics through a parameterized cubic curve (10 km/h cut-in to 45 km/h rated), capturing pre-monsoon convective winds.
              </p>
            </div>
          </Card3DTilt>

          {/* Card 3 */}
          <Card3DTilt>
            <div className="glass-panel p-6 hover:border-emerald-500/30 transition-all duration-300 h-full">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                <BatteryCharging className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                BESS Battery SOC Optimization
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Tracks 10 kWh LiFePO4 battery charge status with strict 15%–95% safe operational depth of discharge, scheduling storage ahead of evening peak load.
              </p>
            </div>
          </Card3DTilt>

          {/* Card 4 */}
          <Card3DTilt>
            <div className="glass-panel p-6 hover:border-purple-500/30 transition-all duration-300 h-full">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Verifiable ESG Carbon Audits
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Converts clean generation into certified Scope 2 carbon displacement using the official CEA 0.82 kg CO₂/kWh factor with one-click CSV export and print layouts.
              </p>
            </div>
          </Card3DTilt>

          {/* Card 5 */}
          <Card3DTilt>
            <div className="glass-panel p-6 hover:border-teal-500/30 transition-all duration-300 h-full">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-5">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                EcoGrid Copilot (Gemini-Powered)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                An intelligent energy assistant providing natural-language explanations of weather influence, microgrid health, and dispatch advice with resilient zero-failure fallback.
              </p>
            </div>
          </Card3DTilt>

          {/* Card 6 */}
          <Card3DTilt>
            <div className="glass-panel p-6 hover:border-emerald-500/30 transition-all duration-300 h-full">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                SIH 2026 Ready & IoT Scalable
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Architected to seamlessly accept physical smart meter and Modbus inverter streams, ready for physical deployment across institutional microgrids.
              </p>
            </div>
          </Card3DTilt>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.06]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            Operational Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
            How EcoGrid AI Works
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2">
            A continuous loop from atmospheric ingestion to proactive energy dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="glass-panel p-6 relative">
            <div className="text-xs font-extrabold text-emerald-400 mb-2">STAGE 01</div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Atmospheric Telemetry
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live meteorological ingestion of solar radiation, cloud coverage, temperature, pressure, and wind velocity from Open-Meteo every 60s.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-6 relative">
            <div className="text-xs font-extrabold text-cyan-400 mb-2">STAGE 02</div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Physics Model Calibration
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clearness index calculation and aerodynamic cubic conversion calculate precise kW potential for the 5 kW solar array and 3 kW turbine.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-6 relative">
            <div className="text-xs font-extrabold text-amber-400 mb-2">STAGE 03</div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Predictive Battery Balance
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hour-by-hour simulation balances generation against the 18 kWh/day site load, walking battery SOC to preserve evening reserve margins.
            </p>
          </div>

          {/* Step 4 */}
          <div className="glass-panel p-6 relative">
            <div className="text-xs font-extrabold text-purple-400 mb-2">STAGE 04</div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              ESG Audit & Dispatch
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generates actionable dispatch instructions, 0.82 kg/kWh carbon offset certification, and conversational insights via Gemini Copilot.
            </p>
          </div>
        </div>
      </section>

      {/* Reference Microgrid Specifications Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-panel-glow p-8 sm:p-10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/20">
                  SIH 2026 Reference System
                </span>
                <span className="text-xs text-slate-400">Declared Hardware Baseline</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Kanpur Clean Microgrid Testbed
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Operating under declared technical baseline parameters for academic and light-industrial facilities in Uttar Pradesh.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-slate-400 text-[10px]">SOLAR ARRAY</div>
                  <div className="font-bold text-emerald-400 text-sm">5.0 kW Bifacial</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-slate-400 text-[10px]">WIND TURBINE</div>
                  <div className="font-bold text-cyan-400 text-sm">3.0 kW HAWT</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-slate-400 text-[10px]">BATTERY BESS</div>
                  <div className="font-bold text-amber-400 text-sm">10 kWh LiFePO4</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-slate-400 text-[10px]">SITE LOAD</div>
                  <div className="font-bold text-purple-400 text-sm">18 kWh / Day</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-xl bg-emerald-500 text-white font-bold text-sm text-center shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all"
              >
                Inspect Live Dashboard
              </Link>
              <Link
                to="/reports"
                className="px-6 py-3.5 rounded-xl bg-white/10 text-white font-bold text-sm text-center hover:bg-white/20 transition-all border border-white/10"
              >
                View Sustainability Report
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
