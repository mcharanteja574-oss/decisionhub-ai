import { Megaphone, Network } from "lucide-react";

export default function ExplanationPanel({ explanation, advisory }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <article className="glass rounded-lg p-5">
        <div className="mb-3 flex items-center gap-2">
          <Network className="h-5 w-5 text-googleBlue" aria-hidden="true" />
          <h2 className="text-lg font-bold text-white">Decision Intelligence Analysis</h2>
        </div>
        <p className="text-sm leading-7 text-cloud/80">{explanation}</p>
      </article>
      <article className="glass rounded-lg p-5">
        <div className="mb-3 flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-googleYellow" aria-hidden="true" />
          <h2 className="text-lg font-bold text-white">Citizen Public Advisory</h2>
        </div>
        <p className="text-sm leading-7 text-cloud/80">{advisory}</p>
      </article>
    </section>
  );
}
