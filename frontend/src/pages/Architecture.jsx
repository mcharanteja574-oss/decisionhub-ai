import { ArrowLeft, Building2, BrainCircuit, Cloud, FileText, Gauge, Server, Monitor } from "lucide-react";
import { Link } from "react-router-dom";

const nodes = [
  ["Community Data Sources", Building2],
  ["FastAPI Backend", Server],
  ["Google Gemini", Cloud],
  ["Decision Intelligence Engine", BrainCircuit],
  ["Dashboard", Monitor],
  ["Executive Report", FileText],
];

export default function Architecture() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-cloud hover:bg-white/15">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Community Decision Center
      </Link>
      <section className="mt-6 glass rounded-lg p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-googleBlue">System Architecture</p>
        <h1 className="mt-2 text-4xl font-extrabold text-white">DecisionHub AI Reference Flow</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-cloud/75">
          The prototype converts community signals into explainable decisions using a FastAPI orchestration layer, Gemini reasoning, deterministic safeguards, and an executive dashboard.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {nodes.map(([label, icon], index) => {
            const Icon = icon;
            return (
              <article key={label} className="relative rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-googleBlue/45">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-googleBlue/15">
                  <Icon className="h-6 w-6 text-blue-100" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-white">{label}</h2>
                <p className="mt-2 text-sm leading-6 text-cloud/65">Layer {index + 1}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-8 rounded-lg border border-white/10 bg-ink/35 p-5">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-googleGreen" aria-hidden="true" />
            <h2 className="text-lg font-bold text-white">Judging Alignment</h2>
          </div>
          <p className="mt-3 text-sm leading-7 text-cloud/75">
            Architecture emphasizes solution quality, feasibility, impact, and explainable Gen AI usage: Gemini interprets fragmented conditions, while the Decision Intelligence Engine normalizes timelines, scores readiness, and preserves reliable fallback behavior for demos.
          </p>
        </div>
      </section>
    </main>
  );
}

