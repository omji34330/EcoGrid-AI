// EcoGrid AI - TypeScript Definitions
// Smart India Hackathon 2026 - PS ID 26200

export interface WeatherCurrent {
  temperature_2m: number;
  relative_humidity_2m: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  cloud_cover: number;
  weather_code: number;
  direct_normal_irradiance?: number;
  diffuse_radiation?: number;
  time: string;
}

export interface WeatherHourlyRaw {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  surface_pressure: number[];
  wind_speed_10m: number[];
  cloud_cover: number[];
  direct_normal_irradiance?: number[];
  diffuse_radiation?: number[];
}

export interface HourlyEnergyPoint {
  time: string;
  hourLabel: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  cloudCover: number;
  solarKw: number;
  windKw: number;
  totalGenKw: number;
  loadKw: number;
  batterySoc: number;
  batteryFlowKw: number; // positive = charging, negative = discharging
  gridImportKw: number;
  co2AvoidedKg: number;
}

export interface DailyGenerationPoint {
  date: string;
  dayLabel: string;
  solarKwh: number;
  windKwh: number;
  totalKwh: number;
  co2AvoidedKg: number;
}

export interface GeoLocation {
  name: string;
  latitude: number;
  longitude: number;
  isAutoDetected?: boolean;
}

export interface LiveTelemetry {
  timestamp: string;
  locationName: string;
  latitude: number;
  longitude: number;
  // Raw Weather KPIs
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  humidity: number;
  airPressure: number;
  solarIrradiance: number; // W/m²
  weatherCondition: string;

  // Derived Microgrid Power (kW)
  solarOutputKw: number;
  windOutputKw: number;
  totalRenewableKw: number;
  currentLoadKw: number;
  batterySocPct: number;
  batteryStatus: 'charging' | 'discharging' | 'idle';
  batteryPowerKw: number;
  gridExchangeKw: number; // positive = export, negative = import

  // Cumulative today
  todaySolarKwh: number;
  todayWindKwh: number;
  todayTotalRenewableKwh: number;
  todayCo2AvoidedKg: number;
  renewableSharePct: number;
  gridEfficiencyPct: number;

  // Chart datasets
  hourlyNext24h: HourlyEnergyPoint[];
  dailyPast7d: DailyGenerationPoint[];
}

export interface PredictionScenario {
  cloudCoverDeltaPct: number; // -50 to +50
  windSpeedMultiplier: number; // 0.5 to 2.0
  loadMultiplier: number; // 0.5 to 1.8
  bessInitialSocPct: number; // 10 to 95
}

export interface PredictionResult {
  expectedSolarKwh: number;
  expectedWindKwh: number;
  totalRenewableKwh: number;
  projectedBatterySocPct: number;
  carbonReductionScoreKg: number;
  confidenceScorePct: number;
  peakHour: string;
  gridIndependencePct: number;
  hourlyForecast: HourlyEnergyPoint[];
  insights: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  source?: 'gemini' | 'knowledge_base' | 'system';
}

export interface TeamMember {
  name: string;
  role: string;
  keyResponsibility: string;
  institution?: string;
  department: string;
  bio: string;
  skills: string[];
  github: string;
  linkedin: string;
  avatar?: string;
  sihContribution: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'sih' | 'sustainability';
}
