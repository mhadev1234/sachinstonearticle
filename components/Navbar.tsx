 "use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type MenuItem = {
  name: string;
  slug: string;
};

const services: MenuItem[] = [
  {
    name: "Temple Stone Work",
    slug: "temple-stone-work",
  },
  {
    name: "CNC Stone Jali",
    slug: "cnc-stone-jali",
  },
  {
    name: "Murti Making",
    slug: "murti-making",
  },
  {
    name: "Stone Carving",
    slug: "stone-carving",
  },
  {
    name: "Stone Cutting",
    slug: "stone-cutting",
  },
  {
    name: "Architectural Stone Work",
    slug: "architectural-stone-work",
  },
  {
    name: "Hotel/Resort Stone Work",
    slug: "hotel-resort-stone-work",
  },
  {
    name: "Railway Station Stone Work",
    slug: "railway-station-stone-work",
  },
];

/* =====================================================
   PRODUCTS
   FINAL SELECTED PRODUCTS
===================================================== */
 
   const products: MenuItem[] = [
  {
    name: "Stone Temple",
    slug: "temple-stone-dome",
  },
  {
    name: "Stone Murti",
    slug: "marble-stone-murti",
  },
  {
    name: "Stone Chhatri",
    slug: "stone-chhatri-gazebo",
  },
  {
    name: "Stone Door",
    slug: "stone-doors-frames",
  },
  {
    name: "Stone Jali",
    slug: "temple-stone-jali",
  },
  {
    name: "Stone Pillar",
    slug: "stone-pillars-columns",
  },
  {
    name: "Stone Fountain",
    slug: "stone-fountains",
  },
  {
    name: "Stone Window",
    slug: "stone-window",
  },
  {
    name: "Stone Architectural Products",
    slug: "custom-architectural-stone-work",
  },
];
   

const languages = [
  { name: "English", code: "en" },
  { name: "हिन्दी", code: "hi" },
];

const themes = [
  { name: "Royal Dark", value: "royal-dark" },
  { name: "Stone", value: "stone" },
  { name: "Luxury Light", value: "luxury-light" },
];

