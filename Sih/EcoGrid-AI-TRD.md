# Technical Requirements Document (TRC)
## EcoGrid AI

**Smart India Hackathon 2026** · Problem Statement ID **26200** · Theme: *Renewable / Sustainable Energy* · Category: *Software*

---

## 1. Architecture Overview

Two independently deployable services:

```
Browser (React SPA)
   ├── fetches live weather directly ──► Open-Meteo Forecast API (no key)
   └── sends chat messages ──► FastAPI backend ──► Google Gemini API
```

The frontend never calls Gemini directly and never holds the API key — every chatbot request is proxied through the FastAPI backend, which is the only place `GEMINI_API_KEY` exists.

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + TypeScript, built with Vite |
| Styling | Tailwind CSS (custom emerald/night/solar/wind design tokens), glassmorphism UI, dark/light mode |
| Charts | Recharts (area, donut/pie, bar, radial gauge) |
| Animation | Framer Motion |
| Routing | React Router v6 |
| Icons | lucide-react |
| Backend framework | FastAPI (Python), served by Uvicorn |
| LLM integration | Google Gemini API, model `gemini-3.6-flash` |
| Config | python-dotenv (backend `.env`), Vite env vars (frontend `.env`) |
| External data | Open-Meteo Forecast API (weather, no auth required) |

## 3. Data Flow & Derived Metrics

- `useLiveData.ts` fetches Open-Meteo every 60 seconds: current conditions, next-24h hourly forecast, and trailing 7 days (`past_days=7`), with retry-with-backoff (3 attempts) on failure.
- `energyCalculations.ts` derives renewable-energy figures from that raw weather data against a declared reference system:
  - **Solar output** — a daylight bell curve (sunrise 06:00–sunset 18:30) scaled by cloud cover attenuation (`clearness = 1 − 0.75 × cloudCover%`).
  - **Wind output** — a simplified cubic turbine power curve (cut-in 10 km/h, rated 45 km/h, cut-out 90 km/h).
  - **Battery SOC** — walked forward hour-by-hour from a 50% baseline: `SOC += generation − reference load`, clamped to battery capacity.
  - **CO2 avoided** — cumulative renewable energy actually used (capped at load) × grid emission factor (0.82 kg CO2/kWh).

## 4. API Contract (Backend)

**POST `/api/chat`**
```json
// Request
{ "message": "string (1-2000 chars)", "history": [{ "role": "user|assistant", "content": "string" }] }

// Response
{ "reply": "string" }
```
Errors: `400` empty message · `500` Gemini key not configured · `502` upstream Gemini failure.

**GET `/api/health`**
```json
{ "status": "ok", "gemini_configured": true }
```

## 5. Project Structure

```
ecogrid-ai/
├── frontend/src/
│   ├── components/   # layout, ui, charts, dashboard, chatbot, team, home
│   ├── hooks/        # useLiveData.ts, useChat.ts, useTheme (via context)
│   ├── pages/         # Home, Dashboard, AIPrediction, Reports, Team
│   ├── utils/          # constants.ts, energyCalculations.ts
│   └── context/         # ThemeContext.tsx
└── server/
    ├── main.py          # FastAPI app, /api/chat, /api/health
    ├── requirements.txt
    └── .env.example
```

## 6. Non-Functional Requirements

- **Performance** — production bundle manually code-split (vendor / charts / motion chunks); no chunk exceeds Vite's 500 KB warning threshold; gzip total ≈ 220 KB.
- **Security** — Gemini API key lives only in backend environment variables, never sent to or readable by the client; CORS restricted to an explicit configured origin (`FRONTEND_ORIGIN`); chat message length capped server-side at 2000 characters.
- **Responsiveness** — mobile-first Tailwind layout; dark/light theme with system-preference detection and persistence.
- **Resilience** — live data hook retries transient network failures with exponential backoff before surfacing an error state with a manual retry action; UI shows loading skeletons rather than blank/mock content while data loads.

## 7. Deployment

| Component | Target | Required environment variables |
|---|---|---|
| Frontend | Static host (e.g. Render Static Site) | `VITE_API_BASE_URL` — public URL of the backend |
| Backend | Persistent web service (e.g. Render Web Service) — not a serverless function, since it runs a long-lived Uvicorn process | `GEMINI_API_KEY`, `GEMINI_MODEL`, `FRONTEND_ORIGIN` |

Note: free-tier backend hosting typically spins down after ~15 minutes idle, adding a 30–60s cold-start delay on the next request — worth a pre-demo warm-up ping.

## 8. Known Issues / Technical Debt

- `google-generativeai` (the Python SDK currently used) has reached end-of-support; Google recommends migrating to the newer `google-genai` package and, longer-term, the Interactions API. Functionality is currently unaffected but this should be scheduled.
- `gemini-2.5-flash` was retired for new API keys mid-development; the backend now targets `gemini-3.6-flash` via the `GEMINI_MODEL` environment variable, which should be re-checked against Google's current model lineup before the final demo.

## 9. Testing Performed

- `npm run build` (tsc project build + Vite production build) verified clean, zero errors.
- ESLint run across the frontend source: zero errors.
- Backend endpoints exercised directly via FastAPI's `TestClient`: health check, empty-message validation (422), missing-API-key handling (clean 500 rather than a crash), and CORS preflight for the configured frontend origin — all confirmed working as designed.
