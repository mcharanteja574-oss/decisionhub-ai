import { AlertTriangle, UsersRound, Workflow, Zap } from "lucide-react";

export default function DecisionContextPanel({ scenario, result }) {
  const context = [
    {
      icon: AlertTriangle,
      label: "Problem Summary",
      value:
        scenario ||
        "Heavy rainfall is expected while hospitals are operating near maximum capacity.",
    },
    {
      icon: UsersRound,
      label: "Primary User",
      value: "City Emergency Operations Center",
    },
    {
      icon: Workflow,
      label: "Decision Bottleneck",
      value:
        "Officials must quickly decide whether to open shelters, deploy ambulances, issue public alerts, and close vulnerable roads.",
    },
    {
      icon: Zap,
      label: "Expected Community Impact",
      value: `Reduced emergency response time with ${result.confidence}% decision confidence and a ${result.risk_level.toLowerCase()} risk posture.`,
    },
  ];

  return (
    <section className="glass rounded-lg p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-googleGreen">Decision Context</p>
      <h2 className="mt-1 text-xl font-bold text-white">Problem framing before recommendations</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {context.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-3 flex items-center gap-2">
                <Icon className="h-5 w-5 text-googleGreen" aria-hidden="true" />
                <h3 className="font-bold text-white">{item.label}</h3>
              </div>
              <p className="text-sm leading-6 text-cloud/75">{item.value}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