export default function Navbar() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const currentLocale =
    pathname.split("/")[1] === "hi"
      ? "hi"
      : "en";

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [openDropdown, setOpenDropdown] =
    useState<
      | "services"
      | "products"
      | "language"
      | "theme"
      | null
    >(null);

  const [mobileSection, setMobileSection] =
    useState<"services" | "products" | null>(
      null
    );

  const [theme, setTheme] =
    useState("royal-dark");

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("site-theme");

    if (
      savedTheme === "royal-dark" ||
      savedTheme === "stone" ||
      savedTheme === "luxury-light"
    ) {
      setTheme(savedTheme);

      document.documentElement.setAttribute(
        "data-theme",
        savedTheme
      );
    } else {
      document.documentElement.setAttribute(
        "data-theme",
        "royal-dark"
      );
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const localizedPath = (path: string) => {
    if (path === "/") {
      return `/${currentLocale}`;
    }

    return `/${currentLocale}${path}`;
  };

  const closeAll = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileSection(null);
  };

  const toggleDropdown = (
    dropdown:
      | "services"
      | "products"
      | "language"
      | "theme"
  ) => {
    setOpenDropdown((current) =>
      current === dropdown
        ? null
        : dropdown
    );
  };

  const changeTheme = (value: string) => {
    setTheme(value);

    localStorage.setItem(
      "site-theme",
      value
    );

    document.documentElement.setAttribute(
      "data-theme",
      value
    );

    setOpenDropdown(null);
  };

  const changeLanguage = (
    locale: string
  ) => {
    const segments =
      pathname.split("/");

    if (
      segments[1] === "en" ||
      segments[1] === "hi"
    ) {
      segments[1] = locale;
    } else {
      segments.splice(1, 0, locale);
    }

    window.location.href =
      segments.join("/") ||
      `/${locale}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-yellow-500/30 bg-black">
      <nav
        ref={menuRef}
        className="mx-auto flex min-h-[88px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* LOGO + BRAND */}
        <Link
          href={localizedPath("/")}
          onClick={closeAll}
          className="flex shrink-0 items-center gap-3"
        >
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-yellow-500">
            <Image
              src="/image/logo.png"
              alt="Sachin Stone & Article"
              fill
              priority
              sizes="64px"
              className="object-cover"
            />
          </div>

          <div className="hidden leading-tight sm:block">
            <div className="text-2xl font-bold text-yellow-500">
              Sachin
            </div>

            <div className="text-sm text-white">
              Stone &amp; Article
            </div>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-1 lg:flex">
          <Link
            href={localizedPath("/")}
            className="rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-yellow-500/10 hover:text-yellow-400"
          >
            Home
          </Link>

          <Link
            href={localizedPath("/about")}
            className="rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-yellow-500/10 hover:text-yellow-400"
          >
            About
          </Link>

          {/* SERVICES */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                toggleDropdown("services")
              }
              className="flex items-center gap-1 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-yellow-500/10 hover:text-yellow-400"
            >
              Services

              <span
                className={`text-xs transition-transform duration-200 ${
                  openDropdown === "services"
                    ? "rotate-180"
                    : ""
                }`}
              >
                ▾
              </span>
            </button>

            {openDropdown === "services" && (
              <div className="absolute left-0 top-full mt-2 w-72 overflow-hidden rounded-xl border border-yellow-500/30 bg-black p-2 shadow-2xl">
                <Link
                  href={localizedPath(
                    "/services"
                  )}
                  onClick={closeAll}
                  className="block rounded-lg border-b border-yellow-500/20 px-4 py-3 font-semibold text-yellow-400 transition hover:bg-yellow-500/10"
                >
                  All Services
                </Link>

                {services.map(
                  (service) => (
                    <Link
                      key={service.slug}
                      href={localizedPath(
                        `/services/${service.slug}`
                      )}
                      onClick={closeAll}
                      className="block rounded-lg px-4 py-2.5 text-sm text-white transition hover:bg-yellow-500/10 hover:text-yellow-400"
                    >
                      {service.name}
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          {/* PRODUCTS */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                toggleDropdown("products")
              }
              className="flex items-center gap-1 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-yellow-500/10 hover:text-yellow-400"
            >
              Products

              <span
                className={`text-xs transition-transform duration-200 ${
                  openDropdown === "products"
                    ? "rotate-180"
                    : ""
                }`}
              >
                ▾
              </span>
            </button>

            {openDropdown === "products" && (
              <div className="absolute left-0 top-full mt-2 w-80 overflow-hidden rounded-xl border border-yellow-500/30 bg-black p-2 shadow-2xl">
                <Link
                  href={localizedPath(
                    "/products"
                  )}
                  onClick={closeAll}
                  className="block rounded-lg border-b border-yellow-500/20 px-4 py-3 font-semibold text-yellow-400 transition hover:bg-yellow-500/10"
                >
                  All Products
                </Link>

                {products.map(
                  (product) => (
                    <Link
                      key={product.slug}
                      href={localizedPath(
                        `/products/${product.slug}`
                      )}
                      onClick={closeAll}
                      className="block rounded-lg px-4 py-2.5 text-sm text-white transition hover:bg-yellow-500/10 hover:text-yellow-400"
                    >
                      {product.name}
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          <Link
            href={localizedPath("/gallery")}
            className="rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-yellow-500/10 hover:text-yellow-400"
          >
            Gallery
          </Link>

          <Link
            href={localizedPath("/contact")}
            className="rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-yellow-500/10 hover:text-yellow-400"
          >
            Contact
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">
          {/* LANGUAGE */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                toggleDropdown("language")
              }
              className="flex h-12 items-center gap-2 rounded-xl border border-yellow-500/40 px-4 text-sm font-medium text-white transition hover:border-yellow-500 hover:bg-yellow-500/10"
            >
              {currentLocale === "hi"
                ? "हिन्दी"
                : "English"}

              <span
                className={`text-xs transition-transform duration-200 ${
                  openDropdown === "language"
                    ? "rotate-180"
                    : ""
                }`}
              >
                ▾
              </span>
            </button>

            {openDropdown === "language" && (
              <div className="absolute right-0 top-full mt-2 w-36 overflow-hidden rounded-xl border border-yellow-500/30 bg-black shadow-xl">
                {languages.map(
                  (language) => (
                    <button
                      key={language.code}
                      type="button"
                      onClick={() =>
                        changeLanguage(
                          language.code
                        )
                      }
                      className="block w-full px-4 py-3 text-left text-sm text-white transition hover:bg-yellow-500/10 hover:text-yellow-400"
                    >
                      {language.name}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* THEME */}
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() =>
                toggleDropdown("theme")
              }
              className="flex h-12 items-center gap-2 rounded-xl border border-yellow-500/40 px-4 text-sm font-medium text-white transition hover:border-yellow-500 hover:bg-yellow-500/10"
            >
              Theme

              <span
                className={`text-xs transition-transform duration-200 ${
                  openDropdown === "theme"
                    ? "rotate-180"
                    : ""
                }`}
              >
                ▾
              </span>
            </button>

            {openDropdown === "theme" && (
              <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-yellow-500/30 bg-black shadow-xl">
                {themes.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      changeTheme(
                        item.value
                      )
                    }
                    className={`block w-full px-4 py-3 text-left text-sm transition ${
                      theme === item.value
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "text-white hover:bg-yellow-500/10 hover:text-yellow-400"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            aria-label={
              mobileOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={mobileOpen}
            onClick={() => {
              setMobileOpen(
                (value) => !value
              );
              setOpenDropdown(null);
            }}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-yellow-500/40 text-2xl text-yellow-500 transition hover:bg-yellow-500/10 lg:hidden"
          >
            {mobileOpen
              ? "✕"
              : "☰"}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="border-t border-yellow-500/20 bg-black lg:hidden">
          <div className="mx-auto max-w-[1600px] px-4 py-4">

            <Link
              href={localizedPath("/")}
              onClick={closeAll}
              className="block border-b border-white/10 px-3 py-3 text-white hover:text-yellow-400"
            >
              Home
            </Link>

            <Link
              href={localizedPath("/about")}
              onClick={closeAll}
              className="block border-b border-white/10 px-3 py-3 text-white hover:text-yellow-400"
            >
              About
            </Link>

            {/* MOBILE SERVICES */}
            <button
              type="button"
              onClick={() =>
                setMobileSection(
                  (current) =>
                    current === "services"
                      ? null
                      : "services"
                )
              }
              className="flex w-full items-center justify-between border-b border-white/10 px-3 py-3 text-left text-white"
            >
              <span>
                Services
              </span>

              <span className="text-yellow-500">
                {mobileSection ===
                "services"
                  ? "−"
                  : "+"}
              </span>
            </button>

            {mobileSection ===
              "services" && (
              <div className="border-b border-white/10 p-2">

                <Link
                  href={localizedPath(
                    "/services"
                  )}
                  onClick={closeAll}
                  className="block rounded-lg px-4 py-3 font-semibold text-yellow-400 hover:bg-yellow-500/10"
                >
                  All Services
                </Link>

                {services.map(
                  (service) => (
                    <Link
                      key={service.slug}
                      href={localizedPath(
                        `/services/${service.slug}`
                      )}
                      onClick={closeAll}
                      className="block rounded-lg px-4 py-2.5 text-sm text-white hover:bg-yellow-500/10 hover:text-yellow-400"
                    >
                      {service.name}
                    </Link>
                  )
                )}

              </div>
            )}

            {/* MOBILE PRODUCTS */}
            <button
              type="button"
              onClick={() =>
                setMobileSection(
                  (current) =>
                    current === "products"
                      ? null
                      : "products"
                )
              }
              className="flex w-full items-center justify-between border-b border-white/10 px-3 py-3 text-left text-white"
            >
              <span>
                Products
              </span>

              <span className="text-yellow-500">
                {mobileSection ===
                "products"
                  ? "−"
                  : "+"}
              </span>
            </button>

            {mobileSection ===
              "products" && (
              <div className="border-b border-white/10 p-2">

                <Link
                  href={localizedPath(
                    "/products"
                  )}
                  onClick={closeAll}
                  className="block rounded-lg px-4 py-3 font-semibold text-yellow-400 hover:bg-yellow-500/10"
                >
                  All Products
                </Link>

                {products.map(
                  (product) => (
                    <Link
                      key={product.slug}
                      href={localizedPath(
                        `/products/${product.slug}`
                      )}
                      onClick={closeAll}
                      className="block rounded-lg px-4 py-2.5 text-sm text-white hover:bg-yellow-500/10 hover:text-yellow-400"
                    >
                      {product.name}
                    </Link>
                  )
                )}

              </div>
            )}

            <Link
              href={localizedPath("/gallery")}
              onClick={closeAll}
              className="block border-b border-white/10 px-3 py-3 text-white hover:text-yellow-400"
            >
              Gallery
            </Link>

            <Link
              href={localizedPath("/contact")}
              onClick={closeAll}
              className="block border-b border-white/10 px-3 py-3 text-white hover:text-yellow-400"
            >
              Contact
            </Link>

            {/* MOBILE THEME */}
            <div className="mt-4 border-t border-white/10 pt-4">

              <p className="mb-2 px-3 text-xs uppercase tracking-wider text-white/50">
                Theme
              </p>

              <div className="grid grid-cols-3 gap-2 px-3">

                {themes.map(
                  (item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        changeTheme(
                          item.value
                        )
                      }
                      className={`rounded-lg border px-2 py-2 text-xs transition ${
                        theme === item.value
                          ? "border-yellow-500 text-yellow-400"
                          : "border-white/20 text-white"
                      }`}
                    >
                      {item.name}
                    </button>
                  )
                )}

              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}