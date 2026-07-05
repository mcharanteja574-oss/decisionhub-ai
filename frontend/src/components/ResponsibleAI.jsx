import { Eye, ShieldCheck } from "lucide-react";

export default function ResponsibleAI({ result }) {
  const responsible = result.responsible_ai;
  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-googleYellow">Responsible AI</p>
          <h2 className="mt-1 text-xl font-bold text-white">Confidence, limitations, and reasoning transparency</h2>
        </div>
        <ShieldCheck className="h-6 w-6 text-googleYellow" aria-hidden="true" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm font-bold text-cloud/60">Confidence Score</p>
          <p className="mt-2 text-5xl font-extrabold text-white">{result.confidence}%</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-googleGreen to-googleBlue" style={{ width: `${result.confidence}%` }} />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <InfoBlock title="Reasoning Transparency" body={responsible?.reasoning_summary || result.explanation} />
          <InfoBlock title="Explainability" body={responsible?.explainability || "Evidence, alternatives, and trade-offs are shown in Decision Replay."} />
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-white">
              <Eye className="h-4 w-4 text-googleBlue" aria-hidden="true" />
              Data Sources Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {(responsible?.data_sources_used || []).map((source) => (
                <span key={source} className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-cloud">
                  {source}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <h3 className="font-bold text-white">Limitations</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-cloud/70">
              {(responsible?.limitations || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoBlock({ title, body }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <h3 className="font-bold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-cloud/70">{body}</p>
    </article>
  );
}

