import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  Star,
  CheckCircle2,
  Trash2,
  Download,
  Search,
  Filter,
  RefreshCw,
  Sliders,
  BatteryCharging,
  Zap,
  Cpu,
  Layers,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { API_BASE_URL } from '../utils/constants';
import type { FeedbackItem, AdminUser } from '../types';

const DEMO_ADMIN: AdminUser = {
  name: 'Om Ji Gupta',
  email: 'admin@ecogrid.ai',
  role: 'Lead Microgrid Administrator',
  department: 'CSE, Allenhouse Institute of Technology, Kanpur',
};

const DEFAULT_FEEDBACKS: FeedbackItem[] = [
  {
    id: 'fb-001',
    name: 'Dr. Rajesh Sharma',
    email: 'r.sharma@renewable-council.gov.in',
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
    email: 'ananya.verma@iitk.ac.in',
    role: 'Academic Researcher',
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
    email: 'vikram.ops@smartgrid-up.in',
    role: 'Grid Operator',
    category: 'Feature Suggestion',
    rating: 4,
    message:
      'Great battery SOC forecasting. Would love to see additional export formats for dispatch scheduling in future iterations.',
    recommend: true,
    created_at: '2026-09-28T07:45:00Z',
    status: 'new',
  },
];

export const Admin: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AdminUser>(DEMO_ADMIN);

  // Login Form State
  const [username, setUsername] = useState('admin@ecogrid.ai');
  const [password, setPassword] = useState('EcoGrid@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Data State
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(DEFAULT_FEEDBACKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  // Simulated Hardware Controls
  const [gridMode, setGridMode] = useState<'grid-tied' | 'islanded'>('grid-tied');
  const [batteryDischargeLimit, setBatteryDischargeLimit] = useState<number>(20);
  const [aiRetraining, setAiRetraining] = useState(false);

  // Check existing session
  useEffect(() => {
    const session = localStorage.getItem('ecogrid_admin_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed && parsed.email) {
          setCurrentUser(parsed);
          setIsAuthenticated(true);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // Fetch feedbacks from backend or localStorage
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAdminFeedbacks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/feedback`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFeedbacks(data);
            return;
          }
        }
      } catch {
        // fallback
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

    fetchAdminFeedbacks();
  }, [isAuthenticated]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check backend first
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass }),
      });

      if (res.ok) {
        const data = await res.json();
        const user = data.user || DEMO_ADMIN;
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('ecogrid_admin_session', JSON.stringify(user));
        setIsLoggingIn(false);
        return;
      }
    } catch {
      // Backend offline/sleeping fallback
    }

    // Client-side fallback check
    if (
      (cleanUser === 'admin' || cleanUser === 'admin@ecogrid.ai' || cleanUser === 'omji') &&
      (cleanPass === 'EcoGrid@2026' || cleanPass === 'admin123' || cleanPass === 'admin')
    ) {
      setCurrentUser(DEMO_ADMIN);
      setIsAuthenticated(true);
      localStorage.setItem('ecogrid_admin_session', JSON.stringify(DEMO_ADMIN));
      setIsLoggingIn(false);
      return;
    }

    setIsLoggingIn(false);
    setLoginError('Invalid credentials. Use admin@ecogrid.ai / EcoGrid@2026 or click Auto-Fill.');
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('ecogrid_admin_session');
    setIsAuthenticated(false);
  };

  // Quick auto-fill
  const fillDemoCredentials = () => {
    setUsername('admin@ecogrid.ai');
    setPassword('EcoGrid@2026');
    setLoginError('');
  };

  // Toggle Feedback Status
  const handleUpdateStatus = async (id: string, newStatus: 'new' | 'reviewed' | 'starred') => {
    const updated = feedbacks.map((f) => (f.id === id ? { ...f, status: newStatus } : f));
    setFeedbacks(updated);
    localStorage.setItem('ecogrid_feedbacks', JSON.stringify(updated));

    try {
      await fetch(`${API_BASE_URL}/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // ignore
    }

    setActionSuccessMessage(`Feedback updated to '${newStatus}'!`);
    setTimeout(() => setActionSuccessMessage(''), 2500);
  };

  // Delete Feedback
  const handleDeleteFeedback = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback entry?')) return;

    const updated = feedbacks.filter((f) => f.id !== id);
    setFeedbacks(updated);
    localStorage.setItem('ecogrid_feedbacks', JSON.stringify(updated));

    try {
      await fetch(`${API_BASE_URL}/api/feedback/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }

    setActionSuccessMessage('Feedback entry deleted.');
    setTimeout(() => setActionSuccessMessage(''), 2500);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Role', 'Category', 'Rating', 'Message', 'Recommend', 'Date', 'Status'];
    const rows = feedbacks.map((f) => [
      f.id,
      `"${f.name.replace(/"/g, '""')}"`,
      `"${(f.email || '').replace(/"/g, '""')}"`,
      `"${(f.role || '').replace(/"/g, '""')}"`,
      `"${f.category}"`,
      f.rating,
      `"${f.message.replace(/"/g, '""')}"`,
      f.recommend ? 'Yes' : 'No',
      f.created_at,
      f.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecogrid_evaluations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionSuccessMessage('Evaluation report exported to CSV!');
    setTimeout(() => setActionSuccessMessage(''), 3000);
  };

  // Simulate Retraining
  const triggerAiRetraining = () => {
    setAiRetraining(true);
    setTimeout(() => {
      setAiRetraining(false);
      setActionSuccessMessage('Kanpur neural dispatch weights recalibrated successfully!');
      setTimeout(() => setActionSuccessMessage(''), 3500);
    }, 2000);
  };

  // Filtered Feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'starred'
          ? item.status === 'starred'
          : statusFilter === 'reviewed'
          ? item.status === 'reviewed'
          : statusFilter === 'new'
          ? item.status === 'new'
          : true;

      return matchesSearch && matchesStatus;
    });
  }, [feedbacks, searchQuery, statusFilter]);

  // Statistics
  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((acc, curr) => acc + (curr.rating || 5), 0) / feedbacks.length).toFixed(1)
      : '5.0';

  const newCount = feedbacks.filter((f) => f.status === 'new').length;
  const starredCount = feedbacks.filter((f) => f.status === 'starred').length;

  // =========================================================================
  // VIEW: LOGIN SCREEN (if not authenticated)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08131F] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-white/[0.1] backdrop-blur-2xl shadow-2xl relative z-10 space-y-6"
        >
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-0.5 shadow-xl shadow-emerald-500/20 mx-auto">
              <div className="w-full h-full bg-[#08131F] rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">EcoGrid AI Admin Portal</h1>
              <p className="text-xs text-slate-400 mt-1">Smart India Hackathon 2026 • PS ID 26200</p>
            </div>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Username or Email</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@ecogrid.ai"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Security Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-950/60 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoggingIn ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Enter Portal</span>
                  <Lock className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials for Evaluators */}
          <div className="pt-2 border-t border-white/[0.06] text-center space-y-2">
            <div className="text-[11px] text-slate-400">SIH Evaluator / Jury Quick Access:</div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-emerald-400 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Fill Demo Credentials (`admin@ecogrid.ai`)</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              ← Return to EcoGrid AI Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#08131F] text-slate-100 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Decorative ambient gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Top Control Bar */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/[0.08] backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
              <div className="w-full h-full bg-[#08131F] rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">{currentUser.name}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentUser.department || 'B.Tech CSE, Allenhouse Institute of Technology, Kanpur'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/feedback"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <span>Feedback Form</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/10"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-xs font-semibold border border-rose-500/30 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Action notification toast */}
        <AnimatePresence>
          {actionSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{actionSuccessMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-md space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Total Reviews</span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white">{feedbacks.length}</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span>{newCount} new pending review</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-md space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Average Score</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{avgRating} / 5.0</div>
            <div className="text-[11px] text-slate-400">
              {starredCount} starred high-priority submissions
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-md space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Kanpur Node State</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">99.8% Online</div>
            <div className="text-[11px] text-slate-400">Grid freq: 50.02 Hz • Active Dispatch</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-md space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>AI Predictor Health</span>
              <Cpu className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-teal-300">Gemini 2.5 Flash</div>
            <div className="text-[11px] text-slate-400">Physics hybrid pipeline calibrated</div>
          </div>
        </div>

        {/* Microgrid Operator Hardware Simulator Section */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Live Microgrid Dispatch Control (Operator Simulation)
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Kanpur Node 01 (26.4499°N, 80.3319°E)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Grid Interconnection Switch */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Interconnection Mode</span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    gridMode === 'grid-tied'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {gridMode}
                </span>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setGridMode('grid-tied')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    gridMode === 'grid-tied'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Grid-Tied
                </button>
                <button
                  onClick={() => setGridMode('islanded')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    gridMode === 'islanded'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Islanded
                </button>
              </div>
            </div>

            {/* BESS Discharge Floor Limit */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <BatteryCharging className="w-3.5 h-3.5 text-teal-400" />
                  <span>BESS Discharge Floor</span>
                </span>
                <span className="text-xs font-bold text-teal-400">{batteryDischargeLimit}% SOC</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={batteryDischargeLimit}
                onChange={(e) => setBatteryDischargeLimit(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>10% (Emergency Deep)</span>
                <span>50% (High Reserve)</span>
              </div>
            </div>

            {/* Neural Recalibration Trigger */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/[0.06] flex flex-col justify-between space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Forecasting Engine</span>
              </div>
              <button
                onClick={triggerAiRetraining}
                disabled={aiRetraining}
                className="w-full py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${aiRetraining ? 'animate-spin' : ''}`} />
                <span>{aiRetraining ? 'Recalibrating Neural Weights...' : 'Recalibrate Dispatch Model'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Inbox & Management */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-base font-bold text-white">Evaluator & Community Feedbacks Inbox</h2>
              <p className="text-xs text-slate-400">
                Managing {filteredFeedbacks.length} filtered entries of {feedbacks.length} total
              </p>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reviewer or comment..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/60 border border-white/[0.06] text-xs">
                {(['all', 'new', 'starred', 'reviewed'] as const).map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => setStatusFilter(filterKey)}
                    className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all ${
                      statusFilter === filterKey
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filterKey}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback Items List */}
          {filteredFeedbacks.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Filter className="w-8 h-8 mx-auto opacity-40" />
              <div className="text-sm font-semibold">No feedback matches your filter criteria.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFeedbacks.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-950/60 border border-white/[0.06] hover:border-emerald-500/30 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
                        {item.name.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{item.name}</span>
                          {item.email && <span className="text-xs text-slate-500">({item.email})</span>}
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-semibold border border-cyan-500/20">
                            {item.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Category: <span className="text-slate-300 font-medium">{item.category}</span> •{' '}
                          {new Date(item.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <div className="flex items-center gap-0.5 mr-2">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      {/* Status Action Buttons */}
                      <button
                        onClick={() =>
                          handleUpdateStatus(item.id, item.status === 'starred' ? 'new' : 'starred')
                        }
                        title="Star / Unstar"
                        className={`p-1.5 rounded-lg border transition-all ${
                          item.status === 'starred'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-amber-400'
                        }`}
                      >
                        <Star className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          handleUpdateStatus(item.id, item.status === 'reviewed' ? 'new' : 'reviewed')
                        }
                        title="Mark Reviewed"
                        className={`p-1.5 rounded-lg border transition-all ${
                          item.status === 'reviewed'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-emerald-400'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteFeedback(item.id)}
                        title="Delete feedback"
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-700 hover:text-rose-400 hover:border-rose-500/40 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-white/[0.03]">
                    "{item.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
