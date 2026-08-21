 "use client";

import Image from "next/image";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

const languages = [
  { code: "hi", name: "हिंदी" },
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "zh", name: "中文" },
  { code: "fr", name: "Français" },
  { code: "ru", name: "Русский" },
];

const navLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "products", href: "/products" },
  { key: "gallery", href: "/gallery" },
  { key: "reviews", href: "/reviews" },
  { key: "contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const t = useTranslations("Navbar");

  function changeLanguage(language: string) {
    router.replace(pathname, {
      locale: language,
    });

    setMenuOpen(false);
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-yellow-500/20 bg-black/90 backdrop-blur-md">
      {/* MAIN NAVBAR */}

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* LOGO */}

        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="overflow-hidden rounded-full border-2 border-yellow-500">
            <Image
              src="/image/logo.png"
              alt="Sachin Stone and Article"
              width={48}
              height={48}
              className="h-12 w-12 object-cover md:h-14 md:w-14"
              priority
            />
          </div>

          <div className="leading-tight">
            <h1 className="whitespace-nowrap text-lg font-bold text-yellow-500 md:text-2xl">
              Sachin Stone
            </h1>

            <p className="whitespace-nowrap text-[11px] text-gray-300 md:text-sm">
              & Article
            </p>
          </div>
        </Link>

        {/* DESKTOP MENU */}

        <ul className="hidden items-center gap-5 text-white lg:flex">
          {navLinks.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                className="font-medium transition hover:text-yellow-500"
              >
                {t(link.key)}
              </Link>
            </li>
          ))}
        </ul>

        {/* DESKTOP RIGHT */}

        <div className="hidden items-center gap-4 md:flex">
          {/* LANGUAGE */}

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">
              {t("language")}:
            </span>

            <select
              value={locale}
              onChange={(e) => changeLanguage(e.target.value)}
              aria-label={t("language")}
              className="rounded-lg border border-yellow-500/40 bg-black px-2 py-2 text-sm text-white outline-none"
            >
              {languages.map((language) => (
                <option
                  key={language.code}
                  value={language.code}
                  className="bg-black text-white"
                >
                  {language.name}
                </option>
              ))}
            </select>
          </div>

          {/* GET QUOTE */}

          <Link
            href="/contact"
            className="rounded-full bg-yellow-500 px-5 py-2 font-semibold text-black transition hover:bg-yellow-400"
          >
            {t("getQuote")}
          </Link>
        </div>

        {/* MOBILE RIGHT */}

        <div className="flex items-center gap-3 lg:hidden">
          {/* MOBILE LANGUAGE */}

          <div className="flex items-center gap-1">
            <span className="hidden text-xs font-medium text-white sm:block">
              {t("language")}:
            </span>

            <select
              value={locale}
              onChange={(e) => changeLanguage(e.target.value)}
              aria-label={t("language")}
              className="rounded-lg border border-yellow-500/40 bg-black px-2 py-2 text-xs text-white outline-none"
            >
              {languages.map((language) => (
                <option
                  key={language.code}
                  value={language.code}
                  className="bg-black text-white"
                >
                  {language.name}
                </option>
              ))}
            </select>
          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center text-3xl text-yellow-500"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}

      {menuOpen && (
        <div className="border-t border-yellow-500/20 bg-black lg:hidden">
          <ul className="flex flex-col items-center gap-4 px-6 py-6 text-white">
            {navLinks.map((link) => (
              <li key={link.key} className="w-full text-center">
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 font-medium transition hover:text-yellow-500"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}

            {/* MOBILE GET QUOTE */}

            <li className="pt-2">
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="inline-block rounded-full bg-yellow-500 px-7 py-3 font-semibold text-black transition hover:bg-yellow-400"
              >
                {t("getQuote")}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}