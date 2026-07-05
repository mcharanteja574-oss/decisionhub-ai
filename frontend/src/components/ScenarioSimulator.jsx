import { Activity, CloudRain, Gauge, Hospital, MessageSquareWarning, TrafficCone } from "lucide-react";

export default function ScenarioSimulator({ simulator, setSimulator, result }) {
  const update = (key, value) => setSimulator((current) => ({ ...current, [key]: value }));
  const impact = getCommunityImpact(result?.risk_score ?? 0);

  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-googleGreen">Simulator</p>
          <h2 className="mt-1 text-xl font-bold text-white">Change conditions live</h2>
        </div>
        <Activity className="h-5 w-5 text-googleGreen" aria-hidden="true" />
      </div>
      <div className="grid gap-5">
        <Slider
          icon={CloudRain}
          label="Rainfall"
          value={simulator.rainfall_mm}
          unit="mm"
          min={0}
          max={300}
          onChange={(value) => update("rainfall_mm", value)}
        />
        <Slider
          icon={Hospital}
          label="Hospital Occupancy"
          value={simulator.hospital_occupancy}
          unit="%"
          min={0}
          max={100}
          onChange={(value) => update("hospital_occupancy", value)}
        />
        <Slider
          icon={TrafficCone}
          label="Traffic Congestion"
          value={simulator.traffic_congestion}
          unit="%"
          min={0}
          max={100}
          onChange={(value) => update("traffic_congestion", value)}
        />
        <Slider
          icon={MessageSquareWarning}
          label="Citizen Reports"
          value={simulator.citizen_reports}
          unit="%"
          min={0}
          max={100}
          onChange={(value) => update("citizen_reports", value)}
        />

        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-bold text-white">
              <Gauge className="h-4 w-4 text-googleGreen" aria-hidden="true" />
              Community Impact
            </span>
            <span className="text-sm font-extrabold text-white">{impact.score}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${impact.gradient} transition-all duration-700`}
              style={{ width: `${impact.score}%` }}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-cloud/75">{impact.summary}</p>
        </div>
      </div>
    </section>
  );
}

function getCommunityImpact(riskScore) {
  if (riskScore >= 90) {
    return {
      score: 94,
      gradient: "from-googleRed to-googleYellow",
      summary: "High disruption expected across mobility, shelter demand, and emergency response capacity.",
    };
  }
  if (riskScore >= 75) {
    return {
      score: 82,
      gradient: "from-googleYellow to-googleRed",
      summary: "Material community disruption likely; early alerts and staged resources are recommended.",
    };
  }
  if (riskScore >= 45) {
    return {
      score: 58,
      gradient: "from-googleBlue to-googleYellow",
      summary: "Localized impact expected with manageable pressure on public services.",
    };
  }
  return {
    score: 28,
    gradient: "from-googleGreen to-googleBlue",
    summary: "Low community impact; continue monitoring for changes in rainfall and citizen reports.",
  };
}

function Slider({ icon: Icon, label, value, unit, min, max, onChange }) {
  return (
    <label className="block">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-semibold text-cloud">
          <Icon className="h-4 w-4 text-googleBlue" aria-hidden="true" />
          {label}
        </span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-white">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-googleBlue"
      />
    </label>
  );
}
