import { CheckCircle2 } from "lucide-react";

export default function PriorityActions({ actions = [], fallback = [] }) {
  const items =
    actions.length > 0
      ? actions
      : fallback.map((title, index) => ({
          title,
          priority: index === 0 ? "Immediate" : "High",
          owner: "Operations",
          rationale: "Recommended by the decision engine.",
        }));

  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Priority Actions</h2>
        <span className="rounded-full bg-googleGreen/15 px-3 py-1 text-xs font-bold text-emerald-200">
          {items.length} actions
        </span>
      </div>
      <div className="grid gap-3">
        {items.map((item) => (
          <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-googleGreen" aria-hidden="true" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-cloud">
                    {item.priority}
                  </span>
                </div>
                <p className="mt-1 text-sm text-cloud/70">{item.owner}</p>
                <p className="mt-2 text-sm leading-6 text-cloud/80">{item.rationale}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

