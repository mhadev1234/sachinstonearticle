"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useManagedImages } from "@/lib/useManagedImages";

export default function About() {
  const t = useTranslations("About");
  const managed = useManagedImages("home", "about", [{ src: "/image/about.jpeg", alt: "About Sachin Stone" }]);

  return (
    <section
      id="about"
      className="bg-black px-5 py-24 text-white sm:px-8"
    >
      {/* Center Heading */}
      <div className="mx-auto mb-24 max-w-5xl text-center">
        <span className="inline-block rounded-full border border-yellow-500/40 bg-yellow-500/10 px-10 py-4 text-2xl font-bold uppercase tracking-[5px] text-yellow-400">
          {t("heading")}
        </span>
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

        {/* Left Image */}
        <div className="relative">
          <Image
            src={managed.images[0]?.src || "/image/about.jpeg"}
            alt="About Sachin Stone"
            width={700}
            height={700}
            className="rounded-3xl border border-yellow-500/30 shadow-2xl"
          />

          <div className="absolute -bottom-6 -right-6 rounded-2xl bg-yellow-500 px-8 py-6 text-center text-black shadow-xl">
            <h3 className="text-4xl font-bold">15+</h3>

            <p className="font-semibold">
              {t("yearsExperience")}
            </p>
          </div>
        </div>

        {/* Right Content */}
        <div>
          <h2 className="text-5xl font-bold leading-tight">
            {t("titleFirst")}
            <span className="text-yellow-500">
              {" "}{t("titleHighlight")}
            </span>
            <br />
            {t("titleLast")}
          </h2>

          <p className="mt-8 text-lg leading-9 text-gray-300">
            {t("description")}
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">

            {/* Premium Quality */}
            <div className="rounded-2xl border border-yellow-500/20 bg-white/5 p-6">
              <h3 className="text-2xl font-bold text-yellow-500">
                ✔ {t("premiumQuality.title")}
              </h3>

              <p className="mt-3 text-gray-300">
                {t("premiumQuality.description")}
              </p>
            </div>

            {/* Experienced Team */}
            <div className="rounded-2xl border border-yellow-500/20 bg-white/5 p-6">
              <h3 className="text-2xl font-bold text-yellow-500">
                ✔ {t("experiencedTeam.title")}
              </h3>

              <p className="mt-3 text-gray-300">
                {t("experiencedTeam.description")}
              </p>
            </div>

            {/* Custom Design */}
            <div className="rounded-2xl border border-yellow-500/20 bg-white/5 p-6">
              <h3 className="text-2xl font-bold text-yellow-500">
                ✔ {t("customDesign.title")}
              </h3>

              <p className="mt-3 text-gray-300">
                {t("customDesign.description")}
              </p>
            </div>

            {/* All India Service */}
            <div className="rounded-2xl border border-yellow-500/20 bg-white/5 p-6">
              <h3 className="text-2xl font-bold text-yellow-500">
                ✔ {t("allIndiaService.title")}
              </h3>

              <p className="mt-3 text-gray-300">
                {t("allIndiaService.description")}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}