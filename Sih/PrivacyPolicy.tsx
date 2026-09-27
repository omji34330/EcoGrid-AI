import { Link } from "react-router-dom";

// Drop into: frontend/src/pages/PrivacyPolicy.tsx
// Add route: <Route path="/privacy" element={<PrivacyPolicy />} />
// Edit the sections below to match what EcoGrid AI actually collects.

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen px-6 py-16 md:py-24">
      <div className="max-w-3xl mx-auto bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 md:p-12 shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm opacity-70 mb-8">Last updated: [DATE]</p>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">What EcoGrid AI collects</h2>
          <p>
            EcoGrid AI is a demo application built for Smart India Hackathon 2026. It does not
            require an account or collect personal information to function. The dashboard pulls
            live weather data from the Open-Meteo public API to power its renewable-energy
            estimates — this request does not include any information that identifies you.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">The AI chatbot</h2>
          <p>
            Messages you send to the chatbot are forwarded to Google's Gemini API to generate a
            response. Avoid sharing personal or sensitive information in chat messages — treat
            it like a public demo assistant.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">Cookies &amp; local storage</h2>
          <p>
            EcoGrid AI may store your theme preference (dark/light mode) in your browser's local
            storage. This stays on your device and is never sent to our servers.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">Analytics</h2>
          <p>
            [If you add analytics — e.g. Google Analytics or Plausible — describe here what's
            tracked: page views, general location, device type. Remove this section if you skip
            analytics.]
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p>Questions about this policy? Reach the EcoGrid AI team at [CONTACT EMAIL].</p>
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
