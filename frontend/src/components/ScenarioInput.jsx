import { CheckCircle2, RadioTower, Send, Sparkles } from "lucide-react";

const thinkingSteps = [
  "Analyzing weather and rainfall signals",
  "Checking healthcare capacity",
  "Evaluating roads and citizen reports",
  "Generating recommendations and trade-offs",
];

export default function ScenarioInput({ scenario, setScenario, onAnalyze, loading, error, analysisMeta }) {
  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-googleBlue">Natural Language Decision Assistant</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Describe the operating picture</h2>
        </div>
        <Sparkles className="h-6 w-6 text-googleYellow" aria-hidden="true" />
      </div>
      <textarea
        value={scenario}
        onChange={(event) => setScenario(event.target.value)}
        className="min-h-32 w-full resize-y rounded-lg border border-white/10 bg-white/[0.04] p-4 text-base text-white outline-none transition focus:border-googleBlue focus:ring-4 focus:ring-googleBlue/15"
        placeholder="Heavy rainfall expected tomorrow with hospital occupancy at 82%."
      />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-cloud/65">
          {error || "Gemini enriches the plan when an API key is configured; fallback reasoning keeps the demo responsive."}
        </p>
        <button
          onClick={() => onAnalyze()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-googleBlue px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {loading ? "Analyzing" : "Run Decision Intelligence Analysis"}
        </button>
      </div>
      <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {loading ? (
              <RadioTower className="h-5 w-5 animate-pulse text-googleBlue" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-googleGreen" aria-hidden="true" />
            )}
            <div>
              <p className="text-sm font-bold text-white">{analysisMeta.status}</p>
              <p className="text-xs text-cloud/55">
                {analysisMeta.lastGeneratedAt
                  ? `Last generated at ${analysisMeta.lastGeneratedAt} · Run ${analysisMeta.runCount}`
                  : "Ready to generate the first report"}
              </p>
            </div>
          </div>
          <span className="w-fit rounded-full bg-googleBlue/15 px-3 py-1 text-xs font-bold text-blue-100">
            {analysisMeta.source}
          </span>
        </div>
        {loading && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {thinkingSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-2 rounded-lg bg-ink/40 px-3 py-2">
                <span
                  className="h-2 w-2 rounded-full bg-googleBlue"
                  style={{ animation: `pulse 1.2s ease-in-out ${index * 160}ms infinite` }}
                />
                <span className="text-xs font-semibold text-cloud/75">{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
