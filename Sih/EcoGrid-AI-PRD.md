# Product Requirements Document
## EcoGrid AI

**Smart India Hackathon 2026** · Problem Statement ID **26200** · Theme: *Renewable / Sustainable Energy* · Category: *Software*

---

## 1. Overview

EcoGrid AI is an AI-powered renewable energy monitoring and prediction platform. It gives a renewable microgrid site a single place to see current weather-driven generation conditions, a 24-hour AI forecast, and a running sustainability record — with a conversational assistant on hand to explain any of it.

## 2. Problem Statement

Problem Statement 26200 calls for innovative ideas that help manage and generate renewable/sustainable energy sources more efficiently. In practice, small and mid-sized renewable installations rarely have a dedicated energy analyst on staff. Operators are often reacting to conditions after the fact — a cloudy afternoon, a calm night — rather than planning around them, and they have no simple way to show stakeholders the actual environmental impact of the system.

## 3. Goals & Objectives

- Give operators live visibility into the conditions that drive generation (temperature, wind, cloud cover, humidity, pressure).
- Turn that data into a same-day forecast of solar output, wind potential, and battery charge, so load and storage decisions can be made ahead of time.
- Maintain a running, exportable sustainability record (energy generated, CO2 avoided, grid efficiency).
- Make the underlying concepts (SOC, cloud cover impact, carbon savings) accessible to non-technical stakeholders through a chatbot.

## 4. Target Users

| Persona | Need |
|---|---|
| Microgrid site operator | Same-day generation outlook to plan storage/load |
| Sustainability / ESG stakeholder | A clear, exportable impact summary |
| Hackathon evaluators | A working, demo-ready prototype that clearly addresses PS 26200 |

## 5. Scope — Core Features

| Page / Module | What it delivers |
|---|---|
| **Home** | Product overview, value proposition, how-it-works |
| **Dashboard** | Live KPIs (temp, wind, cloud cover, humidity, pressure) refreshed every 60s; 24h weather trend chart; live energy mix donut; 7-day generation trend; battery SOC gauge |
| **AI Prediction** | 24-hour forecast of expected solar output, wind potential, projected battery charge, and a carbon reduction score |
| **Reports** | Cumulative sustainability metrics (energy generated, CO2 saved, renewable contribution, grid efficiency) with CSV export |
| **Team** | Team profile for the SIH submission |
| **EcoGrid AI Assistant** | Floating chatbot (Gemini-backed) answering questions on solar, wind, battery health, and emissions |

## 6. Out of Scope (this version)

- No physical hardware/sensor integration — solar, wind, battery and CO2 figures are **modelled estimates** derived from live weather data against a declared reference system (5 kW solar array, 3 kW turbine, 10 kWh battery, 18 kWh/day load), not metered output. This is stated clearly in-product and in the README.
- Single monitored site (Kanpur, India) — no multi-site/multi-tenant support yet.
- No user accounts, authentication, or alerting/notifications yet.

## 7. Success Metrics

- A live, publicly reachable demo that a judge can open and interact with unassisted.
- Dashboard figures update automatically without a page refresh.
- The 24-hour prediction and sustainability report both reflect the current live weather data, not static placeholders.
- The assistant answers domain questions (solar, wind, battery, emissions) correctly and redirects off-topic questions back to the product.

## 8. Assumptions & Constraints

- Reference site: Kanpur, Uttar Pradesh (26.4499° N, 80.3319° E).
- Weather data depends on Open-Meteo's uptime (no key required, generous rate limits).
- Chatbot depends on Google Gemini API availability and a valid, currently-supported model (in active use: `gemini-3.6-flash`, since `gemini-2.5-flash` was retired for new API keys mid-project).
- India grid emission factor for CO2 calculations (0.82 kg CO2/kWh) is an illustrative, commonly cited baseline, not a site-specific measurement.

## 9. Future Roadmap

- Integrate real sensor/IoT data to replace or validate the modelled estimates.
- Support multiple sites and installation profiles.
- Persist historical data in a database instead of recomputing from live API windows.
- Add accounts, saved configurations, and threshold-based alerts (e.g., low battery, high grid draw).
- Native mobile companion app.
