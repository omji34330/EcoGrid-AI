import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Wind,
  Battery,
  Building,
  Zap,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import type { LiveTelemetry } from '../../types';

interface InteractiveEnergyFlowProps {
  telemetry: LiveTelemetry | null;
}

type NodeKey = 'solar' | 'wind' | 'battery' | 'inverter' | 'load';

export const InteractiveEnergyFlow: React.FC<InteractiveEnergyFlowProps> = ({ telemetry }) => {
  const [selectedNode, setSelectedNode] = useState<NodeKey>('inverter');

  const solarKw = telemetry?.solarOutputKw ?? 3.8;
  const windKw = telemetry?.windOutputKw ?? 1.4;
  const loadKw = telemetry?.currentLoadKw ?? 1.1;
  const batteryKw = telemetry?.batteryPowerKw ?? 2.1;
  const batterySoc = telemetry?.batterySocPct ?? 76;
  const isCharging = (telemetry?.batteryStatus ?? 'charging') === 'charging';

  const nodeDetails: Record<
    NodeKey,
    {
      title: string;
      subtitle: string;
      value: string;
      badge: string;
      description: string;
      humanImpact: string;
      color: string;
      icon: React.ReactNode;
    }
  > = {
    solar: {
      title: '5.0 kW Monocrystalline PV Array',
      subtitle: 'Bifacial High-Efficiency Generation',
      value: `${solarKw.toFixed(2)} kW`,
      badge: solarKw > 2.0 ? 'High Irradiance' : 'Low Angle / Dusk',
      description:
        'Converts incident photons directly into DC electricity through 14 bifacial mono-PERC modules (21.4% efficiency), derated for ambient temperature and clearness index.',
      humanImpact:
        'Generates enough daily energy to power ~24 student study stations and 4 high-performance AI workstations without producing a gram of soot.',
      color: 'from-amber-400 to-yellow-500',
      icon: <Sun className="w-5 h-5 text-amber-400" />,
    },
    wind: {
      title: '3.0 kW Aerodynamic Wind Turbine',
      subtitle: 'Horizontal-Axis Mechanical Generation',
      value: `${windKw.toFixed(2)} kW`,
      badge: `${telemetry?.windSpeed ?? 14} km/h Wind`,
      description:
        'Fluid aerodynamic three-blade rotor capturing kinetic breeze energy. Operates on a cubic velocity curve between 10 km/h cut-in and 45 km/h rated thresholds.',
      humanImpact:
        'Compensates for cloud cover and evening twilight, ensuring that evening study sessions and library ventilation continue uninterrupted.',
      color: 'from-cyan-400 to-sky-500',
      icon: <Wind className="w-5 h-5 text-cyan-400" />,
    },
    inverter: {
      title: 'EcoGrid Hybrid Bi-Directional Inverter',
      subtitle: 'Autonomous Microgrid Dispatch Core',
      value: '96.5% Eff.',
      badge: 'Grid Synchronized',
      description:
        'Converts DC power from solar and battery banks to clean 230V AC pure sine wave power while maintaining frequency and voltage harmonic distortion below 2.5%.',
      humanImpact:
        'Protects sensitive scientific instruments, ultrasound machines, and computers from brownouts, voltage sags, and grid surges.',
      color: 'from-emerald-400 to-teal-500',
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
    },
    battery: {
      title: '10.0 kWh LiFePO4 Energy Storage (BESS)',
      subtitle: isCharging ? 'Actively Storing Solar Surplus' : 'Discharging Clean Energy to Campus',
      value: `${batterySoc.toFixed(0)}% SOC (${batteryKw.toFixed(2)} kW)`,
      badge: isCharging ? 'Charging' : 'Discharging',
      description:
        'High-safety Lithium Iron Phosphate cells providing 4,000+ deep cycles. Automated BMS regulates cell balancing, thermals, and prevents over-discharge.',
      humanImpact:
        'Provides 8.5 hours of emergency backup for critical healthcare vaccine storage and emergency lamps during municipal blackout events.',
      color: 'from-emerald-400 to-green-500',
      icon: <Battery className="w-5 h-5 text-emerald-400" />,
    },
    load: {
      title: 'Campus & Community Facilities',
      subtitle: 'Demand Response & Clean Consumption',
      value: `${loadKw.toFixed(2)} kW`,
      badge: '18 kWh Daily Profile',
      description:
        'Simulated dynamic diurnal profile combining educational classrooms, medical cold storage, security lighting, and ventilation loads.',
      humanImpact:
        'Displaces 14,800 kg of thermal coal consumption and guarantees 99.8% power uptime for faculty and students.',
      color: 'from-purple-400 to-pink-500',
      icon: <Building className="w-5 h-5 text-purple-400" />,
    },
  };

  const active = nodeDetails[selectedNode];

  return (
    <div className="glass-panel p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white">Live Microgrid Energy Flow Schematic</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Interactive real-time power transfers — click any node to explore engineering details and human impact
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Active Power Balancing</span>
        </div>
      </div>

      {/* Visual Interactive Diagram Stage */}
      <div className="relative py-6 sm:py-8 px-2 sm:px-6 rounded-2xl bg-[#06101D]/70 border border-white/5 overflow-hidden">
        {/* SVG Flow Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Animated Connecting Wires */}
          <line
            x1="25%"
            y1="30%"
            x2="50%"
            y2="50%"
            stroke="rgba(245, 158, 11, 0.6)"
            strokeWidth="2.5"
            className="energy-line-solar"
          />
          <line
            x1="75%"
            y1="30%"
            x2="50%"
            y2="50%"
            stroke="rgba(14, 165, 233, 0.6)"
            strokeWidth="2.5"
            className="energy-line-wind"
          />
          <line
            x1="25%"
            y1="75%"
            x2="50%"
            y2="50%"
            stroke="rgba(16, 185, 129, 0.6)"
            strokeWidth="2.5"
            className="energy-line-battery"
          />
          <line
            x1="50%"
            y1="50%"
            x2="75%"
            y2="75%"
            stroke="rgba(168, 85, 247, 0.6)"
            strokeWidth="2.5"
            className="energy-line-load"
          />
        </svg>

        {/* Node Layout Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12 items-center justify-items-center max-w-2xl mx-auto">
          {/* Solar Node */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedNode('solar')}
            className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl transition-all duration-200 ${
              selectedNode === 'solar'
                ? 'bg-amber-500/20 border-2 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 border border-slate-700/60 hover:border-amber-400/50'
            }`}
          >
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 relative">
              <Sun className="w-6 h-6 animate-spin-slow" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-white">5 kW Solar PV</div>
              <div className="text-xs font-mono text-amber-400 font-bold">{solarKw.toFixed(1)} kW</div>
            </div>
          </motion.button>

          {/* Center: Inverter Node */}
          <div className="order-last sm:order-none col-span-2 sm:col-span-1">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedNode('inverter')}
              className={`flex flex-col items-center gap-2 p-4 sm:p-5 rounded-3xl transition-all duration-300 ${
                selectedNode === 'inverter'
                  ? 'bg-gradient-to-tr from-emerald-500/30 via-teal-500/20 to-cyan-500/30 border-2 border-emerald-400 shadow-xl shadow-emerald-500/30'
                  : 'bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400'
              }`}
            >
              <div className="p-3.5 rounded-2xl bg-emerald-500/25 text-emerald-300 relative">
                <Cpu className="w-8 h-8 animate-pulse" />
                <span className="absolute inset-0 rounded-2xl bg-emerald-400/20 animate-ping" />
              </div>
              <div className="text-center">
                <div className="text-xs font-extrabold text-white">Smart Inverter</div>
                <div className="text-[11px] font-mono text-emerald-400 font-bold">96.5% Eff.</div>
              </div>
            </motion.button>
          </div>

          {/* Wind Node */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedNode('wind')}
            className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl transition-all duration-200 ${
              selectedNode === 'wind'
                ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 border border-slate-700/60 hover:border-cyan-400/50'
            }`}
          >
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 relative">
              <Wind className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-white">3 kW Wind</div>
              <div className="text-xs font-mono text-cyan-400 font-bold">{windKw.toFixed(1)} kW</div>
            </div>
          </motion.button>

          {/* Battery Node */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedNode('battery')}
            className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl transition-all duration-200 ${
              selectedNode === 'battery'
                ? 'bg-emerald-500/20 border-2 border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 border border-slate-700/60 hover:border-emerald-400/50'
            }`}
          >
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 relative">
              <Battery className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-white">10 kWh BESS</div>
              <div className="text-xs font-mono text-emerald-400 font-bold">{batterySoc.toFixed(0)}% SOC</div>
            </div>
          </motion.button>

          {/* Empty center gap on mobile/desktop spacer */}
          <div className="hidden sm:block" />

          {/* Campus Load Node */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedNode('load')}
            className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl transition-all duration-200 ${
              selectedNode === 'load'
                ? 'bg-purple-500/20 border-2 border-purple-400 shadow-lg shadow-purple-500/20'
                : 'bg-slate-900/80 border border-slate-700/60 hover:border-purple-400/50'
            }`}
          >
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 relative">
              <Building className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-white">Campus Load</div>
              <div className="text-xs font-mono text-purple-400 font-bold">{loadKw.toFixed(1)} kW Demand</div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Selected Node Details & Human Impact Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedNode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/10">{active.icon}</div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white">{active.title}</h4>
                <p className="text-xs text-slate-400">{active.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-white">
                {active.badge}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                {active.value}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {active.description}
          </p>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider block">
                Human Impact & Purpose
              </span>
              <span className="text-slate-200 leading-relaxed">{active.humanImpact}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
