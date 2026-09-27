import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Scale, ArrowLeft } from 'lucide-react';

export const Terms: React.FC = () => {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Legal & Hackathon Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Terms of Use
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Last Updated: September 2026 • EcoGrid AI Project (SIH 2026 PS ID 26200)
          </p>
        </div>

        {/* Highlights banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Demonstration & Evaluation Prototype:</strong> EcoGrid AI is developed as a student engineering submission for Smart India Hackathon 2026 (Problem Statement 26200). Generation numbers, forecasts, and battery trajectories are physics-modeled estimations designed for evaluation purposes.
          </div>
        </div>

        <section className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            1. Demonstration & Evaluation Purpose
          </h2>
          <p>
            EcoGrid AI is provided solely for academic, research, and hackathon evaluation purposes in connection with <strong>Smart India Hackathon 2026 (PS ID 26200: Renewable & Sustainable Energy)</strong>. Access to this platform is made available free of charge to judges, evaluators, and the open-source community.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            2. Physics Model & AI Estimates Disclaimer
          </h2>
          <p>
            All solar PV power figures, wind turbine yields, battery state-of-charge projections, and carbon avoidance scores displayed on EcoGrid AI are computed via parametric physics models and Open-Meteo atmospheric forecasts against a declared 5 kW solar + 3 kW wind reference installation in Kanpur, India. They are not direct utility revenue-grade revenue meter readings and must not be used as the sole basis for high-voltage operational switching or commercial power trading.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            3. Disclaimer of Warranties
          </h2>
          <p>
            The software, user interface, AI predictions, and sustainability calculations are provided on an "as-is" and "as-available" basis, without warranties of any kind, either express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, or uninterrupted availability.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            4. Acceptable Use
          </h2>
          <p>
            Users agree not to exploit the platform or conversational assistant for malicious, abusive, or unlawful activities, including denial-of-service attacks, automated rate-limit abuse against upstream meteorological APIs, or prompt injections aimed at bypassing domain-specific renewable energy copilot boundaries.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            5. Intellectual Property & SIH Attribution
          </h2>
          <p>
            EcoGrid AI and its accompanying documentation are authored by the registered student team for Smart India Hackathon 2026. Proper attribution to the EcoGrid AI team and the Smart India Hackathon initiative is appreciated when referencing or adapting this project.
          </p>
        </section>

        <div className="pt-6 border-t border-white/10 flex justify-between items-center text-xs">
          <Link
            to="/privacy"
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            ← View Privacy Policy
          </Link>
          <Link
            to="/"
            className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
