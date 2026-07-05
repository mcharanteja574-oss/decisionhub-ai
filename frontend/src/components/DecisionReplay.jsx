import { AlertCircle, CheckCircle2, GitCompareArrows, Scale, ShieldCheck } from "lucide-react";

const evidenceCatalog = [
  {
    label: "Heavy rainfall",
    match: ({ simulator, result }) => simulator.rainfall_mm >= 80 || result.explanation?.toLowerCase().includes("rainfall"),
  },
  {
    label: "Hospital occupancy",
    match: ({ simulator, result }) =>
      simulator.hospital_occupancy >= 75 || result.explanation?.toLowerCase().includes("hospital"),
  },
  {
    label: "Road flood risk",
    match: ({ result }) => result.recommendations?.some((item) => item.toLowerCase().includes("road")),
  },
  {
    label: "Shelter readiness",
    match: ({ result }) => result.recommendations?.some((item) => item.toLowerCase().includes("shelter")),
  },
  {
    label: "Emergency response capacity",
    match: ({ result }) => result.recommendations?.some((item) => item.toLowerCase().includes("ambulance")),
  },
];

export default function DecisionReplay({ result, simulator }) {
  const actions = result.priority_actions?.length
    ? result.priority_actions
    : result.recommendations.map((title, index) => ({
        title,
        priority: index === 0 ? "Immediate" : "High",
        owner: "Operations",
        rationale: "Recommended by the decision engine.",
      }));

  const replayItems = actions.slice(0, 4).map((action, index) => {
    const evidence = evidenceCatalog
      .filter((item) => item.match({ simulator, result }))
      .slice(0, index === 0 ? 4 : 3)
      .map((item) => item.label);

    return {
      ...action,
      confidence: Math.max(72, result.confidence - index * 4),
      evidence,
      alternative: buildAlternative(action.title, simulator),
      tradeoff: buildTradeoff(action.title),
    };
  });

  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-googleBlue">Decision Replay</p>
          <h2 className="mt-1 text-xl font-bold text-white">Why these recommendations?</h2>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-googleBlue/15 px-3 py-2 text-xs font-bold text-blue-100">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Explainable AI
        </span>
      </div>

      <div className="grid gap-4">
        {replayItems.map((item) => (
          <article
            key={item.title}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-googleBlue/45 hover:bg-white/[0.07]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cloud/50">Recommendation</p>
                <h3 className="mt-1 text-base font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-cloud/75">{item.rationale}</p>
              </div>

              <div className="w-full rounded-lg bg-white/[0.04] p-3 lg:w-36">
                <div className="flex items-center justify-between text-xs text-cloud/65">
                  <span>Confidence</span>
                  <span className="font-bold text-white">{item.confidence}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-googleGreen to-googleBlue"
                    style={{ width: `${item.confidence}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 xl:grid-cols-3">
              <ReplayBlock icon={CheckCircle2} title="Evidence Used" tone="text-googleGreen">
                <div className="flex flex-wrap gap-2">
                  {item.evidence.map((evidence) => (
                    <span key={evidence} className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-cloud">
                      {evidence}
                    </span>
                  ))}
                </div>
              </ReplayBlock>

              <ReplayBlock icon={GitCompareArrows} title="Alternative Action" tone="text-googleYellow">
                <p>{item.alternative}</p>
              </ReplayBlock>

              <ReplayBlock icon={Scale} title="Trade-off" tone="text-googleRed">
                <p>{item.tradeoff}</p>
              </ReplayBlock>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReplayBlock({ icon: Icon, title, tone, children }) {
  return (
    <div className="rounded-lg border border-white/10 bg-ink/35 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${tone}`} aria-hidden="true" />
        <h4 className="text-sm font-bold text-white">{title}</h4>
      </div>
      <div className="text-sm leading-6 text-cloud/75">{children}</div>
    </div>
  );
}

function buildAlternative(title, simulator) {
  const lower = title.toLowerCase();
  if (lower.includes("shelter")) {
    return `If rainfall drops below ${Math.max(60, simulator.rainfall_mm - 30)} mm, stage shelter staff first and delay full opening.`;
  }
  if (lower.includes("ambulance")) {
    return "If hospital load stabilizes below 70%, keep ambulances on standby near major junctions instead of redeploying.";
  }
  if (lower.includes("sms") || lower.includes("alert")) {
    return "If citizen reports remain low, issue targeted ward alerts before city-wide messaging.";
  }
  if (lower.includes("road")) {
    return "If traffic congestion falls below 40%, use controlled diversions before full road closure.";
  }
  return "Monitor the trigger for two hours and activate a lighter response if risk indicators fall together.";
}

function buildTradeoff(title) {
  const lower = title.toLowerCase();
  if (lower.includes("shelter")) {
    return "Maximizes resident safety, but increases staffing and logistics cost early.";
  }
  if (lower.includes("ambulance")) {
    return "Improves emergency response time, but reduces coverage flexibility elsewhere.";
  }
  if (lower.includes("sms") || lower.includes("alert")) {
    return "Reduces public exposure, but may create alert fatigue if conditions improve.";
  }
  if (lower.includes("road")) {
    return "Protects high-risk corridors, but may shift congestion to secondary routes.";
  }
  return "Improves readiness, but uses resources before certainty is complete.";
}

