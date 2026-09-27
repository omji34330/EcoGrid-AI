import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Zap,
  ChevronDown,
} from 'lucide-react';
import type { ChatMessage } from '../../types';
import { SUGGESTED_PROMPTS, API_BASE_URL } from '../../utils/constants';
import { useLocationContext } from '../../context/LocationContext';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content:
      "👋 Hello! I am the **EcoGrid AI Assistant**, your intelligent copilot for renewable microgrid operations (SIH 2026 – PS ID 26200).\n\nAsk me about solar irradiance, wind turbine curves, battery SOC management, or our 0.82 kg CO₂/kWh carbon offset math for your selected location!",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    source: 'gemini',
  },
];

export const EcoGridChatbot: React.FC = () => {
  const { location } = useLocationContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check backend health on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') setBackendOnline(true);
      })
      .catch(() => {
        setBackendOnline(false);
      });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          location_name: location.name,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'gemini',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Backend unavailable, using built-in client copilot engine:', err);
      // Instant graceful fallback
      const fallbackReply = generateClientFallbackResponse(textToSend, location.name);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'knowledge_base',
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
          className="relative p-4 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 border border-white/20 flex items-center justify-center transition-all duration-300"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Bot className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 border-2 border-[#08131F]" />
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[80vh] flex flex-col rounded-[24px] bg-[#0A1626]/95 dark:bg-[#0A1626]/95 backdrop-blur-2xl border border-cyan-500/25 shadow-2xl shadow-black/70 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-cyan-500/20 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-md">
                  <div className="w-full h-full bg-[#08131F] rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white">EcoGrid AI Copilot</h3>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {backendOnline ? 'Gemini 2.5' : 'Copilot Ready'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Kanpur Grid Ready • PS 26200</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  title="Clear conversation"
                  aria-label="Clear conversation"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Minimize chat"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex-shrink-0 flex items-center justify-center text-emerald-400">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-md'
                        : 'bg-white/[0.06] border border-white/10 text-slate-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">
                      {renderFormattedMessage(msg.content)}
                    </div>
                    <div
                      className={`text-[9px] mt-1.5 font-medium ${
                        msg.role === 'user' ? 'text-emerald-200 text-right' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex-shrink-0 flex items-center justify-center text-teal-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 items-center text-slate-400">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Bot className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex gap-1.5 overflow-x-auto no-scrollbar">
              {SUGGESTED_PROMPTS.slice(0, 3).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-300 transition-all text-left truncate max-w-[200px]"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-black/30 border-t border-white/10 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about solar, wind, battery SOC, or CO₂..."
                maxLength={2000}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send prompt to EcoGrid AI"
                className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Simple Markdown parser for clean chat formatting
function renderFormattedMessage(text: string) {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    // Bold parsing
    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    if (line.startsWith('• ') || line.startsWith('- ')) {
      return (
        <div key={idx} className="flex items-start gap-1.5 ml-1 my-0.5">
          <span className="text-emerald-400">•</span>
          <span dangerouslySetInnerHTML={{ __html: formattedLine.slice(2) }} />
        </div>
      );
    }
    if (line.trim() === '') {
      return <div key={idx} className="h-1.5" />;
    }
    return (
      <p
        key={idx}
        className="my-0.5"
        dangerouslySetInnerHTML={{ __html: formattedLine }}
      />
    );
  });
}

// Client-side fallback engine if backend is offline during judging
function generateClientFallbackResponse(query: string, locName: string = 'Kanpur, Uttar Pradesh'): string {
  const q = query.toLowerCase();
  const shortLoc = locName.split('(')[0].trim();

  if (q.includes('solar') || q.includes('sun') || q.includes('pv')) {
    return `☀️ **Solar Photovoltaic Modeling in ${shortLoc}:**\n\nEcoGrid AI models a **5 kW monocrystalline solar array** using real-time atmospheric clearness:\n• P_solar = P_rated × (1 - 0.75 × CloudCover) × sin(elevation)\n• Peak output reaches 4.2 to 4.8 kW around midday under clear skies at ${shortLoc}.`;
  } else if (q.includes('wind') || q.includes('turbine')) {
    return `💨 **3 kW Wind Turbine Dynamic Curve:**\n\nPower yield follows fluid aerodynamic cubic velocity:\n• **Cut-in speed:** 10 km/h (minimum generation threshold)\n• **Rated speed:** 45 km/h (reaches 3.0 kW nominal rating)\n• **Cut-out speed:** 90 km/h (feathered mechanical shutdown)\n• Formula: P = 3.0 × ((v - 10)/35)³`;
  } else if (q.includes('battery') || q.includes('soc') || q.includes('storage')) {
    return `🔋 **Battery Energy Storage System (BESS):**\n\nWe operate a **10.0 kWh Lithium Iron Phosphate (LiFePO4)** battery with ~92% round-trip efficiency.\n• Safe operational SOC window: **15% to 95%** to extend cell longevity (4,000+ cycles).\n• Excess daylight generation is stored to offset ${shortLoc}'s peak evening load.`;
  } else if (q.includes('co2') || q.includes('carbon') || q.includes('emission') || q.includes('offset')) {
    return `🌱 **Carbon Avoidance & ESG Verification:**\n\nWe adopt the official **Central Electricity Authority (CEA) India baseline of 0.82 kg CO₂/kWh**.\nEvery 100 kWh of clean renewable energy generated displaces 82 kg of coal-fired grid emissions, equivalent to planting ~4 mature trees!`;
  } else if (q.includes('sih') || q.includes('26200') || q.includes('problem')) {
    return `🏆 **Smart India Hackathon 2026 Aligned:**\n\n• **Problem Statement:** PS ID 26200\n• **Theme:** Renewable & Sustainable Energy\n• **Category:** Software\nEcoGrid AI delivers real-time visibility, automated 24-hour predictive dispatch, and ESG carbon auditing for decentralized Indian microgrids.`;
  } else if (q.includes('location') || q.includes('site') || q.includes('gps') || q.includes('where') || q.includes('kanpur')) {
    return `📍 **Active Microgrid Node: ${locName}:**\n\nEcoGrid AI streams live meteorological data and computes physics-based energy yields dynamically for ${shortLoc} as well as the SIH 2026 reference node in Kanpur (26.4499°N, 80.3319°E).`;
  } else {
    return `I specialize in renewable energy, microgrid operations, and EcoGrid AI analytics for ${shortLoc}. How can I assist you with solar, wind, battery storage, or clean energy forecasting today?`;
  }
}
