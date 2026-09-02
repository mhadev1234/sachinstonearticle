import { ClipboardList, DraftingCompass, Gem, Scissors, Cog, Sparkles, ShieldCheck, Truck } from "lucide-react";

const steps = [
  ["01", "Requirement", "Understand your project, dimensions, style and site needs.", ClipboardList],
  ["02", "Design", "Discuss the design direction, detailing and customization.", DraftingCompass],
  ["03", "Stone Selection", "Choose suitable natural stone and finish for the application.", Gem],
  ["04", "Cutting", "Prepare stone accurately for the required dimensions and design.", Scissors],
  ["05", "CNC / Hand Carving", "Create detailed patterns using the appropriate craftsmanship method.", Cog],
  ["06", "Finishing", "Refine surfaces and carved details for the intended final appearance.", Sparkles],
  ["07", "Quality Check", "Review workmanship, dimensions and finishing before dispatch.", ShieldCheck],
  ["08", "Delivery / Installation", "Coordinate the next project step according to the agreed scope.", Truck],
] as const;

export default function Process() {
  return (
    <section id="process" className="border-t border-zinc-900 bg-zinc-950 px-5 py-20 text-white sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-500">Our Process</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            From concept to <span className="text-yellow-500">crafted stone</span>
          </h2>
          <p className="mt-5 text-base leading-8 text-gray-400 sm:text-lg">
            A clear, craftsmanship-focused workflow designed to keep custom stone projects organized from the first requirement to the final stage.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([number, title, description, Icon]) => (
            <article key={number} className="group relative rounded-2xl border border-zinc-800 bg-black p-6 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.25em] text-yellow-500">{number}</span>
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-2.5">
                  <Icon className="h-5 w-5 text-yellow-500" strokeWidth={1.7} />
                </div>
              </div>
              <h3 className="mt-7 text-lg font-semibold text-white group-hover:text-yellow-500">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-500">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
