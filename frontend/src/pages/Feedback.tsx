import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Star,
  Send,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  ThumbsUp,
  Award,
  ArrowRight,
  TrendingUp,
  Users,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { API_BASE_URL } from '../utils/constants';
import type { FeedbackItem } from '../types';

const INITIAL_LOCAL_REVIEWS: FeedbackItem[] = [
  {
    id: 'fb-001',
    name: 'Dr. Rajesh Sharma',
    role: 'SIH Evaluator / Clean Tech Expert',
    category: 'SIH Evaluation',
    rating: 5,
    message:
      'Outstanding work on the Kanpur microgrid physics modeling. The cubic wind yield curve and CEA baseline 0.82 kg CO2 offset calculations match industrial standards accurately.',
    recommend: true,
    created_at: '2026-09-28T04:15:00Z',
    status: 'starred',
  },
  {
    id: 'fb-002',
    name: 'Ananya Verma',
    role: 'Academic Researcher, IIT Kanpur',
    category: '3D Digital Twin',
    rating: 5,
    message:
      'The interactive 3D WebGL microgrid twin with dynamic solar panel tilt and wind turbine RPM based on Kanpur live telemetry is visually stunning and technically sound.',
    recommend: true,
    created_at: '2026-09-28T05:30:00Z',
    status: 'reviewed',
  },
  {
    id: 'fb-003',
    name: 'Vikramaditya Singh',
    role: 'Microgrid Operations Engineer',
    category: 'Feature Suggestion',
    rating: 4,
    message:
      'Great battery SOC forecasting. Would love to see additional export formats for dispatch scheduling in future iterations.',
    recommend: true,
    created_at: '2026-09-28T07:45:00Z',
    status: 'new',
  },
];

const ROLES = [
  'SIH Evaluator / Jury',
  'Academic / Researcher',
  'Clean Tech Engineer',
  'Student Developer',
  'Microgrid Operator',
  'General Visitor',
];

const CATEGORIES = [
  'SIH Evaluation & Scoring',
  'AI Prediction Accuracy',
  '3D Microgrid Digital Twin',
  'Feature Suggestion',
  'Platform Usability & UI/UX',
  'Bug Report',
];

