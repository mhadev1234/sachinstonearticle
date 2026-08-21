 "use client";

import { useTranslations } from "next-intl";

export default function Services() {
  const t = useTranslations("Services");

  const services = [
    {
      icon: "🛕",
      title: t("items.temple.title"),
      description: t("items.temple.description"),
    },
    {
      icon: "🪨",
      title: t("items.carving.title"),
      description: t("items.carving.description"),
    },
    {
      icon: "⚙️",
      title: t("items.cnc.title"),
      description: t("items.cnc.description"),
    },
    {
      icon: "🗿",
      title: t("items.murti.title"),
      description: t("items.murti.description"),
    },
    {
      icon: "🏨",
      title: t("items.hotel.title"),
      description: t("items.hotel.description"),
    },
    {
      icon: "🚆",
      title: t("items.railway.title"),
      description: t("items.railway.description"),
    },
  ];

  return (
    <section
      id="services"
      className="bg-black px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="text-center">

          <p className="text-lg font-bold uppercase tracking-[5px] text-yellow-500">
            {t("heading")}
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            {t("title")}
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400">
            {t("description")}
          </p>

        </div>

        {/* Services Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-8 transition duration-300 hover:-translate-y-2 hover:border-yellow-500 hover:shadow-xl"
            >

              {/* Icon */}
              <div className="text-5xl">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="mt-6 text-2xl font-bold text-yellow-500">
                {service.title}
              </h3>

              {/* Description */}
              <p className="mt-4 leading-8 text-gray-400">
                {service.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}