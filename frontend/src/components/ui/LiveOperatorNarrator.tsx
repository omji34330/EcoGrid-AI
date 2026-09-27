import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Radio, ArrowRight, HeartHandshake } from 'lucide-react';
import type { LiveTelemetry } from '../../types';

interface LiveOperatorNarratorProps {
  telemetry: LiveTelemetry | null;
  onAskCopilot?: (query: string) => void;
}

export const LiveOperatorNarrator: React.FC<LiveOperatorNarratorProps> = ({
  telemetry,
  onAskCopilot,
}) => {
  const currentHour = new Date().getHours();

  // Dynamic greeting based on operator's local time
  const timeGreeting = useMemo(() => {
    if (currentHour >= 5 && currentHour < 12) return 'Good morning';
    if (currentHour >= 12 && currentHour < 17) return 'Good afternoon';
    if (currentHour >= 17 && currentHour < 21) return 'Good evening';
    return 'Night shift active';
  }, [currentHour]);

  // Humanized narrative generated from live telemetry vectors
  const narrative = useMemo(() => {
    if (!telemetry) {
      return {
        headline: 'Calibrating microgrid atmospheric telemetry...',
        body: 'Synchronizing real-time solar elevation, wind shear, and storage reserves.',
        impact: 'Protecting continuous clean power supply.',
      };
    }

    const {
      solarOutputKw,
      windOutputKw,
      currentLoadKw,
      batteryStatus,
      batterySocPct,
      temperature,
      weatherCondition,
      locationName,
    } = telemetry;

    const shortLoc = locationName.split('(')[0].trim();
    const isDaylight = currentHour >= 6 && currentHour <= 18;

    if (isDaylight && solarOutputKw > 2.5) {
      return {
        headline: `Sunlight is peaking over ${shortLoc} (${temperature}°C, ${weatherCondition})`,
        body: `Solar arrays are pumping ${solarOutputKw.toFixed(1)} kW directly into campus distribution, out-generating local demand by ${(solarOutputKw + windOutputKw - currentLoadKw).toFixed(1)} kW while storing surplus in the 10 kWh battery (${batterySocPct.toFixed(0)}% SOC).`,
        impact: `Powering ~18 classroom smartboards and 120 ceiling fans with 100% zero emissions.`,
      };
    } else if (windOutputKw > 1.2) {
      return {
        headline: `Convective winds active across ${shortLoc} (${telemetry.windSpeed} km/h)`,
        body: `Our 3 kW aerodynamic turbine is generating ${windOutputKw.toFixed(1)} kW of mechanical clean power, balancing diurnal fluctuations and stabilizing voltage frequencies.`,
        impact: `Displacing ₹340/hr in grid commercial tariff charges.`,
      };
    } else if (batteryStatus === 'discharging') {
      return {
        headline: `Evening battery dispatch active at ${shortLoc} (${batterySocPct.toFixed(0)}% SOC)`,
        body: `With dusk settled, our 10 kWh LiFePO4 storage bank is seamlessly discharging ${telemetry.batteryPowerKw.toFixed(1)} kW, eliminating the need to burn dirty diesel generator fuel during peak grid tariff hours.`,
        impact: `Ensuring uninterrupted power for campus medical clinic refrigeration and security lighting.`,
      };
    } else {
      return {
        headline: `Microgrid in balanced equilibrium at ${shortLoc}`,
        body: `Renewable sources and battery storage are precisely meeting the ${currentLoadKw.toFixed(1)} kW site demand. Inverter conversion efficiency is running at optimal 96.5%.`,
        impact: `Preventing 28 kg of atmospheric coal emissions every single hour.`,
      };
    }
  }, [telemetry, currentHour]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-cyan-950/40 border border-emerald-500/25 p-4 sm:p-5 backdrop-blur-xl shadow-xl shadow-emerald-950/20"
    >
      {/* Ambient background shimmer */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Voice of the Microgrid */}
        <div className="flex items-start gap-3.5">
          {/* Animated Dispatch Pulse / Soundwave */}
          <div className="relative shrink-0 mt-0.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-500/10">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            {/* 4-bar mini soundwave visualizer */}
            <div className="absolute -bottom-1 -right-1 flex items-end gap-0.5 px-1 py-0.5 rounded bg-[#08131F] border border-emerald-500/30">
              <span className="w-1 bg-emerald-400 rounded-full soundwave-bar-1" />
              <span className="w-1 bg-cyan-400 rounded-full soundwave-bar-2" />
              <span className="w-1 bg-teal-400 rounded-full soundwave-bar-3" />
              <span className="w-1 bg-emerald-400 rounded-full soundwave-bar-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Live Dispatch Narrative • {timeGreeting}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-500" />
              <span className="text-[11px] text-slate-400 font-mono">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {narrative.headline}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 leading-relaxed max-w-4xl">
              {narrative.body}
            </p>

            {/* Human Impact Pill */}
            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Real-life impact: <strong>{narrative.impact}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Action: Prompt AI assistant */}
        {onAskCopilot && (
          <div className="shrink-0 lg:self-center pl-12 lg:pl-0">
            <button
              onClick={() => onAskCopilot(`Explain the current microgrid dispatch strategy: ${narrative.headline}`)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-white text-xs font-semibold transition-all group"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask AI Copilot Details</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
