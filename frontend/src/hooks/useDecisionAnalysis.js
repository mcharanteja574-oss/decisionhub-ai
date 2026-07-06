import { useCallback, useEffect, useRef, useState } from "react";
import { analyzeScenario } from "../services/api";

const DEFAULT_SCENARIO = "Heavy rainfall expected tomorrow with hospital occupancy at 82%.";

const initialResult = {
  risk_score: 91,
  risk_level: "HIGH",
  confidence: 94,
  recommendations: [
    "Open Shelter A",
    "Deploy ambulances",
    "Issue SMS alerts",
    "Close vulnerable roads",
  ],
  priority_actions: [],
  timeline: [
    { time: "0-2 Hours", action: "Issue public alert" },
    { time: "2-6 Hours", action: "Open shelters" },
    { time: "6-12 Hours", action: "Deploy emergency teams" },
    { time: "12-24 Hours", action: "Road closures" },
    { time: "24-48 Hours", action: "Recovery operations" },
  ],
  explanation: "Recommendations are based on rainfall, hospital capacity, and road conditions.",
  public_advisory: "Avoid travel. Follow official instructions.",
  map_points: [],
  chart_data: [
    { label: "Now", risk: 72, capacity: 74 },
    { label: "6h", risk: 83, capacity: 82 },
    { label: "12h", risk: 91, capacity: 88 },
    { label: "24h", risk: 96, capacity: 92 },
  ],
  community_impact: [
    {
      label: "Lives Potentially Protected",
      value: 7678,
      unit: "residents",
      summary: "AI-generated estimate for residents benefiting from early alerts, sheltering, and safer routes.",
    },
    {
      label: "Critical Facilities Supported",
      value: 11,
      unit: "facilities",
      summary: "Hospitals, shelters, and transport corridors prioritized for operational continuity.",
    },
    {
      label: "Emergency Response Improvement",
      value: 37,
      unit: "%",
      summary: "Estimated improvement from pre-positioning teams and reducing avoidable travel demand.",
    },
    {
      label: "Resource Utilization",
      value: 83,
      unit: "%",
      summary: "Projected use of shelters, ambulances, public communications, and road-control teams.",
    },
    {
      label: "Recovery Readiness",
      value: 55,
      unit: "%",
      summary: "Readiness to transition from response into recovery after the first 24 hours.",
    },
  ],
  decision_scores: [
    {
      label: "Decision Readiness Score",
      value: 91,
      explanation: "Scenario signals align into a clear operating picture for rapid decisions.",
      recommendation: "Confirm shelter staffing and publish the first advisory.",
    },
    {
      label: "Resource Readiness",
      value: 77,
      explanation: "Available shelters help, but healthcare pressure reduces spare capacity.",
      recommendation: "Pre-stage ambulances and overflow shelter teams.",
    },
    {
      label: "Community Resilience Score",
      value: 79,
      explanation: "Resilience is constrained by flood-prone roads and traffic congestion.",
      recommendation: "Protect emergency corridors and reduce travel demand.",
    },
    {
      label: "Response Confidence",
      value: 94,
      explanation: "Recommendations are explainable across multiple independent signals.",
      recommendation: "Refresh the plan every 2 hours as conditions change.",
    },
    {
      label: "Recovery Readiness",
      value: 58,
      explanation: "Recovery depends on rapid road normalization and resident support.",
      recommendation: "Prepare post-event inspection and relief workflows.",
    },
  ],
  responsible_ai: {
    limitations: [
      "Prototype estimates are generated from demo datasets and require official review.",
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
    reasoning_summary: "Recommendations are based on rainfall, hospital capacity, road conditions, shelters, and citizen reports.",
    explainability: "Evidence, alternatives, and trade-offs are shown through Decision Replay.",
  },
};

export function useDecisionAnalysis() {
  const requestIdRef = useRef(0);
  const simulatorReadyRef = useRef(false);
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const [simulator, setSimulator] = useState({
    rainfall_mm: 95,
    hospital_occupancy: 82,
    traffic_congestion: 72,
    citizen_reports: 58,
  });
  const [result, setResult] = useState(initialResult);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisMeta, setAnalysisMeta] = useState({
    status: "Ready",
    lastGeneratedAt: null,
    runCount: 0,
    source: "Demo baseline",
  });

  const analyze = useCallback(
    async (overrides = {}) => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      const scenarioText = overrides.scenario ?? scenario;
      setLoading(true);
      setError("");
      setAnalysisMeta((current) => ({
        ...current,
        status: "Generating Decision Intelligence Report",
      }));
      try {
        const scenarioSignals = extractScenarioSignals(scenarioText);
        const payload = {
          scenario: scenarioText,
          ...simulator,
          ...scenarioSignals,
          ...overrides,
        };
        const data = await analyzeScenario(payload);
        if (requestId !== requestIdRef.current) {
          return;
        }
        setResult(data);
        setAnalysisMeta((current) => ({
          status: "Generated successfully",
          lastGeneratedAt: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          runCount: current.runCount + 1,
          source: "Gemini + Decision Intelligence Engine",
        }));
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return;
        }
        setError(err.message || "Analysis failed.");
        setAnalysisMeta((current) => ({
          ...current,
          status: "Generation failed",
        }));
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [scenario, simulator]
  );

  useEffect(() => {
    analyze();
  }, []);

  useEffect(() => {
    if (!simulatorReadyRef.current) {
      simulatorReadyRef.current = true;
      return undefined;
    }
    const handle = window.setTimeout(() => {
      analyze();
    }, 450);
    return () => window.clearTimeout(handle);
  }, [simulator]);

  return {
    scenario,
    setScenario,
    simulator,
    setSimulator,
    result,
    loading,
    error,
    analysisMeta,
    analyze,
  };
}

function extractScenarioSignals(text) {
  const signals = {};
  const lower = text.toLowerCase();

  const occupancyMatch =
    lower.match(/hospital(?:\s+\w+){0,4}\s+(?:occupancy|capacity|load)[^\d]{0,12}(\d{1,3})\s*%?/) ||
    lower.match(/(?:occupancy|capacity|load)[^\d]{0,12}(\d{1,3})\s*%?/);
  if (occupancyMatch) {
    signals.hospital_occupancy = clamp(Number(occupancyMatch[1]), 0, 100);
  }

  const rainfallMatch =
    lower.match(/(\d{1,3})\s*(?:mm|millimeters?)\s+(?:of\s+)?(?:rain|rainfall)/) ||
    lower.match(/(?:rainfall|rain)[^\d]{0,16}(\d{1,3})\s*(?:mm|millimeters?)?/);
  if (rainfallMatch) {
    signals.rainfall_mm = clamp(Number(rainfallMatch[1]), 0, 300);
  } else if (lower.includes("heavy rainfall")) {
    signals.rainfall_mm = 95;
  }

  return signals;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
