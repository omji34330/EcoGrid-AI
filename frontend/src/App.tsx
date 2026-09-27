import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LocationProvider } from './context/LocationContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { EcoGridChatbot } from './components/chatbot/EcoGridChatbot';
import { Zap } from 'lucide-react';

// Lazy-loaded routes for optimal code splitting & performance
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const AIPrediction = lazy(() => import('./pages/AIPrediction').then(m => ({ default: m.AIPrediction })));
const Reports = lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const Team = lazy(() => import('./pages/Team').then(m => ({ default: m.Team })));
const FAQ = lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const Terms = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

// Scroll restoration helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// Fallback loading indicator during route chunks load
function PageFallback() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-xl shadow-emerald-500/30 animate-pulse">
        <div className="w-full h-full bg-[#08131F] rounded-[14px] flex items-center justify-center">
          <Zap className="w-7 h-7 text-emerald-400" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-sm font-bold text-white tracking-wide">Connecting to Renewable Microgrid...</div>
        <div className="text-xs text-slate-400">Loading physics engine & atmospheric telemetry modules</div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-[#08131F] text-slate-100 selection:bg-emerald-500 selection:text-white">
            <Navbar />

          <main className="flex-grow">
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/prediction" element={<AIPrediction />} />
                <Route path="/ai-prediction" element={<AIPrediction />} />
                <Route path="/predictions" element={<AIPrediction />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/team" element={<Team />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />

          {/* Floating EcoGrid AI Assistant on all pages */}
          <EcoGridChatbot />
        </div>
      </Router>
      </LocationProvider>
    </ThemeProvider>
  );
}

export default App;
