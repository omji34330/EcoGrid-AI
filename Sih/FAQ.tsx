import { useState } from "react";
import { Link } from "react-router-dom";

// Drop into: frontend/src/pages/FAQ.tsx
// Add route: <Route path="/faq" element={<FAQ />} />
// Edit questions/answers to match your actual demo talking points.

const FAQS = [
  {
    q: "What does EcoGrid AI do?",
    a: "It's a renewable-energy monitoring dashboard that combines live weather data with AI predictions to estimate energy generation and usage patterns.",
  },
  {
    q: "Where does the data come from?",
    a: "Live weather data comes from the free Open-Meteo API. Predictions are generated using our AI model, and the chatbot is powered by Google Gemini.",
  },
  {
    q: "How accurate are the predictions?",
    a: "Predictions are estimates for demonstration purposes, based on current weather conditions and historical patterns — not guaranteed forecasts.",
  },
  {
    q: "Who built this?",
    a: "A student team for Smart India Hackathon 2026, Problem Statement 26200 (Renewable/Sustainable Energy). See the Team page for details.",
  },
  {
    q: "Can I use this for my own city or region?",
    a: "The current demo is configured for Kanpur, India, but the architecture supports swapping in coordinates for any location.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen px-6 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Frequently Asked Questions
        </h1>

        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <div
              key={i}
              className="bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-6 py-4 flex justify-between items-center font-medium"
                aria-expanded={open === i}
              >
                {item.q}
                <span className="ml-4">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <div className="px-6 pb-4 opacity-80">{item.a}</div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/"
            className="inline-block px-5 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
