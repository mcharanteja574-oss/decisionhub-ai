import { BellRing, LifeBuoy, Map, Siren, Wrench } from "lucide-react";

const phaseIcons = [BellRing, LifeBuoy, Siren, Map, Wrench];

export default function DecisionTimeline({ timeline = [] }) {
  return (
    <section className="glass rounded-lg p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-googleBlue">Operational Sequence</p>
          <h2 className="mt-1 text-xl font-bold text-white">Decision Timeline</h2>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-cloud/80">
          48 hour plan
        </span>
      </div>
      <div className="mt-5 grid gap-4">
        {timeline.map((item, index) => (
          <TimelineItem key={`${item.time}-${item.action}`} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

function TimelineItem({ item, index }) {
  const Icon = phaseIcons[index] || Siren;

  return (
    <div className="grid grid-cols-[92px_1fr] gap-4">
      <div className="pt-1 text-sm font-extrabold text-googleBlue">{item.time}</div>
      <div className="relative border-l border-white/15 pb-5 pl-5 last:pb-0">
        <span className="absolute -left-4 top-0 grid h-8 w-8 place-items-center rounded-full border border-googleBlue/50 bg-ink shadow-glow">
          <Icon className="h-4 w-4 text-googleBlue" aria-hidden="true" />
        </span>
        <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-googleBlue/35 hover:bg-white/[0.07]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-bold text-white">Phase {index + 1}</h3>
            <span className="w-fit rounded-full bg-googleBlue/15 px-2.5 py-1 text-xs font-bold text-blue-100">
              {getPhaseLabel(index)}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-cloud/85">{item.action}</p>
        </article>
      </div>
    </div>
  );
}

function getPhaseLabel(index) {
  return ["Alert", "Shelter", "Response", "Closure", "Recovery"][index] || "Action";
}
