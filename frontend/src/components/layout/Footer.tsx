import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ExternalLink, Heart, MapPin, Award } from 'lucide-react';
import { GithubIcon } from '../ui/BrandIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#050D17] border-t border-white/[0.08] dark:border-cyan-500/15 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-md shadow-emerald-500/20">
                <div className="w-full h-full bg-[#08131F] rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                EcoGrid <span className="text-emerald-400">AI</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              AI-powered renewable microgrid intelligence combining real-time atmospheric telemetry,
              physics-informed solar & wind forecasting, battery state-of-charge tracking, and verifiable ESG carbon auditing.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/20 text-emerald-400">
                <Award className="w-3.5 h-3.5" />
                <span>Smart India Hackathon 2026</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/20 text-cyan-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>Kanpur, Uttar Pradesh, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">
              Platform Modules
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Live Telemetry Dashboard
                </Link>
              </li>
              <li>
                <Link to="/prediction" className="hover:text-emerald-400 transition-colors">
                  AI Generation Forecast
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-emerald-400 transition-colors">
                  Sustainability Reports
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-emerald-400 transition-colors">
                  SIH 2026 Team Profile
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-emerald-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span>Evaluator Feedback</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 border border-emerald-500/30">New</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Open Source */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">
              Hackathon & Governance
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-300 font-semibold">PS ID: 26200</span>
              </li>
              <li>
                <span className="text-slate-400 text-xs">Theme: Renewable & Sustainable Energy</span>
              </li>
              <li>
                <Link to="/admin" className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-cyan-400 font-medium">
                  <span>Admin Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-400 transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li className="pt-2">
                <a
                  href="https://github.com/ecogrid-ai/ecogrid-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all text-xs"
                >
                  <GithubIcon className="w-4 h-4 text-emerald-400" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} EcoGrid AI. Developed for Smart India Hackathon 2026 (PS ID 26200). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Clean Energy India
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">CEA Baseline 0.82 kg CO₂/kWh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
