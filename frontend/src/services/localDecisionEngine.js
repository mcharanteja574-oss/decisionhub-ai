const hospitals = [
  { id: "hospital-1", name: "City General Hospital", lat: 12.971, lng: 77.594, occupancy: 82 },
  { id: "hospital-2", name: "North Medical Center", lat: 13.022, lng: 77.59, occupancy: 74 },
  { id: "hospital-3", name: "East Care Institute", lat: 12.987, lng: 77.713, occupancy: 88 },
];

const shelters = [
  { id: "shelter-1", name: "Shelter A", lat: 12.976, lng: 77.612, capacity: 600, status: "ready" },
  { id: "shelter-2", name: "Community Hall West", lat: 12.959, lng: 77.556, capacity: 350, status: "ready" },
  { id: "shelter-3", name: "Sports Complex East", lat: 12.991, lng: 77.681, capacity: 500, status: "staffing required" },
];

const roads = [
  { id: "road-1", name: "Outer Ring Road East", lat: 12.982, lng: 77.702, status: "Waterlogging likely", floodRisk: "high" },
  { id: "road-2", name: "KR Market Underpass", lat: 12.963, lng: 77.577, status: "Closure recommended", floodRisk: "high" },
  { id: "road-3", name: "Airport Corridor", lat: 13.055, lng: 77.62, status: "Operational with delays", floodRisk: "medium" },
];

export function analyzeScenarioLocally(payload = {}) {
  const scenario = payload.scenario || "";
  const signals = deriveSignals(payload, scenario);
  const riskScore = clamp(
    Math.round(
      signals.rainfall_mm * 0.24 +
        signals.hospital_occupancy * 0.32 +
        signals.traffic_congestion * 0.18 +
        signals.citizen_reports * 0.12 +
        22
    ),
    0,
    100
  );
  const riskLevel = riskScore >= 92 ? "CRITICAL" : riskScore >= 75 ? "HIGH" : riskScore >= 45 ? "MODERATE" : "LOW";
  const confidence = riskScore >= 75 ? 94 : 88;
  const hospital = hospitals.reduce((top, item) => (item.occupancy > top.occupancy ? item : top), hospitals[0]);
  const vulnerableRoads = roads.filter((road) => road.floodRisk === "high").map((road) => road.name);
  const recommendations = [
    "Open Shelter A and prepare overflow capacity",
    `Deploy ambulances near ${hospital.name}`,
    "Issue SMS and app alerts for flood-prone wards",
    `Close vulnerable roads: ${vulnerableRoads.slice(0, 2).join(", ")}`,
  ];
  const explanation = `The scenario indicates ${signals.rainfall_mm} mm rainfall, ${signals.hospital_occupancy}% hospital occupancy, ${trafficLevel(signals.traffic_congestion).toLowerCase()} traffic, and citizen report pressure at ${signals.citizen_reports}%. Risk is elevated because flood-prone roads, healthcare pressure, and shelter demand can compound quickly during the first 24 hours.`;

  return {
    risk_score: riskScore,
    risk_level: riskLevel,
    confidence,
    recommendations,
    priority_actions: [
      {
        title: recommendations[0],
        priority: "Immediate",
        owner: "Emergency Operations Center",
        rationale: "Shelter readiness reduces exposure before rainfall peaks.",
      },
      {
        title: recommendations[1],
        priority: "High",
        owner: "Health Command",
        rationale: `${hospital.name} is already at ${hospital.occupancy}% occupancy.`,
      },
      {
        title: recommendations[2],
        priority: "High",
        owner: "Public Communications",
        rationale: "Early guidance reduces avoidable road demand and emergency calls.",
      },
      {
        title: recommendations[3],
        priority: "Medium",
        owner: "Transport Department",
        rationale: "Pre-emptive diversions keep emergency corridors usable.",
      },
    ],
    timeline: standardTimeline(),
    explanation,
    public_advisory: "Avoid non-essential travel, keep phones charged, follow official alerts, and move early if advised.",
    map_points: mapPoints(riskScore),
    chart_data: chartData(signals, riskScore),
    community_impact: communityImpact(signals, riskScore),
    decision_scores: decisionScores(signals, riskScore, confidence),
    responsible_ai: {
      limitations: [
        "This public static deployment uses the in-browser demo decision engine when the FastAPI backend is unavailable.",
        "Prototype estimates are generated from demo datasets and should be reviewed by authorized officials.",
        "Recommendations support decisions; they do not replace emergency command authority.",
      ],
      data_sources_used: [
        "Weather Forecast",
        "Hospital Capacity",
        "Traffic Conditions",
        "Citizen Reports",
        "Shelter Availability",
        "Emergency Resources",
      ],
      reasoning_summary: explanation,
      explainability:
        "DecisionHub AI combines scenario signals with demo public-service datasets, then surfaces risk, confidence, evidence, alternatives, and trade-offs for review.",
    },
  };
}

