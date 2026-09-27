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
    name: 'Om Ji Gupta',
    role: 'Full Stack Developer',
    keyResponsibility: 'Frontend, Backend, UI/UX & AI Integration',
    institution: 'Allenhouse Institute of Technology, Kanpur',
    department: 'B.Tech Computer Science & Engineering (CSE)',
    bio: 'Architected the full-stack EcoGrid AI platform, integrating FastAPI services, React 19 UI/UX, Google Gemini copilot, and Open-Meteo telemetry pipelines.',
    skills: ['React 19', 'TypeScript', 'FastAPI', 'Python', 'Tailwind CSS', 'Gemini AI', 'UI/UX'],
    github: 'https://github.com/omji34330',
    linkedin: 'https://linkedin.com/in/omjigupta',
    sihContribution: 'Full-stack application development, responsive glassmorphic design, API integration, and AI chatbot architecture.',
  },
  {
    name: 'Mohd Faizan',
    role: 'Product & Research Lead',
    keyResponsibility: 'Product Planning, Research & Documentation',
    institution: 'Allenhouse Institute of Technology, Kanpur',
    department: 'B.Tech Computer Science & Engineering (CSE)',
    bio: 'Led the product lifecycle, PRD/TRD technical documentation, operational timeline, and clean energy domain research for SIH 2026 PS ID 26200.',
    skills: ['Product Strategy', 'Technical Writing', 'PRD / TRD', 'System Workflow', 'Energy Market Research'],
    github: 'https://github.com/mohdfaizan-sih',
    linkedin: 'https://linkedin.com/in/mohd-faizan-ecogrid',
    sihContribution: 'PRD & TRD authoring, SIH 2026 problem statement alignment, and operational product roadmap.',
  },
  {
    name: 'Mohammmad Uzair Ansari',
    role: 'Team Leader',
    keyResponsibility: 'Team Coordination & Project Management',
    institution: 'Allenhouse Institute of Technology, Kanpur',
    department: 'B.Tech Computer Science & Engineering (CSE)',
    bio: 'Directs team milestones, technical synergy, cross-functional sprints, and SIH evaluation readiness for the EcoGrid AI initiative.',
    skills: ['Project Leadership', 'Agile / Scrum', 'Team Coordination', 'System Integration', 'Sprint Planning'],
    github: 'https://github.com/uzairansari-sih',
    linkedin: 'https://linkedin.com/in/uzair-ansari-lead',
    sihContribution: 'Overall project management, milestone tracking, team task allocation, and SIH grand finale preparation.',
  },
  {
    name: 'Pritam Yadav',
    role: 'Research Lead',
    keyResponsibility: 'Renewable Energy Research & Data Analysis',
    institution: 'Allenhouse Institute of Technology, Kanpur',
    department: 'B.Tech Computer Science & Engineering (CSE)',
    bio: 'Researched solar insolation modeling, wind turbine aerodynamics, and historical climatic patterns in the Indo-Gangetic plain.',
    skills: ['Renewable Energy', 'Solar PV Modeling', 'Wind Power Physics', 'Data Analytics', 'Microgrid Stability'],
    github: 'https://github.com/pritamyadav-research',
    linkedin: 'https://linkedin.com/in/pritam-yadav-energy',
    sihContribution: 'Atmospheric clearness attenuation formulations, cubic wind curve modeling, and Kanpur weather data analysis.',
  },
  {
    name: 'Mohammad Farish Ansari',
    role: 'Team Member',
    keyResponsibility: 'Development, Testing & Implementation',
    institution: 'Allenhouse Institute of Technology, Kanpur',
    department: 'B.Tech Computer Science & Engineering (CSE)',
    bio: 'Engineered core module testing, endpoint validation, test coverage suites, and responsive component implementation.',
    skills: ['Software Testing', 'Python / Pytest', 'Component Testing', 'TypeScript', 'Bug Triage', 'Git / CI'],
    github: 'https://github.com/farishansari-dev',
    linkedin: 'https://linkedin.com/in/farish-ansari',
    sihContribution: 'Backend unit test suites (test_server.py), UI component testing, and edge case resilience verification.',
  },
  {
    name: 'Shivanshi Mishra',
    role: 'Presentation',
    keyResponsibility: 'Demo Presentation & Communication',
    institution: 'Allenhouse Institute of Technology, Kanpur',
    department: 'B.Tech Computer Science & Engineering (CSE)',
    bio: 'Curates the presentation pitch, visual storytelling, stakeholder communication, and demo walkthrough for SIH 2026 jury panels.',
    skills: ['Presentation & Pitch', 'Product Demonstration', 'Technical Communication', 'Visual Storytelling', 'ESG Metrics'],
    github: 'https://github.com/shivanshimishra',
    linkedin: 'https://linkedin.com/in/shivanshi-mishra',
    sihContribution: 'SIH jury pitch deck, live interactive demo scripting, and ESG sustainability reporting presentations.',
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
