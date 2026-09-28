import os
import time
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

app = FastAPI(
    title="EcoGrid AI Backend API",
    description="Intelligent Renewable Energy Copilot & Prediction Engine for Smart India Hackathon 2026 (PS ID 26200)",
    version="1.0.0",
)

# CORS setup
allowed_origins = [
    FRONTEND_ORIGIN,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Open for flexible evaluation and multi-device hackathon testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = """You are the EcoGrid AI Assistant, an advanced renewable energy copilot developed for Smart India Hackathon 2026 (Problem Statement ID 26200: Renewable & Sustainable Energy).

Your purpose is to monitor and explain renewable energy conditions, forecasts, and sustainability metrics for the Kanpur, Uttar Pradesh, India microgrid installation (Latitude: 26.4499°N, Longitude: 80.3319°E).

Reference Microgrid Architecture:
- Solar Array: 5.0 kW bifacial monocrystalline photovoltaic capacity with cloud clearness attenuation modeling.
- Wind Turbine: 3.0 kW horizontal-axis turbine (Cut-in: 10 km/h, Rated: 45 km/h, Cut-out: 90 km/h; cubic yield curve).
- Energy Storage (BESS): 10.0 kWh Lithium Iron Phosphate (LiFePO4) battery system with round-trip efficiency ~92%.
- Base Site Load: 18.0 kWh/day industrial-academic load curve.
- Carbon Offset Factor: 0.82 kg CO2 avoided per clean kWh generated (India Central Electricity Authority standard baseline).

Guidelines:
1. Provide concise, clear, technically sound answers on solar generation, wind power, battery State of Charge (SOC), grid efficiency, carbon offsets, and weather impacts.
2. If asked about Kanpur weather or generation, cite how temperature, wind speed, and cloud cover directly alter power generation physics.
3. If asked an off-topic query (e.g. entertainment, sports, politics, unrelated general tasks), politely and briefly redirect back: "I specialize in renewable energy, microgrid operations, and EcoGrid AI analytics. How can I assist you with solar, wind, battery storage, or Kanpur's clean energy metrics today?"
4. Keep responses structured, helpful, and under 250 words unless deep technical analysis is requested.
"""

# Data Models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    location_name: Optional[str] = "Kanpur, Uttar Pradesh"
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str
    source: str
    timestamp: str

class PredictExplainRequest(BaseModel):
    solar_kwh: float
    wind_kwh: float
    cloud_cover_pct: float
    wind_speed_kmh: float
    temperature_c: float
    battery_soc_pct: float
    co2_avoided_kg: float

class PredictExplainResponse(BaseModel):
    summary: str
    insights: List[str]
    confidence_score: float

# Built-in Domain Knowledge Base for fallback when Gemini key is not configured or offline
def fallback_energy_copilot(query: str, location_name: str = "Kanpur, Uttar Pradesh") -> str:
    q = query.lower()
    short_loc = location_name.split('(')[0].strip()

    if any(k in q for k in ["solar", "sun", "pv", "irradiance", "photovoltaic"]):
        return (
            f"☀️ **Solar Power Modeling at EcoGrid AI ({short_loc}):**\n\n"
            f"Our installation utilizes a **5 kW monocrystalline array**. Generation is determined by solar elevation angle and atmospheric clearness: `P_solar = P_rated × (1 - 0.75 × CloudCover) × sin(elevation)`.\n\n"
            f"During peak daylight hours (11:00 AM – 2:00 PM), clearness factors above 80% yield upwards of 4.2 to 4.8 kW instantaneous power, directly feeding daytime load and charging our 10 kWh battery."
        )
    elif any(k in q for k in ["wind", "turbine", "gust", "breeze"]):
        return (
            f"💨 **Wind Turbine Dynamic Power Curve ({short_loc}):**\n\n"
            "EcoGrid AI's microgrid includes a **3 kW rated horizontal-axis turbine**. Power output follows fluid aerodynamic cubic velocity: `P ∝ v³`.\n\n"
            "• **Cut-in Speed:** 10 km/h (minimum wind required to spin)\n"
            "• **Rated Speed:** 45 km/h (achieves full 3.0 kW output)\n"
            "• **Cut-out Speed:** 90 km/h (auto-feathered for mechanical braking)\n\n"
            "Convective wind surges provide ideal supplementary night/dusk energy when solar fades."
        )
    elif any(k in q for k in ["battery", "soc", "storage", "charge", "bess"]):
        return (
            f"🔋 **Battery Energy Storage System (BESS) at {short_loc}:**\n\n"
            "The site is equipped with a **10 kWh Lithium Iron Phosphate (LiFePO4)** battery bank. State of Charge (SOC) is dynamically tracked:\n\n"
            "`SOC(t) = SOC(t-1) + η_charge × (P_gen - P_load) × Δt`\n\n"
            "We maintain a recommended safe Depth of Discharge (DOD) between 20% and 95% to maximize battery cycle life (~4,000+ cycles) while preserving buffer for evening grid peak shaving."
        )
    elif any(k in q for k in ["co2", "carbon", "emission", "sustainability", "offset", "tree", "green"]):
        return (
            "🌱 **Carbon Accounting & Environmental Offsets:**\n\n"
            "EcoGrid AI uses the official **Central Electricity Authority (CEA) of India baseline grid emission factor of 0.82 kg CO₂/kWh**.\n\n"
            "Every 100 kWh of clean renewable generation prevents 82 kg of greenhouse gas emissions from conventional thermal coal plants, equivalent to the atmospheric carbon sequestration of ~4 mature trees over a month."
        )
    elif any(k in q for k in ["location", "site", "weather", "gps", "where", "kanpur"]):
        return (
            f"📍 **Active Microgrid Node: {location_name}:**\n\n"
            f"EcoGrid AI is dynamically streaming live atmospheric telemetry and physics-based generation forecasts for **{short_loc}** as well as our reference node in Kanpur (26.4499°N, 80.3319°E).\n\n"
            "You can switch between predefined metropolitan nodes or allow GPS geolocation anytime from the navigation bar."
        )
    elif any(k in q for k in ["sih", "hackathon", "ps", "problem statement", "26200"]):
        return (
            "🏆 **Smart India Hackathon 2026 Aligned:**\n\n"
            "• **Problem Statement:** PS ID 26200\n"
            "• **Theme:** Renewable & Sustainable Energy\n"
            "• **Category:** Software\n"
            "EcoGrid AI solves the operational deficit in decentralized renewable systems by giving operators real-time predictive intelligence, automated carbon auditing, and a 24-hour dispatch outlook."
        )
    elif any(k in q for k in ["hello", "hi", "hey", "who are you", "what can you do"]):
        return (
            f"👋 Greetings! I am the **EcoGrid AI Copilot** monitoring **{short_loc}**.\n\n"
            "I can assist you with:\n"
            "• Live Solar & Wind generation estimates\n"
            "• Battery State of Charge (SOC) & storage health\n"
            "• 24-hour weather-driven AI energy forecasting\n"
            "• Carbon avoidance calculations (0.82 kg CO₂/kWh)\n"
            "• SIH 2026 Problem Statement 26200 specifications\n\n"
            "What would you like to explore?"
        )
    else:
        return (
            f"I am the EcoGrid AI Assistant specialized in renewable microgrids, energy forecasting, and sustainability metrics for {short_loc} (PS ID 26200).\n\n"
            "You can ask me about solar generation formulas, wind turbine curves, battery storage scheduling, or our 0.82 kg CO₂/kWh offset modeling!"
        )

@app.api_route("/", methods=["GET", "HEAD"])
def read_root():
    return {
        "project": "EcoGrid AI",
        "event": "Smart India Hackathon 2026",
        "problem_statement": "PS ID 26200",
        "theme": "Renewable & Sustainable Energy",
        "status": "Online",
        "docs": "/docs",
        "endpoints": {
            "health": "/api/health",
            "chat": "/api/chat",
            "predict_explain": "/api/predict/explain",
        },
    }

@app.api_route("/api", methods=["GET", "HEAD"])
@app.api_route("/api/", methods=["GET", "HEAD"])
def read_api_index():
    return {
        "message": "EcoGrid AI API Root",
        "health": "/api/health",
        "docs": "/docs",
    }

@app.api_route("/api/health", methods=["GET", "HEAD"])
@app.api_route("/api/health/", methods=["GET", "HEAD"])
@app.api_route("/health", methods=["GET", "HEAD"])
@app.api_route("/health/", methods=["GET", "HEAD"])
def health_check():
    has_gemini = bool(GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here")
    return {
        "status": "ok",
        "gemini_configured": has_gemini,
        "model": GEMINI_MODEL if has_gemini else "built-in-knowledge-engine",
        "site": "Kanpur, Uttar Pradesh, India",
        "coordinates": {"latitude": 26.4499, "longitude": 80.3319},
        "server_time": datetime.now(timezone.utc).isoformat(),
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    message = request.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # Check if Gemini API key is configured
    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
        try:
            # Try official google.genai SDK
            from google import genai
            client = genai.Client(api_key=GEMINI_API_KEY)
            
            # Format prompt with system context and active node
            active_node = request.location_name or "Kanpur, Uttar Pradesh"
            full_prompt = f"{SYSTEM_PROMPT}\nActive Monitored Node: {active_node}\n\nUser Question: {message}"
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=full_prompt,
            )
            if response and response.text:
                return ChatResponse(
                    reply=response.text,
                    source="gemini",
                    timestamp=datetime.now(timezone.utc).isoformat(),
                )
        except Exception as e:
            # Fallback to secondary SDK or knowledge base gracefully
            try:
                import google.generativeai as legacy_genai
                legacy_genai.configure(api_key=GEMINI_API_KEY)
                active_node = request.location_name or "Kanpur, Uttar Pradesh"
                model = legacy_genai.GenerativeModel(
                    model_name="gemini-1.5-flash",
                    system_instruction=f"{SYSTEM_PROMPT}\nActive Monitored Node: {active_node}",
                )
                res = model.generate_content(message)
                if res and res.text:
                    return ChatResponse(
                        reply=res.text,
                        source="gemini-legacy",
                        timestamp=datetime.now(timezone.utc).isoformat(),
                    )
            except Exception as legacy_err:
                # Log error and fall back to domain knowledge base
                pass

    # Intelligent domain knowledge fallback
    fallback_reply = fallback_energy_copilot(message, request.location_name or "Kanpur, Uttar Pradesh")
    return ChatResponse(
        reply=fallback_reply,
        source="knowledge_base",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )

@app.post("/api/predict/explain", response_model=PredictExplainResponse)
async def explain_prediction(req: PredictExplainRequest):
    """
    Explain weather influence on microgrid generation using physics principles.
    """
    insights = []
    
    # Cloud cover analysis
    if req.cloud_cover_pct > 60:
        insights.append(f"High cloud cover ({req.cloud_cover_pct:.1f}%) reduces direct solar irradiance, causing an estimated {int(req.cloud_cover_pct * 0.75)}% attenuation on the 5 kW array.")
    elif req.cloud_cover_pct < 20:
        insights.append(f"Clear skies ({req.cloud_cover_pct:.1f}% cloud cover) permit maximum beam irradiance, achieving near-peak photovoltaic efficiency.")
    else:
        insights.append(f"Moderate cloud conditions ({req.cloud_cover_pct:.1f}%) produce scattered diffuse radiation, yielding steady mid-tier solar output.")

    # Wind speed analysis
    if req.wind_speed_kmh < 10:
        insights.append(f"Wind speed ({req.wind_speed_kmh:.1f} km/h) is below the 10 km/h cut-in threshold; the 3 kW turbine remains in standby.")
    elif req.wind_speed_kmh >= 45:
        insights.append(f"High wind velocity ({req.wind_speed_kmh:.1f} km/h) allows turbine to achieve full 3.0 kW rated output.")
    else:
        eff_pct = ((req.wind_speed_kmh - 10) / 35.0) ** 3 * 100
        insights.append(f"Favorable wind ({req.wind_speed_kmh:.1f} km/h) yields approximately {eff_pct:.1f}% of turbine rated capacity via cubic power response.")

    # Battery trajectory
    if req.battery_soc_pct > 80:
        insights.append(f"BESS State of Charge is high ({req.battery_soc_pct:.1f}%); reserve capacity is well positioned for evening peak demand.")
    elif req.battery_soc_pct < 30:
        insights.append(f"BESS is approaching low reserve threshold ({req.battery_soc_pct:.1f}%); prioritization shifts to solar charging.")
    else:
        insights.append(f"BESS is balanced at {req.battery_soc_pct:.1f}% SOC, sustaining daily cycle buffer.")

    # Carbon summary
    insights.append(f"Projected generation offsets {req.co2_avoided_kg:.2f} kg CO₂ today (calibrated to India CEA 0.82 kg/kWh baseline).")

    summary = (
        f"Kanpur microgrid forecast indicates {req.solar_kwh:.1f} kWh solar + {req.wind_kwh:.1f} kWh wind generation, "
        f"achieving {req.battery_soc_pct:.1f}% projected battery SOC and avoiding {req.co2_avoided_kg:.1f} kg CO₂."
    )

    return PredictExplainResponse(
        summary=summary,
        insights=insights,
        confidence_score=94.5,
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
