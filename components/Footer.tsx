 "use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-black px-6 py-12 text-white">

      <div className="mx-auto grid max-w-6xl gap-8 text-center md:grid-cols-3 md:text-left">

        {/* Company */}
        <div>
          <h2 className="mb-3 text-2xl font-bold text-yellow-500">
            Sachin Stone & Article
          </h2>

          <p className="leading-7 text-gray-300">
            Premium Temple Stone Work, Murti Making,
            CNC Stone Jali and Architectural Stone Projects
            with 15+ years of experience.
          </p>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-3 text-xl font-semibold text-yellow-500">
            {t("services")}
          </h3>

          <ul className="space-y-2 text-gray-300">
            <li>Temple Stone Work</li>
            <li>Stone Carving</li>
            <li>Murti Making</li>
            <li>CNC Stone Jali Work</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-3 text-xl font-semibold text-yellow-500">
            {t("contact")}
          </h3>

          <p className="text-gray-300">
            Sikandra, Dausa, Rajasthan, India
          </p>

          <a
            href="tel:+919829676595"
            className="mt-2 block text-gray-300 transition hover:text-yellow-400"
          >
            +91 98296 76595
          </a>

          <a
            href="https://wa.me/917300479168"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-gray-300 transition hover:text-yellow-400"
          >
            WhatsApp: +91 73004 79168
          </a>
        </div>

      </div>

      <div className="mt-10 border-t border-gray-700 pt-5 text-center">

        <div className="mb-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">

          <a
            href="/privacy-policy"
            className="text-gray-400 transition hover:text-yellow-400"
          >
            {t("privacy")}
          </a>

          <a
            href="/terms"
            className="text-gray-400 transition hover:text-yellow-400"
          >
            {t("terms")}
          </a>

        </div>

        <p className="text-gray-400">
          © {new Date().getFullYear()} Sachin Stone & Article.{" "}
          {t("rights")}
        </p>

      </div>

    </footer>
  );
}