function deriveSignals(payload, scenario) {
  const lower = scenario.toLowerCase();
  return {
    rainfall_mm: number(payload.rainfall_mm, heavyRain(lower) ? 95 : rain(lower) ? 55 : 20, 0, 300),
    hospital_occupancy: number(payload.hospital_occupancy, extractPercent(lower, 68), 0, 100),
    traffic_congestion: number(payload.traffic_congestion, lower.includes("traffic") || heavyRain(lower) ? 72 : 48, 0, 100),
    citizen_reports: number(payload.citizen_reports, lower.includes("flood") || rain(lower) ? 58 : 35, 0, 100),
  };
}

function extractPercent(text, fallback) {
  const occupancyMatch =
    text.match(/hospital(?:\s+\w+){0,4}\s+(?:occupancy|capacity|load)[^\d]{0,12}(\d{1,3})\s*%?/) ||
    text.match(/(?:occupancy|capacity|load)[^\d]{0,12}(\d{1,3})\s*%?/);
  return occupancyMatch ? Number(occupancyMatch[1]) : fallback;
}

function heavyRain(text) {
  return text.includes("heavy rainfall") || text.includes("heavy rain");
}

function rain(text) {
  return text.includes("rain");
}

function number(value, fallback, min, max) {
  return clamp(Number.isFinite(Number(value)) ? Number(value) : fallback, min, max);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function trafficLevel(value) {
  if (value >= 85) return "SEVERE";
  if (value >= 60) return "HIGH";
  if (value >= 30) return "MODERATE";
  return "LOW";
}

function standardTimeline() {
  return [
    { time: "0-2 Hours", action: "Issue public alert and activate the Emergency Operations Center" },
    { time: "2-6 Hours", action: "Open shelters and position staff near flood-prone wards" },
    { time: "6-12 Hours", action: "Deploy ambulances and emergency teams near high-risk zones" },
    { time: "12-24 Hours", action: "Close vulnerable roads and monitor hospital surge capacity" },
    { time: "24-48 Hours", action: "Begin recovery operations and reassess resident support needs" },
  ];
}

function mapPoints(riskScore) {
  return [
    ...hospitals.map((hospital) => ({
      id: hospital.id,
      name: hospital.name,
      type: "Hospital",
      lat: hospital.lat,
      lng: hospital.lng,
      status: `${hospital.occupancy}% occupied`,
      severity: hospital.occupancy >= 85 ? "critical" : "high",
    })),
    ...shelters.map((shelter) => ({
      id: shelter.id,
      name: shelter.name,
      type: "Shelter",
      lat: shelter.lat,
      lng: shelter.lng,
      status: `${shelter.capacity} beds, ${shelter.status}`,
      severity: shelter.status === "ready" ? "low" : "medium",
    })),
    ...roads.map((road) => ({
      id: road.id,
      name: road.name,
      type: "Road",
      lat: road.lat,
      lng: road.lng,
      status: road.status,
      severity: road.floodRisk === "high" && riskScore > 80 ? "critical" : "medium",
    })),
  ];
}

function chartData(signals, riskScore) {
  return [
    { label: "Now", risk: Math.max(10, riskScore - 18), capacity: Math.max(35, signals.hospital_occupancy - 8) },
    { label: "6h", risk: Math.min(100, riskScore - 8), capacity: signals.hospital_occupancy },
    { label: "12h", risk: riskScore, capacity: Math.min(100, signals.hospital_occupancy + 6) },
    {
      label: "24h",
      risk: Math.min(100, riskScore + Math.round((signals.rainfall_mm + signals.traffic_congestion + signals.citizen_reports) / 60)),
      capacity: Math.min(100, signals.hospital_occupancy + 10),
    },
  ];
}

function communityImpact(signals, riskScore) {
  return [
    {
      label: "Lives Potentially Protected",
      value: Math.min(9800, 2400 + riskScore * 58),
      unit: "residents",
      summary: "AI-generated estimate for residents benefiting from early alerts, sheltering, and safer routes.",
    },
    {
      label: "Critical Facilities Supported",
      value: 6 + Math.round(signals.hospital_occupancy / 18),
      unit: "facilities",
      summary: "Hospitals, shelters, and transport corridors prioritized for operational continuity.",
    },
    {
      label: "Emergency Response Improvement",
      value: Math.min(52, 18 + Math.round((signals.traffic_congestion + signals.citizen_reports) / 7)),
      unit: "%",
      summary: "Estimated improvement from pre-positioning teams and reducing avoidable travel demand.",
    },
    {
      label: "Resource Utilization",
      value: Math.min(94, 48 + Math.round((signals.rainfall_mm + signals.hospital_occupancy) / 5)),
      unit: "%",
      summary: "Projected use of shelters, ambulances, public communications, and road-control teams.",
    },
    {
      label: "Recovery Readiness",
      value: Math.max(42, 100 - Math.round(riskScore / 2)),
      unit: "%",
      summary: "Readiness to transition from response into recovery after the first 24 hours.",
    },
  ];
}

function decisionScores(signals, riskScore, confidence) {
  const resourceReadiness = clamp(112 - Math.round(signals.hospital_occupancy * 0.48 + signals.citizen_reports * 0.22), 22, 96);
  const resilience = clamp(
    108 - Math.round(signals.rainfall_mm * 0.16 + signals.traffic_congestion * 0.22 + signals.hospital_occupancy * 0.28),
    25,
    94
  );
  const responseConfidence = clamp(
    confidence - Math.round(Math.max(0, signals.hospital_occupancy - 65) / 3) + Math.round(Math.max(0, 70 - signals.hospital_occupancy) / 5),
    58,
    97
  );
  const recovery = clamp(104 - Math.round(riskScore * 0.42 + signals.hospital_occupancy * 0.24), 24, 92);
  const decisionReadiness = clamp(
    Math.round(responseConfidence * 0.34 + resourceReadiness * 0.24 + resilience * 0.22 + recovery * 0.2),
    35,
    98
  );

  return [
    {
      label: "Decision Readiness Score",
      value: decisionReadiness,
      explanation: "Confidence is high because rainfall, healthcare capacity, traffic, and citizen reports are aligned into a single operating picture.",
      recommendation: "Confirm shelter staffing and publish the first public advisory before the rainfall peak.",
    },
    {
      label: "Resource Readiness",
      value: resourceReadiness,
      explanation: "Shelters are available, but hospital occupancy and citizen-report pressure reduce spare operational capacity.",
      recommendation: "Pre-stage ambulances and assign overflow shelter teams now.",
    },
    {
      label: "Community Resilience Score",
      value: resilience,
      explanation: "Community resilience is constrained by flood-prone roads and high congestion during heavy rainfall.",
      recommendation: "Reduce travel demand with targeted alerts and protect emergency corridors.",
    },
    {
      label: "Response Confidence",
      value: responseConfidence,
      explanation: "The recommendation set is explainable because it is based on multiple independent public-service signals.",
      recommendation: "Keep monitoring rainfall and citizen reports to update the plan every 2 hours.",
    },
    {
      label: "Recovery Readiness",
      value: recovery,
      explanation: "Recovery readiness depends on how quickly road closures, shelters, and healthcare load can be normalized.",
      recommendation: "Prepare post-event inspection teams and resident support workflows before the 24-hour mark.",
    },
  ];
}
