export default function MetricCard({ label, value, detail, accent = "blue" }) {
  const accents = {
    blue: "from-googleBlue/30 to-cyan-400/10 text-cyan-100",
    green: "from-googleGreen/30 to-emerald-300/10 text-emerald-100",
    yellow: "from-googleYellow/30 to-amber-300/10 text-amber-100",
    red: "from-googleRed/30 to-rose-300/10 text-rose-100",
  };

  return (
    <div className={`soft-panel rounded-lg bg-gradient-to-br p-5 ${accents[accent]}`}>
      <p className="text-sm font-medium text-cloud/70">{label}</p>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-4xl font-extrabold tracking-normal text-white">{value}</span>
        {detail && <span className="pb-1 text-sm font-semibold text-cloud/70">{detail}</span>}
      </div>
    </div>
  );
}

