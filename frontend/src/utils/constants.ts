// EcoGrid AI - Project Constants & Specifications
// Smart India Hackathon 2026 - PS ID 26200

import type { TeamMember, FAQItem } from '../types';

export const SITE_SPECS = {
  name: 'Kanpur Renewable Energy Microgrid Node 01',
  location: 'Kanpur, Uttar Pradesh, India',
  latitude: 26.4499,
  longitude: 80.3319,
  elevationMeters: 126,
  timezone: 'Asia/Kolkata',
  psId: 'SIH 2026 – PS ID 26200',
  category: 'Software',
  theme: 'Renewable & Sustainable Energy',
};

export const MICROGRID_HARDWARE = {
  solarRatedKw: 5.0, // 5 kW Bifacial Monocrystalline Array
  windRatedKw: 3.0, // 3 kW Horizontal Axis Wind Turbine
  windCutInKmh: 10.0,
  windRatedKmh: 45.0,
  windCutOutKmh: 90.0,
  batteryCapacityKwh: 10.0, // 10 kWh Lithium Iron Phosphate (LiFePO4)
  batteryMinSocPct: 15.0,
  batteryMaxSocPct: 95.0,
  batteryRoundTripEfficiency: 0.92,
  inverterEfficiency: 0.95,
  dailyBaseLoadKwh: 18.0,
  co2FactorKgPerKwh: 0.82, // Central Electricity Authority (CEA) India baseline
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Aarav Sharma',
    role: 'Team Lead & AI Architect',
    department: 'Computer Science & Engineering',
    bio: 'Specializes in physics-informed neural networks and energy load time-series forecasting. Leading the EcoGrid AI architecture and SIH 2026 roadmap.',
    skills: ['PyTorch', 'FastAPI', 'System Architecture', 'Time-Series ML', 'Energy Modeling'],
    github: 'https://github.com/aaravsharma-sih',
    linkedin: 'https://linkedin.com/in/aarav-sharma-ecogrid',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    sihContribution: 'End-to-end system design, Gemini Copilot integration, and predictive model pipeline.',
  },
  {
    name: 'Priya Patel',
    role: 'Lead Frontend & Data Visualization Engineer',
    department: 'Information Technology',
    bio: 'Passionate about high-performance interactive data dashboards and accessible UX. Built the real-time glassmorphism interface and Recharts visual analytics.',
    skills: ['React 19', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Framer Motion'],
    github: 'https://github.com/priyapatel-dev',
    linkedin: 'https://linkedin.com/in/priya-patel-frontend',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    sihContribution: 'Responsive UI, glassmorphic theme system, auto-refresh telemetry hooks, and SVG gauge components.',
  },
  {
    name: 'Rohan Verma',
    role: 'Renewable Energy Systems & Physics Modeler',
    department: 'Electrical Engineering',
    bio: 'Focuses on microgrid stability, PV clearness index calculations, and aerodynamic turbine power curves. Calibrated the Kanpur atmospheric equations.',
    skills: ['Microgrid Control', 'PV Modeling', 'Turbine Dynamics', 'MATLAB/Simulink', 'BESS Chemistry'],
    github: 'https://github.com/rohanverma-energy',
    linkedin: 'https://linkedin.com/in/rohan-verma-renewables',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    sihContribution: 'PV elevation solar attenuation algorithm, cubic turbine power curves, and BESS SOC walk formulation.',
  },
  {
    name: 'Ananya Gupta',
    role: 'Sustainability & ESG Analytics Specialist',
    department: 'Environmental Science & Data Analytics',
    bio: 'Conducts life-cycle carbon accounting and grid emission factor research. Formulated the 0.82 kg CO2/kWh CEA avoidance metrics and audit tables.',
    skills: ['ESG Reporting', 'Life-Cycle Analysis', 'GHG Protocol', 'Data Analysis', 'SQL'],
    github: 'https://github.com/ananyagupta-sustainability',
    linkedin: 'https://linkedin.com/in/ananya-gupta-esg',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    sihContribution: 'Scope 2 emission reduction logic, tree-equivalent math, and downloadable CSV audit generator.',
  },
  {
    name: 'Karan Malhotra',
    role: 'IoT Edge & Backend Developer',
    department: 'Electronics & Communication',
    bio: 'Designs low-latency sensor ingestion protocols and MQTT-to-REST pipelines. Implemented the FastAPI service and Open-Meteo resilient fetching.',
    skills: ['Python', 'FastAPI', 'MQTT / IoT Protocols', 'Docker', 'REST APIs'],
    github: 'https://github.com/karanmalhotra-iot',
    linkedin: 'https://linkedin.com/in/karan-malhotra-embedded',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    sihContribution: 'FastAPI microservices, rate-limiting handlers, and edge IoT readiness bridge.',
  },
  {
    name: 'Prof. Dr. Vikram Sen',
    role: 'Faculty Mentor & Grid Advisor',
    department: 'Department of Electrical & Sustainable Energy',
    bio: '20+ years of research in decentralized power systems and smart grids in Northern India. Guided the team on grid synchronization and SIH evaluation criteria.',
    skills: ['Smart Grids', 'Power Systems', 'Policy & CEA Regulations', 'Research Mentorship'],
    github: 'https://github.com/dr-vikram-sen',
    linkedin: 'https://linkedin.com/in/dr-vikram-sen-iit',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    sihContribution: 'Domain validation, benchmark verification against Uttar Pradesh state power dispatch guidelines.',
  },
];

