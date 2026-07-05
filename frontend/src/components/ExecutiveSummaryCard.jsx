import { Building2, Clock3, ShieldCheck, Target } from "lucide-react";

const items = [
  {
    icon: Building2,
    label: "Primary User",
    value: "City Emergency Operations Center",
  },
  {
    icon: Clock3,
    label: "Decision Bottleneck",
    value: "Open shelters, deploy ambulances, and close vulnerable roads before conditions peak.",
  },
  {
    icon: ShieldCheck,
    label: "Community Impact",
    value: "Reduced emergency response time and improved public safety.",
  },
  {
    icon: Target,
    label: "Expected Outcome",
    value: "A clear, explainable response plan officials can act on within minutes.",
  },
];

export default function ExecutiveSummaryCard({ result }) {
  return (
    <section className="glass rounded-lg p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-googleBlue">Executive Summary</p>
          <h2 className="mt-1 text-2xl font-extrabold text-white">Community Decision Center</h2>
        </div>
        <div className="rounded-lg bg-white/[0.05] px-4 py-3 text-sm font-bold text-white">
          {result.risk_level} risk · {result.confidence}% confidence
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <Icon className="h-5 w-5 text-googleYellow" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-bold text-cloud/70">{item.label}</h3>
              <p className="mt-2 text-sm leading-6 text-white">{item.value}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

