import { Activity, Ambulance, BrainCircuit, CheckCircle2, CloudRain, HeartPulse, RadioTower, Route } from "lucide-react";
import { useEffect, useState } from "react";

const agents = [
  { name: "Weather Agent", icon: CloudRain, task: "Analyzing rainfall intensity" },
  { name: "Traffic Agent", icon: Route, task: "Checking road congestion" },
  { name: "Healthcare Agent", icon: HeartPulse, task: "Evaluating hospital capacity" },
  { name: "Emergency Agent", icon: Ambulance, task: "Positioning response teams" },
  { name: "Citizen Reports Agent", icon: RadioTower, task: "Reviewing public reports" },
  { name: "Decision Engine", icon: BrainCircuit, task: "Generating recommendations" },
];

export default function MultiAgentPanel({ loading }) {
  const [activeIndex, setActiveIndex] = useState(agents.length);

  useEffect(() => {
    if (!loading) {
      setActiveIndex(agents.length);
      return undefined;
    }

    setActiveIndex(0);
    const timer = window.setInterval(() => {
      setActiveIndex((current) => Math.min(current + 1, agents.length - 1));
    }, 420);

    return () => window.clearInterval(timer);
  }, [loading]);

  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-googleYellow">AI Multi-Agent Panel</p>
          <h2 className="mt-1 text-xl font-bold text-white">Specialist analysis flow</h2>
        </div>
        <Activity className="h-5 w-5 text-googleYellow" aria-hidden="true" />
      </div>

      <div className="grid gap-3">
        {agents.map((agent, index) => {
          const status = getStatus(index, activeIndex, loading);
          const Icon = agent.icon;
          return (
            <article key={agent.name} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
              <div className="flex items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-lg ${status.iconBg}`}>
                  <Icon className={`h-5 w-5 ${status.iconColor}`} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-white">{agent.name}</h3>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold ${status.textColor}`}>
                      {status.done && <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-cloud/65">{agent.task}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${status.bar} transition-all duration-500`}
                      style={{ width: `${status.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function getStatus(index, activeIndex, loading) {
  if (!loading || index < activeIndex) {
    return {
      label: "Completed",
      progress: 100,
      done: true,
      iconBg: "bg-googleGreen/15",
      iconColor: "text-emerald-200",
      textColor: "text-emerald-200",
      bar: "bg-googleGreen",
    };
  }

  if (index === activeIndex) {
    return {
      label: "Processing",
      progress: 68,
      done: false,
      iconBg: "bg-googleBlue/15",
      iconColor: "text-blue-200",
      textColor: "text-blue-200",
      bar: "animate-pulse bg-googleBlue",
    };
  }

  return {
    label: "Queued",
    progress: 18,
    done: false,
    iconBg: "bg-white/10",
    iconColor: "text-cloud/50",
    textColor: "text-cloud/50",
    bar: "bg-white/20",
  };
}

