import { Ambulance, CloudSun, Home, Hospital, MessageSquareWarning, Route } from "lucide-react";

const sources = [
  ["Weather Forecast", "Structured API", "2 min ago", "Active", CloudSun],
  ["Hospital Capacity", "Structured feed", "5 min ago", "Validated", Hospital],
  ["Traffic Conditions", "Live mobility data", "1 min ago", "Active", Route],
  ["Citizen Reports", "Unstructured reports", "3 min ago", "Screened", MessageSquareWarning],
  ["Shelter Availability", "Public services registry", "8 min ago", "Ready", Home],
  ["Emergency Resources", "Operations roster", "6 min ago", "Available", Ambulance],
];

export default function DataSourcesPanel() {
  return (
    <section className="glass rounded-lg p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-googleYellow">Data Sources</p>
      <h2 className="mt-1 text-xl font-bold text-white">Structured and unstructured signals analyzed</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sources.map(([name, type, updated, status, icon]) => {
          const Icon = icon;
          return (
            <article key={name} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-googleYellow/40">
              <div className="flex items-start justify-between gap-3">
                <Icon className="h-5 w-5 text-googleYellow" aria-hidden="true" />
                <span className="rounded-full bg-googleGreen/15 px-2.5 py-1 text-xs font-bold text-emerald-200">
                  {status}
                </span>
              </div>
              <h3 className="mt-3 font-bold text-white">{name}</h3>
              <p className="mt-1 text-sm text-cloud/65">{type}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-cloud/45">Last updated {updated}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

