export default function WhyThisMatters() {
  return (
    <section className="glass rounded-lg p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-googleGreen">Why This Matters</p>
      <h2 className="mt-1 text-xl font-bold text-white">Estimated decision time comparison</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Comparison label="Traditional Process" value="25" detail="minutes" width="100%" tone="from-googleRed to-googleYellow" />
        <Comparison label="DecisionHub AI" value="2" detail="minutes" width="8%" tone="from-googleGreen to-googleBlue" />
      </div>
      <p className="mt-4 text-sm leading-6 text-cloud/60">
        Simulated prototype comparison for judging demonstration. Actual results depend on data integrations, operating procedures, and command approvals.
      </p>
    </section>
  );
}

function Comparison({ label, value, detail, width, tone }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <p className="text-sm font-bold text-cloud/65">{label}</p>
      <p className="mt-2 text-5xl font-extrabold text-white">
        {value}
        <span className="ml-2 text-sm font-bold text-cloud/60">{detail}</span>
      </p>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full bg-gradient-to-r ${tone}`} style={{ width }} />
      </div>
    </article>
  );
}

