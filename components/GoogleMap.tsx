 "use client";

import { useTranslations } from "next-intl";

export default function GoogleMap() {
  const t = useTranslations("GoogleMap");

  return (
    <section
      id="map"
      className="border-t border-zinc-900 bg-black px-5 py-12 text-white sm:px-8"
    >
      <h2 className="mb-7 text-center text-3xl font-bold text-white sm:text-4xl">
        {t("heading")}
      </h2>

      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-yellow-500/30">

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10910.297925440449!2d76.584462897844!3d26.946773199021777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39727336a6d0b869%3A0xe7b0f8a3cf2fc534!2sSachin%20stone%20cutting%20%26%20articles!5e0!3m2!1sen!2sin!4v1784816243811!5m2!1sen!2sin"
          width="100%"
          height="360"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />

      </div>
    </section>
  );
}