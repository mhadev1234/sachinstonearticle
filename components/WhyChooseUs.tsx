 "use client";

import { useTranslations } from "next-intl";

export default function WhyChooseUs() {
  const t = useTranslations("WhyChooseUs");

  const features = [
    {
      key: "experience",
      icon: "🏆",
    },
    {
      key: "quality",
      icon: "💎",
    },
    {
      key: "custom",
      icon: "📐",
    },
    {
      key: "india",
      icon: "🇮🇳",
    },
    {
      key: "cnc",
      icon: "⚙️",
    },
    {
      key: "delivery",
      icon: "🚚",
    },
  ];

  return (
    <section
      id="why"
      className="bg-zinc-950 px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl">

        <div className="text-center">

          <p className="text-lg font-bold uppercase tracking-[5px] text-yellow-500">
            {t("heading")}
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            {t("titleFirst")}
            <span className="text-yellow-500">
              {t("titleHighlight")}
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-400">
            {t("description")}
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {features.map((item) => (
            <div
              key={item.key}
              className="rounded-3xl border border-yellow-500/20 bg-black p-8 transition duration-300 hover:-translate-y-2 hover:border-yellow-500"
            >

              <div className="text-5xl">
                {item.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold text-yellow-500">
                {t(`features.${item.key}.title`)}
              </h3>

              <p className="mt-4 leading-8 text-gray-400">
                {t(`features.${item.key}.description`)}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}