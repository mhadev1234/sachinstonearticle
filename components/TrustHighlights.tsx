import { CheckCircle2, MapPinned, ShieldCheck, Sparkles } from "lucide-react";

const trust = [
  ["15+", "Years Experience", Sparkles],
  ["500+", "Projects Completed", CheckCircle2],
  ["100%", "Quality Focus", ShieldCheck],
  ["India", "Service Coverage", MapPinned],
] as const;

export default function TrustHighlights() {
  return (
    <section className="border-t border-zinc-900 bg-zinc-950 px-5 py-10 text-white sm:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-zinc-800 overflow-hidden rounded-2xl border border-zinc-800 sm:grid-cols-4 sm:divide-y-0">
        {trust.map(([value, label, Icon]) => (
          <div key={label} className="flex items-center gap-3 px-4 py-5 sm:justify-center sm:px-5">
            <Icon className="h-5 w-5 shrink-0 text-yellow-500" />
            <div><p className="text-xl font-bold text-white">{value}</p><p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{label}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
