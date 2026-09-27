import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQS } from '../utils/constants';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [filter, setFilter] = useState<string>('all');

  const filteredFaqs = filter === 'all' ? FAQS : FAQS.filter((f) => f.category === filter);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base & SIH Defense</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Comprehensive answers on EcoGrid AI's real-time atmospheric telemetry, physics modeling, Gemini copilot architecture, and SIH 2026 problem scope.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
        {[
          { id: 'all', label: 'All Inquiries' },
          { id: 'general', label: 'Product & Vision' },
          { id: 'technical', label: 'Physics & Hardware' },
          { id: 'sih', label: 'SIH 2026 Scope' },
          { id: 'sustainability', label: 'Carbon & ESG' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === tab.id
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'glass-panel text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className={`glass-panel overflow-hidden transition-all duration-300 ${
                isOpen ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5' : ''
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="w-full text-left p-5 sm:p-6 flex justify-between items-center gap-4 font-bold text-slate-900 dark:text-white text-sm sm:text-base hover:text-emerald-400 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{faq.question}</span>
                </span>
                <span className="p-1 rounded-lg bg-white/5 text-slate-400 flex-shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-white/5">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer Support Card */}
      <div className="glass-panel p-6 sm:p-8 text-center space-y-4 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Still Have Technical Questions?
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Our built-in Gemini Renewable Energy Copilot is active on every page. Ask specific equations, Kanpur weather conditions, or hardware baseline queries anytime.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-2"
          >
            <span>Live Dashboard</span>
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-300 text-xs font-bold transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