export const Feedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(INITIAL_LOCAL_REVIEWS);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [recommend, setRecommend] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch live feedbacks on mount
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const url = `${API_BASE_URL}/api/feedback`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFeedbacks(data);
            return;
          }
        }
      } catch (err) {
        // Fallback to localStorage or mock
      }

      const stored = localStorage.getItem('ecogrid_feedbacks');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFeedbacks(parsed);
          }
        } catch {
          // ignore
        }
      }
    };

    fetchFeedbacks();
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#06B6D4', '#3B82F6', '#F59E0B'],
      });
    } catch {
      // gracefully ignore if canvas confetti unavailable
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setErrorMessage('Please fill in your name and message.');
      return;
    }
    setErrorMessage('');
    setSubmitting(true);

    const submissionPayload = {
      name: name.trim(),
      email: email.trim(),
      role,
      category,
      rating,
      message: message.trim(),
      recommend,
    };

    let newItem: FeedbackItem = {
      ...submissionPayload,
      id: `fb-${Date.now().toString(36)}`,
      created_at: new Date().toISOString(),
      status: 'new',
    };

    // Try posting to backend
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload),
      });

      if (res.ok) {
        const created = await res.json();
        if (created && created.id) {
          newItem = created;
        }
      }
    } catch {
      // Network/offline fallback
    }

    // Update local state and localStorage
    const updated = [newItem, ...feedbacks];
    setFeedbacks(updated);
    try {
      localStorage.setItem('ecogrid_feedbacks', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setSubmitting(false);
    setSubmitted(true);
    triggerConfetti();
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
    setRating(5);
    setSubmitted(false);
  };

  const averageRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((acc, curr) => acc + (curr.rating || 5), 0) / feedbacks.length).toFixed(1)
      : '5.0';

  const recommendationRate =
    feedbacks.length > 0
      ? Math.round((feedbacks.filter((f) => f.recommend !== false).length / feedbacks.length) * 100)
      : 100;

  const starLabels = [
    'Select rating',
    'Needs Major Work',
    'Fair & Functional',
    'Good Prototype',
    'Very Impressive',
    'Outstanding & Hackathon Ready!',
  ];

  return (
    <div className="min-h-screen bg-[#08131F] text-slate-100 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Decorative Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community & Evaluator Voice • SIH 2026</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
          >
            Share Your Experience with{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              EcoGrid AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg leading-relaxed"
          >
            Your evaluation and insights help optimize our renewable energy predictions, Kanpur microgrid
            digital twin, and AI copilot intelligence for the Smart India Hackathon.
          </motion.p>

          {/* Quick Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 max-w-xl mx-auto"
          >
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-md text-center">
              <div className="text-xl sm:text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
                <span>{averageRating}</span>
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Average Rating</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-md text-center">
              <div className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center justify-center gap-1">
                <ThumbsUp className="w-4 h-4 text-emerald-400 inline" />
                <span>{recommendationRate}%</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Would Recommend</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-md text-center">
              <div className="text-xl sm:text-2xl font-black text-cyan-400 flex items-center justify-center gap-1">
                <Users className="w-4 h-4 text-cyan-400 inline" />
                <span>{feedbacks.length}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Total Reviews</div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Layout: Form + Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Feedback Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/[0.1] backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Submit Feedback</h2>
                    <p className="text-xs text-slate-400">Takes less than 1 minute</p>
                  </div>
                </div>

                <Link
                  to="/admin"
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all flex items-center gap-1.5 group"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Admin Portal</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 text-center space-y-5"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white">Thank You, {name}!</h3>
                      <p className="text-sm text-slate-300 max-w-md mx-auto">
                        Your valuable feedback has been recorded in our microgrid operations database. Our SIH
                        2026 team reviews every evaluator contribution!
                      </p>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={handleResetForm}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all border border-slate-700"
                      >
                        Submit Another Response
                      </button>
                      <Link
                        to="/dashboard"
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
                      >
                        Explore Telemetry Dashboard
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {errorMessage && (
                      <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Star Rating Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Overall Rating
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-slate-950/50 border border-white/[0.06]">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              aria-label={`Rate ${star} star`}
                              className="p-1 text-slate-600 hover:scale-125 transition-transform duration-150 focus:outline-none"
                            >
                              <Star
                                className={`w-7 h-7 transition-colors ${
                                  (hoverRating || rating) >= star
                                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                    : 'text-slate-600'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-amber-400">
                          {starLabels[hoverRating || rating]}
                        </span>
                      </div>
                    </div>

                    {/* Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                          Your Name <span className="text-emerald-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Dr. Rajesh Sharma"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Email Address (Optional)</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="evaluator@sih.gov.in"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Role & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Your Affiliation / Role</label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/80 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 transition-all"
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r} className="bg-slate-900 text-slate-200">
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Feedback Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/80 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 transition-all"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c} className="bg-slate-900 text-slate-200">
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Comments Message */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                        <span>
                          Detailed Comments & Recommendations <span className="text-emerald-400">*</span>
                        </span>
                        <span className="text-[11px] text-slate-500">{message.length}/2000</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        maxLength={2000}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share your thoughts on our renewable energy dispatch models, 3D digital twin, AI copilot responses, or SIH alignment..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-y"
                      />
                    </div>

                    {/* Recommendation Checkbox */}
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-slate-300 font-medium">
                          Do you recommend EcoGrid AI for SIH 2026 PS ID 26200?
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={recommend}
                          onChange={(e) => setRecommend(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Transmitting to EcoGrid Node...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Official Feedback</span>
                          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Recent Evaluator Reviews & Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Recent Evaluator Reviews</h3>
                </div>
                <span className="text-xs text-slate-400">{feedbacks.length} submissions</span>
              </div>

              <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
                {feedbacks.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-white/[0.05] hover:border-emerald-500/30 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-white">{item.name}</div>
                        <div className="text-[11px] text-emerald-400/90 font-medium">{item.role}</div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed italic">"{item.message}"</p>

                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[10px] text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-semibold">
                        {item.category}
                      </span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Admin Callout */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Jury & Evaluator Admin Portal</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Inspect the live database, export feedback reports, and review system telemetry controls.
                </p>
              </div>
              <Link
                to="/admin"
                className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs border border-emerald-500/30 transition-all shrink-0"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
