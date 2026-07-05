import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

export default function DecisionIntelligenceScore({ scores = [] }) {
  const data = scores.map((score) => ({ subject: shortLabel(score.label), value: score.value, full: score.label }));

  return (
    <section className="glass rounded-lg p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-googleBlue">Decision Intelligence Score</p>
      <h2 className="mt-1 text-xl font-bold text-white">Readiness, resilience, confidence, and recovery</h2>
      <div className="mt-5 grid gap-5 xl:grid-cols-[360px_1fr]">
        <div className="h-80 rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid stroke="rgba(255,255,255,0.14)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#dbe7ff", fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9fb1c9", fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "#0b1728",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8,
                  color: "#fff",
                }}
              />
              <Radar dataKey="value" stroke="#4285f4" fill="#4285f4" fillOpacity={0.35} strokeWidth={3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid gap-3">
          {scores.map((score) => (
            <article key={score.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-white">{score.label}</h3>
                <span className="text-lg font-extrabold text-white">{score.value}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-googleGreen to-googleBlue" style={{ width: `${score.value}%` }} />
              </div>
              <p className="mt-3 text-sm leading-6 text-cloud/70">{score.explanation}</p>
              <p className="mt-2 text-sm font-semibold text-blue-100">{score.recommendation}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function shortLabel(label) {
  return label.replace(" Score", "").replace(" Readiness", "").replace("Decision ", "Decision");
}

