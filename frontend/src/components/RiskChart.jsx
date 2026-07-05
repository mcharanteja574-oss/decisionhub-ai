import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function RiskChart({ data = [] }) {
  return (
    <section className="glass rounded-lg p-5">
      <h2 className="text-xl font-bold text-white">Decision Intelligence Report</h2>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="risk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ea4335" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#ea4335" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="capacity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4285f4" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#4285f4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="label" stroke="#9fb1c9" tickLine={false} axisLine={false} />
            <YAxis stroke="#9fb1c9" tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: "#0b1728",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                color: "#fff",
              }}
            />
            <Area type="monotone" dataKey="risk" stroke="#ea4335" strokeWidth={3} fill="url(#risk)" />
            <Area type="monotone" dataKey="capacity" stroke="#4285f4" strokeWidth={3} fill="url(#capacity)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
