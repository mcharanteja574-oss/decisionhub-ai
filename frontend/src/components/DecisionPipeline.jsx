import { BrainCircuit, CheckCircle2, FileText, GitCompareArrows, Radar, ShieldAlert, SlidersHorizontal, UploadCloud } from "lucide-react";

const steps = [
  ["Data Collection", UploadCloud],
  ["Data Validation", CheckCircle2],
  ["Gemini Decision Engine", BrainCircuit],
  ["Risk Assessment", ShieldAlert],
  ["Scenario Simulation", SlidersHorizontal],
  ["Recommendation Generation", Radar],
  ["Decision Replay", GitCompareArrows],
  ["Executive Report", FileText],
];

export default function DecisionPipeline() {
  return (
    <section className="glass rounded-lg p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-googleBlue">AI Decision Pipeline</p>
      <h2 className="mt-1 text-xl font-bold text-white">From fragmented signals to executive action</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {steps.map(([label, icon], index) => {
          const Icon = icon;
          return (
            <article key={label} className="relative rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-0.5 hover:border-googleBlue/45">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-googleBlue/15">
                <Icon className="h-5 w-5 text-blue-100" aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm font-bold text-white">{label}</p>
              <p className="mt-1 text-xs font-semibold text-cloud/45">Step {index + 1}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

