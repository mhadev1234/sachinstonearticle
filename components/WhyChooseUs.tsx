"use client";

import { CheckCircle2, Cog, Gem, Globe2, Ruler, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WhyChooseUs() {
  const t = useTranslations("WhyChooseUs");
  const features = [
    ["experience", CheckCircle2],
    ["quality", Gem],
    ["custom", Ruler],
    ["india", Globe2],
    ["cnc", Cog],
    ["delivery", Truck],
  ] as const;

  return (
    <section id="why" className="border-t border-zinc-900 bg-black px-5 py-20 text-white sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-500">{t("heading")}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {t("titleFirst")} <span className="text-yellow-500">{t("titleHighlight")}</span>
          </h2>
          <p className="mt-5 text-base leading-8 text-gray-400 sm:text-lg">{t("description")}</p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([key, Icon]) => (
            <div key={key} className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                <Icon className="h-6 w-6 text-yellow-500" strokeWidth={1.7} />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white group-hover:text-yellow-500">{t(`features.${key}.title`)}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-500">{t(`features.${key}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
