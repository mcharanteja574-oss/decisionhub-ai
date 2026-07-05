import { Activity, Building2, HeartHandshake, ShieldPlus, Wrench } from "lucide-react";

const icons = [HeartHandshake, Building2, Activity, ShieldPlus, Wrench];

export default function CommunityImpactDashboard({ metrics = [] }) {
  return (
    <section className="glass rounded-lg p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-googleGreen">Community Impact</p>
      <h2 className="mt-1 text-xl font-bold text-white">AI-generated estimates for demonstration purposes</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric, index) => {
          const Icon = icons[index] || Activity;
          return (
            <article key={metric.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <Icon className="h-5 w-5 text-googleGreen" aria-hidden="true" />
              <p className="mt-4 text-3xl font-extrabold text-white">
                {metric.value}
                <span className="ml-1 text-sm font-bold text-cloud/60">{metric.unit}</span>
              </p>
              <h3 className="mt-2 text-sm font-bold text-white">{metric.label}</h3>
              <p className="mt-2 text-xs leading-5 text-cloud/60">{metric.summary}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

