import { ShieldAlert } from "lucide-react";

export default function RiskScoreCard({ result }) {
  const tone =
    result.risk_level === "CRITICAL"
      ? "from-googleRed to-rose-500"
      : result.risk_level === "HIGH"
        ? "from-googleYellow to-googleRed"
        : "from-googleGreen to-googleBlue";

  return (
    <section className="glass rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cloud/60">Risk Score</p>
          <h2 className="mt-1 text-5xl font-extrabold text-white">{result.risk_score}</h2>
        </div>
        <div className={`rounded-lg bg-gradient-to-br ${tone} p-4`}>
          <ShieldAlert className="h-8 w-8 text-white" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-6">
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${tone} transition-all duration-700`}
            style={{ width: `${result.risk_score}%` }}
          />
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-bold text-white">{result.risk_level}</span>
          <span className="text-cloud/70">{result.confidence}% confidence</span>
        </div>
      </div>
    </section>
  );
}

