import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/ui/BrandIcons';
import { TEAM_MEMBERS } from '../utils/constants';

export const Team: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Smart India Hackathon 2026 Team</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Meet the Minds Behind <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">EcoGrid AI</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          A multidisciplinary engineering team bridging artificial intelligence, meteorological modeling, power systems engineering, and sustainability policy for SIH 2026 (Problem Statement ID 26200).
        </p>
      </div>

      {/* SIH Submission Credentials Card */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border-emerald-500/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="space-y-1 md:pr-4">
            <span className="text-[11px] font-bold uppercase text-slate-400">Problem Statement</span>
            <div className="text-lg font-bold text-white">PS ID: 26200</div>
            <div className="text-xs text-slate-400">SIH 2026 Software Edition</div>
          </div>
          <div className="space-y-1 md:px-4 pt-4 md:pt-0">
            <span className="text-[11px] font-bold uppercase text-slate-400">Assigned Theme</span>
            <div className="text-lg font-bold text-emerald-400">Renewable Energy</div>
            <div className="text-xs text-slate-400">Sustainable Generation & Dispatch</div>
          </div>
          <div className="space-y-1 md:px-4 pt-4 md:pt-0">
            <span className="text-[11px] font-bold uppercase text-slate-400">Target Benchmark</span>
            <div className="text-lg font-bold text-cyan-400">Kanpur, UP</div>
            <div className="text-xs text-slate-400">26.4499°N, 80.3319°E</div>
          </div>
          <div className="space-y-1 md:pl-4 pt-4 md:pt-0">
            <span className="text-[11px] font-bold uppercase text-slate-400">Submission Category</span>
            <div className="text-lg font-bold text-purple-400">Software & AI</div>
            <div className="text-xs text-slate-400">National Grand Finale Track</div>
          </div>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAM_MEMBERS.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="glass-panel overflow-hidden flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-300"
          >
            <div className="p-6 space-y-4">
              {/* Member Photo & Social Header */}
              <div className="flex items-start justify-between">
                {/* Member Initials Monogram Badge (No external images) */}
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:border-emerald-400/50 group-hover:scale-105 transition-all duration-300">
                  <span className="text-base font-extrabold tracking-wider bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                    {member.name
                      .split(' ')
                      .filter(Boolean)
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#08131F] border border-emerald-500/40 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-emerald-400" />
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name}'s GitHub profile`}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-500 transition-all text-xs"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name}'s LinkedIn profile`}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all text-xs"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Name & Role */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors">
                    {member.name}
                  </h3>
                  {member.role === 'Team Leader' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                      Team Leader
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-emerald-400 mt-0.5">
                  {member.role}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {member.department}
                </div>
              </div>

              {/* Key Responsibility Badge */}
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-xs">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 block mb-0.5">
                  Key Responsibility
                </span>
                <span className="font-semibold text-slate-200">
                  {member.keyResponsibility}
                </span>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {member.bio}
              </p>

              {/* Hackathon Contribution */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 text-[11px] text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-emerald-400">SIH Deliverable:</span> {member.sihContribution}
              </div>
            </div>

            {/* Skills Tags */}
            <div className="p-4 bg-black/20 border-t border-white/5 flex flex-wrap gap-1.5">
              {member.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
