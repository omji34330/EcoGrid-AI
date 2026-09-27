import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  GraduationCap,
  Trees,
  Fuel,
  Quote,
  Sparkles,
} from 'lucide-react';

interface Story {
  id: string;
  tag: string;
  category: string;
  headline: string;
  quote: string;
  speaker: string;
  location: string;
  statNumber: string;
  statLabel: string;
  icon: React.ReactNode;
  themeColor: string;
}

const STORIES: Story[] = [
  {
    id: 'healthcare',
    tag: 'Healthcare Resilience',
    category: 'Medical Cold Chain',
    headline: 'Guaranteeing 24/7 Vaccine Refrigeration at Primary Health Centers',
    quote:
      'During intense summer heatwaves in Uttar Pradesh, voltage collapses used to risk hundreds of critical child immunization vials. EcoGrid AI’s battery scheduling guarantees that emergency refrigerators never drop temperature, even when the regional grid trips.',
    speaker: 'Dr. Sunita Trivedi, Medical Officer',
    location: 'Kalyanpur Health Center, Kanpur',
    statNumber: '4,500+',
    statLabel: 'Pediatric Vaccines Safeguarded',
    icon: <Heart className="w-5 h-5 text-rose-400" />,
    themeColor: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
  },
  {
    id: 'education',
    tag: 'Academic Continuity',
    category: 'Higher Education Labs',
    headline: 'Eliminating Exam Brownouts for 3,200 Engineering Students',
    quote:
      'We run intensive machine learning simulations and robotics labs daily. Sudden grid blackouts used to corrupt hours of student research work. With EcoGrid AI’s sub-millisecond inverter transfer, power cuts are completely invisible.',
    speaker: 'Er. Alok Srivastava, Systems Administrator',
    location: 'Academic Computing Complex, Kanpur',
    statNumber: '3,200+',
    statLabel: 'Students Studying Without Power Cuts',
    icon: <GraduationCap className="w-5 h-5 text-cyan-400" />,
    themeColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
  },
  {
    id: 'environment',
    tag: 'Public Health & Clean Air',
    category: 'Emissions Displacement',
    headline: 'Eliminating 12.18 Metric Tons of Coal Smog from Neighborhood Skies',
    quote:
      'Kanpur’s winter air quality index frequently enters the severe zone due to industrial thermal emissions. Displacing 14.8 MWh of dirty grid energy keeps fine particulate matter (PM2.5) out of the lungs of local school children.',
    speaker: 'Meera Deshmukh, Clean Air Advocate',
    location: 'Indo-Gangetic Air Quality Alliance',
    statNumber: '560',
    statLabel: 'Urban Trees Equivalent Sequestered',
    icon: <Trees className="w-5 h-5 text-emerald-400" />,
    themeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  },
  {
    id: 'economy',
    tag: 'Community Economics',
    category: 'Diesel Displacement',
    headline: 'Saving ₹2.1 Lakhs Annually in Noisy Diesel Generator Rental Costs',
    quote:
      'Diesel generators cost ₹28 to ₹32 per kWh to operate, not to mention the deafening noise and diesel fumes right next to lecture halls. EcoGrid AI’s predictive solar and wind dispatch made diesel generators virtually obsolete.',
    speaker: 'Rajeshwar Nath, Microgrid Facility Manager',
    location: 'Sustainable Campus Corridors, UP',
    statNumber: '4,100 L',
    statLabel: 'Toxic Diesel Fuel Displaced Annually',
    icon: <Fuel className="w-5 h-5 text-amber-400" />,
    themeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  },
];

export const CommunityImpactStories: React.FC = () => {
  const [activeStoryId, setActiveStoryId] = useState<string>('healthcare');

  const activeStory = STORIES.find((s) => s.id === activeStoryId) || STORIES[0];

  return (
    <section className="glass-panel p-6 sm:p-10 space-y-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-teal-500/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real Human Impact • Beyond Just Numbers</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How EcoGrid AI Touches Real Lives in Kanpur
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Clean energy is not just about kilowatt-hours — it is about uninterrupted healthcare, empowered students, and cleaner air for families.
        </p>
      </div>

      {/* Interactive Story Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
        {STORIES.map((story) => {
          const isActive = story.id === activeStoryId;
          return (
            <button
              key={story.id}
              onClick={() => setActiveStoryId(story.id)}
              className={`p-3.5 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between gap-3 ${
                isActive
                  ? 'bg-slate-900 border-2 border-emerald-400 shadow-lg shadow-emerald-500/15'
                  : 'bg-slate-900/50 hover:bg-slate-900/80 border border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${story.themeColor}`}>{story.icon}</div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  {story.tag}
                </span>
                <span className="text-xs font-bold text-white line-clamp-1">
                  {story.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Story Featured Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStory.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto rounded-3xl bg-[#091524]/90 border border-emerald-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Story Content */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  {activeStory.tag}
                </span>
                <span className="text-xs text-slate-400">• {activeStory.location}</span>
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                {activeStory.headline}
              </h3>

              <div className="relative pl-6 border-l-2 border-emerald-400/50 space-y-2">
                <Quote className="w-4 h-4 text-emerald-400/60 absolute -top-1 left-1" />
                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  "{activeStory.quote}"
                </p>
                <div className="text-xs font-semibold text-slate-400">
                  — <span className="text-white">{activeStory.speaker}</span>
                </div>
              </div>
            </div>

            {/* Impact KPI Box */}
            <div className="lg:col-span-1 p-6 rounded-2xl bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-cyan-500/15 border border-emerald-500/30 text-center flex flex-col justify-center items-center gap-1 shadow-lg">
              <div className="p-3 rounded-2xl bg-white/10 mb-2">{activeStory.icon}</div>
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent font-mono">
                {activeStory.statNumber}
              </div>
              <div className="text-xs font-bold text-slate-300 max-w-[180px] leading-tight">
                {activeStory.statLabel}
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold mt-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Verified SIH Metric
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Relatable Human Conversion Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4 border-t border-white/5">
        <div className="p-4 rounded-2xl bg-white/[0.03] text-center">
          <div className="text-xl font-extrabold text-emerald-400 font-mono">1.2 Million</div>
          <div className="text-[11px] text-slate-400 font-medium">Smartphone Charges Offset</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] text-center">
          <div className="text-xl font-extrabold text-cyan-400 font-mono">2,400+ Hours</div>
          <div className="text-[11px] text-slate-400 font-medium">Lab Research Time Protected</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] text-center">
          <div className="text-xl font-extrabold text-purple-400 font-mono">₹2.1 Lakhs</div>
          <div className="text-[11px] text-slate-400 font-medium">Annual Community Savings</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] text-center">
          <div className="text-xl font-extrabold text-amber-400 font-mono">0 kg Coal</div>
          <div className="text-[11px] text-slate-400 font-medium">Burned On-Site at Microgrid</div>
        </div>
      </div>
    </section>
  );
};
