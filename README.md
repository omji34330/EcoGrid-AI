# ⚡ EcoGrid AI — Smart Renewable Energy Intelligence
### Smart India Hackathon 2026 · Problem Statement ID: 26200
**Theme:** Renewable & Sustainable Energy | **Category:** Software | **Location:** Kanpur, Uttar Pradesh, India

[![SIH 2026](https://img.shields.io/badge/SIH_2026-PS_26200-10B981?style=for-the-badge&logo=target)](https://sih.gov.in)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)

---

## 🌍 Executive Summary

**EcoGrid AI** is an AI-powered renewable energy monitoring, weather-driven predictive dispatch, and sustainability analytics platform engineered for decentralized microgrids in India. 

Developed specifically for **Smart India Hackathon 2026 (Problem Statement ID 26200)**, the platform eliminates the critical operational deficit in distributed renewable energy systems. Instead of reactive operators struggling with sudden overcast spells or calm nights, EcoGrid AI leverages high-resolution meteorological telemetry and physics-informed models to generate a same-day 24-hour dispatch outlook, preserve battery storage, and provide verifiable ESG carbon reduction certificates.

---

## 🏛️ System Architecture

```
                                  [ Open-Meteo API ]
                              (Live atmospheric vectors)
                                          │
                                          ▼
[ Client Browser (React SPA) ] ──► [ useLiveData Hook ] ──► [ Physics Engine ]
 (Glassmorphism UI, Recharts,                                (Solar clearness,
  Framer Motion, Dark/Light)                                 cubic wind, BESS SOC)
         │
         │ (POST /api/chat)
         ▼
[ FastAPI Backend (Python) ] ──► [ Google Gemini 2.5 Flash ]
 (API Key Guard, CORS, Health,           (Secure AI Copilot)
  Physics Loss Explanation)                      │
                                                 ▼
                                     [ Intelligent Domain KB ]
                                     (Zero-failure fallback)
```

> **Security Guarantee:** The Google Gemini API key is maintained strictly server-side inside the FastAPI backend environment variables and is **never** exposed to the frontend bundle or client network inspect tab.

---

## ⚡ Reference Microgrid Hardware Baseline (Kanpur Site)

EcoGrid AI models the actual climatic and physical characteristics of **Kanpur, Uttar Pradesh (26.4499°N, 80.3319°E)** against a declared institutional testbed:

| Component | Technical Specification | Modeling Formula / Characteristic |
|---|---|---|
| **Solar PV Array** | 5.0 kW Bifacial Monocrystalline | $P_{\text{solar}} = P_{\text{rated}} \times (1 - 0.75 \times \text{CloudCover}) \times \sin(\theta_{\text{elevation}}) \times \eta_{\text{temp}}$ |
| **Wind Turbine** | 3.0 kW Horizontal Axis (HAWT) | Cubic aerodynamic power curve: $P = P_{\text{rated}} \times \left(\frac{v - 10}{35}\right)^3$ (Cut-in: 10 km/h, Rated: 45 km/h, Cut-out: 90 km/h) |
| **Battery Storage (BESS)** | 10.0 kWh Lithium Iron Phosphate (LiFePO4) | Round-trip efficiency 92%; strict safe Depth of Discharge (DOD) maintained between 15% and 95% SOC |
| **Site Base Demand** | 18.0 kWh / day Academic-Industrial Profile | Peak: 1.30 kW (daytime labs/HVAC), Baseline: 0.42 kW (night operations) |
| **Grid Offset Factor** | 0.82 kg CO₂ / kWh avoided | Official baseline from Central Electricity Authority (CEA) of India Baseline Carbon Database (Ver. 19) |

---

## 🖥️ Platform Modules & Pages

1. **Home (`/`)**:
   - Hero with animated particle atmosphere and glowing microgrid beacons.
   - Headline: *Smart Renewable Energy Intelligence Powered by AI*.
   - Live Kanpur Node status badge, live statistics strip, 6 core architecture pillars, 4-stage operational timeline, and declared hardware baseline specs.
2. **Live Dashboard (`/dashboard`)**:
   - Real-time Open-Meteo polling every 60 seconds with countdown timer, pause/resume toggle, and manual refresh button.
   - **5 Core Weather KPIs:** Temperature, Wind Speed, Cloud Cover, Humidity, and Air Pressure.
   - **4 Advanced Visualizations:** 24-hour weather & generation area chart, live energy mix donut chart, 7-day renewable generation bar chart, and battery state-of-charge circular radial gauge.
   - Shimmer skeleton loaders and automatic error recovery with retry action.
3. **AI Prediction (`/prediction`)**:
   - 24-hour predictive forecast: Expected Solar Output, Wind Generation Potential, Projected Battery Charge, and Carbon Reduction Score.
   - Model confidence indicator (94.2% high fidelity) and physics-based weather influence explainability.
   - **"Run Prediction"** action with animated processing state and celebratory feedback.
   - **What-If Scenario Simulator:** Interactive sliders for Cloud Cover delta, Wind Velocity multiplier, Base Demand multiplier, and Initial Battery SOC.
4. **Sustainability Reports (`/reports`)**:
   - Cumulative ESG metrics: Total Clean Energy Generated (MWh), CO₂ Avoided (Metric Tons), Renewable Contribution %, and Grid Efficiency %.
   - ESG impact scorecards: Forest sequestration tree equivalent, thermal coal burn prevented, and Scope 2 compliance.
   - 12-month historical generation vs carbon mitigation trend chart.
   - **Download CSV:** Exports timestamped 30-day hourly generation and carbon audit logs.
   - **Print Report:** Print-ready executive audit layout with formal verification sign-off.
5. **EcoGrid AI Assistant (Floating Chatbot)**:
   - Floating widget accessible from any page with pulsing online beacon.
   - Answers domain queries on solar clearness attenuation, wind turbine dynamics, battery state of charge (SOC), CEA carbon factors, and SIH 2026 specifications.
   - Politely redirects off-topic inquiries back to microgrid operations.
   - Backed by FastAPI `/api/chat` with Google Gemini 2.5 Flash and automatic client-side zero-failure fallback.
6. **Team Profile (`/team`)**:
   - Full SIH 2026 team credentials, roles, departments, technical skill tags, GitHub, LinkedIn, and deliverables.
7. **FAQ (`/faq`)**:
   - Expandable glassmorphism accordions addressing SIH judge inquiries (What is EcoGrid AI?, Where does live data come from?, How accurate are predictions?, Why Kanpur?, Can this support IoT?, etc.).
8. **Privacy Policy (`/privacy`)**:
   - Formal disclosures: No account required, public Open-Meteo weather telemetry, server-side Gemini proxy, local theme storage, zero PII collection.
9. **Terms of Use (`/terms`)**:
   - Demonstration purpose, physics-modeled AI estimates disclaimer, no commercial warranty, acceptable use, SIH attribution.
10. **Custom 404 (`*`)**:
    - "404 — Grid Not Found" with animated broken power node graphic and quick navigation back to safety.

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js** v18+ or v20+ (Node v24 tested)
- **Python** 3.10+ (Python 3.14 tested)

### 1. Backend Setup (FastAPI)
```bash
cd server
python -m venv .venv

# On Windows (PowerShell)
.\.venv\Scripts\Activate.ps1
# On macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt

# (Optional) Add your Gemini API key in server/.env
# If omitted, the server uses the built-in intelligent domain knowledge engine
uvicorn main:app --reload --port 8000
```
Backend will start on `http://localhost:8000`. Test health at `http://localhost:8000/api/health`.

### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend will launch on `http://localhost:5173`.

### 3. Production Build
```bash
cd frontend
npm run build
```
Generates an optimized, code-split production bundle in `frontend/dist/` with zero chunk warnings.

---

## 📡 API Reference

### `GET /api/health`
Returns service availability, Gemini model status, and site coordinates.
```json
{
  "status": "ok",
  "gemini_configured": true,
  "model": "gemini-2.5-flash",
  "site": "Kanpur, Uttar Pradesh, India",
  "coordinates": { "latitude": 26.4499, "longitude": 80.3319 }
}
```

### `POST /api/chat`
Proxies user query to Gemini Copilot with renewable energy system context.
```json
// Request
{
  "message": "How does cloud cover affect Kanpur solar output today?",
  "history": []
}

// Response
{
  "reply": "☀️ Solar Photovoltaic Modeling in Kanpur...",
  "source": "gemini",
  "timestamp": "2026-09-27T11:00:00Z"
}
```

### `POST /api/predict/explain`
Returns atmospheric factor decomposition and natural-language AI insights for a forecast scenario.

---

## 🏆 Smart India Hackathon 2026 Alignment

* **Problem Statement ID:** 26200
* **Theme:** Renewable & Sustainable Energy
* **Category:** Software
* **Location:** Kanpur, Uttar Pradesh, India

EcoGrid AI provides an end-to-end operational software blueprint demonstrating how Indian educational campuses, industrial corridors, and rural microgrids can leapfrog from reactive blackout management to autonomous, AI-driven clean energy self-consumption.

---

## 📋 EcoGrid AI Team Details

| Name | Role | Key Responsibility |
| :--- | :--- | :--- |
| **Om Ji Gupta** | Full Stack Developer | Frontend, Backend, UI/UX & AI Integration |
| **Mohd Faizan** | Product & Research Lead | Product Planning, Research & Documentation |
| **Mohammmad Uzair Ansari** | Team Leader | Team Coordination & Project Management |
| **Pritam Yadav** | Research Lead | Renewable Energy Research & Data Analysis |
| **Mohammad Farish Ansari** | Team Member | Development, Testing & Implementation |
| **Shivanshi Mishra** | Presentation | Demo Presentation & Communication |