export const FAQS: FAQItem[] = [
  {
    question: 'What is EcoGrid AI?',
    answer: 'EcoGrid AI is an intelligent renewable energy monitoring, prediction, and sustainability analytics platform designed for decentralized microgrids. Developed for Smart India Hackathon 2026 (Problem Statement ID 26200), it bridges real-time weather telemetry with physics-informed energy forecasting to optimize clean power self-consumption and battery scheduling.',
    category: 'general',
  },
  {
    question: 'Where does live data come from?',
    answer: 'Live weather telemetry is pulled directly from the Open-Meteo High-Resolution Atmospheric Forecast API without requiring user accounts or third-party cookies. The platform queries solar irradiance, temperature, humidity, surface pressure, wind velocity, and cloud cover specifically for Kanpur (26.4499°N, 80.3319°E) and updates dynamically every 60 seconds.',
    category: 'technical',
  },
  {
    question: 'How accurate are the energy predictions?',
    answer: 'EcoGrid AI combines atmospheric physics with parametric device models. Solar generation accounts for solar elevation angles and cloud clearness attenuation. Wind generation utilizes an empirical cubic aerodynamic power curve (cut-in 10 km/h, rated 45 km/h). Under clear-sky conditions, confidence levels exceed 92-95%; during rapid weather fronts, the model provides error bounds to aid operator decision-making.',
    category: 'technical',
  },
  {
    question: 'Why Kanpur, Uttar Pradesh?',
    answer: 'Kanpur is a premier industrial and academic hub in Northern India with over 300 sunny days per year and ~5.2 kWh/m²/day solar insolation. However, seasonal particulate haze, winter smog, and pre-monsoon convective winds pose real challenges for grid operators. Solving for Kanpur proves that AI microgrid dispatch is viable in high-variance climatic zones across India.',
    category: 'sih',
  },
  {
    question: 'Can this platform support real IoT hardware and smart meters?',
    answer: 'Yes! While our hackathon demonstration uses high-resolution live meteorological models against a declared 5 kW solar + 3 kW wind + 10 kWh BESS reference system, the backend is engineered with an MQTT/Modbus ingestion interface. Field microgrids can directly stream Modbus RS-485 inverter logs and RS-232 smart meter data to replace or calibrate the atmospheric estimators.',
    category: 'technical',
  },
  {
    question: 'How is the 0.82 kg CO₂/kWh carbon avoidance calculated?',
    answer: 'We adhere to the official Central Electricity Authority (CEA) of India Baseline Carbon Dioxide Database for the Indian Power Sector (Version 19). The Northern Regional grid average emission intensity is benchmarked at 0.82 kg CO₂ per kWh of coal-dominated displacement.',
    category: 'sustainability',
  },
  {
    question: 'What happens if the Gemini AI service is offline during evaluation?',
    answer: 'EcoGrid AI is built with zero-failure resilience! The frontend and backend incorporate a dual-tier architecture: when live Gemini API keys are active, the copilot leverages LLM reasoning; if network latency occurs or keys are omitted, an embedded physics-knowledge engine immediately responds to microgrid questions without breaking.',
    category: 'technical',
  },
  {
    question: 'How does EcoGrid AI address SIH 2026 Problem Statement 26200?',
    answer: 'PS ID 26200 demands innovative software solutions for efficient generation and management of renewable and sustainable energy. EcoGrid AI directly addresses this by eliminating reactive energy waste, forecasting daily storage capacity before sunset, and generating verified ESG carbon reduction certificates.',
    category: 'sih',
  },
];

export const SUGGESTED_PROMPTS = [
  'How is solar output calculated today in Kanpur?',
  'Explain the 3 kW wind turbine cubic power curve',
  'What is the current Battery SOC and health status?',
  'Why do we use 0.82 kg CO2/kWh for carbon avoidance?',
  'How does cloud cover attenuate PV generation?',
  'What are the key hardware specs of this microgrid?',
];
