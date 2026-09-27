import { Link } from "react-router-dom";

// Drop into: frontend/src/pages/Terms.tsx
// Add route: <Route path="/terms" element={<Terms />} />

export default function Terms() {
  return (
    <div className="min-h-screen px-6 py-16 md:py-24">
      <div className="max-w-3xl mx-auto bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 md:p-12 shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Use</h1>
        <p className="text-sm opacity-70 mb-8">Last updated: [DATE]</p>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">About this project</h2>
          <p>
            EcoGrid AI was built as a submission for Smart India Hackathon 2026 (Problem
            Statement 26200). It is provided for demonstration and evaluation purposes.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">No warranty</h2>
          <p>
            Energy predictions and dashboard figures are generated from live weather data and AI
            models for illustrative purposes. They should not be relied on for real-world energy
            planning or financial decisions.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">Acceptable use</h2>
          <p>
            Don't use the chatbot or dashboard to submit unlawful, abusive, or harmful content.
            Access may be restricted if this is misused.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">Changes</h2>
          <p>
            These terms may be updated as the project develops. Continued use means you accept
            the current version.
          </p>
        </section>

        <Link
          to="/"
          className="inline-block mt-4 px-5 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
