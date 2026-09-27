import { Link } from "react-router-dom";

// Drop into: frontend/src/pages/NotFound.tsx
// Add as the catch-all route, LAST in your router:
// <Route path="*" element={<NotFound />} />

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div className="max-w-md bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-10 shadow-xl">
        <div className="text-6xl mb-4">⚡</div>
        <h1 className="text-3xl font-bold mb-2">404 — Grid Not Found</h1>
        <p className="opacity-80 mb-8">
          Looks like this page went off the grid. Let's get you back to a live feed.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
