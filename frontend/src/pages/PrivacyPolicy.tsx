import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, EyeOff, Server, ArrowLeft } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="glass-panel p-8 sm:p-12 space-y-8">
        <div className="border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Governance & Data Integrity</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Last Updated: September 2026 • EcoGrid AI Project (SIH 2026 PS ID 26200)
          </p>
        </div>

        {/* Core Privacy Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400">
              <EyeOff className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-white">No Accounts Required</div>
            <p className="text-xs text-slate-400">
              Freely access live dashboards and AI forecasts without creating accounts or revealing personal identities.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-cyan-500/10 text-cyan-400">
              <Server className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-white">Open Weather Telemetry</div>
            <p className="text-xs text-slate-400">
              Atmospheric data is retrieved directly from Open-Meteo's public API without forwarding browser tracking parameters.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-400">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-white">Secure AI Proxy</div>
            <p className="text-xs text-slate-400">
              Google Gemini API calls are strictly brokered server-side; API secrets are never exposed on client devices.
            </p>
          </div>
        </div>

        <section className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            1. Zero Personal Data Collection
          </h2>
          <p>
            EcoGrid AI is designed strictly as a clean-technology monitoring and optimization prototype for the <strong>Smart India Hackathon 2026</strong>. We do not collect, harvest, store, or sell any Personally Identifiable Information (PII) such as your name, email address, phone number, or geolocation.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            2. Atmospheric & Weather Data Source
          </h2>
          <p>
            Live meteorological data (irradiance, ambient temperature, relative humidity, barometric pressure, wind speed) is queried from the <strong>Open-Meteo Weather API</strong>. These queries target fixed geographic coordinates for Kanpur, Uttar Pradesh, India (26.4499°N, 80.3319°E). No user telemetry or IP tracking is exchanged during these requests.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            3. AI Assistant & Gemini Processing
          </h2>
          <p>
            Queries entered into the floating EcoGrid AI Assistant are forwarded to our secure FastAPI backend and processed via the Google Gemini API to return domain-specific renewable energy advice. User chat inputs are not stored in permanent databases, nor are they used to train third-party advertising profiles.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            4. Local Storage Preferences
          </h2>
          <p>
            To provide a persistent viewing experience, EcoGrid AI utilizes standard HTML5 browser <code>localStorage</code> solely to remember your chosen visual theme (Dark Mode vs Light Mode). This data remains strictly client-side on your local device.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            5. Contact Information
          </h2>
          <p>
            For inquiries regarding the EcoGrid AI architectural implementation or SIH 2026 Problem Statement 26200 submission, please reach out to the project maintainers via the official GitHub repository.
          </p>
        </section>

        <div className="pt-6 border-t border-white/10 flex justify-between items-center text-xs">
          <span className="text-slate-400">EcoGrid AI • Smart India Hackathon 2026</span>
          <Link
            to="/terms"
            className="text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            View Terms of Use →
          </Link>
        </div>
      </div>
    </div>
  );
};
