 "use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const navLinks = [
  { name: "Home", href: "/en" },
  { name: "About", href: "/en/about" },
  { name: "Services", href: "/en/services" },
  { name: "Gallery", href: "/en/gallery" },
  { name: "Reviews", href: "/en/reviews" },
  { name: "Contact", href: "/en/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-yellow-500/20 bg-black/90 backdrop-blur-md">
      
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">

        {/* LOGO */}
        <Link
          href="/en"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="overflow-hidden rounded-full border-2 border-yellow-500">
            <Image
              src="/image/logo.png"
              alt="Sachin Stone and Article"
              width={52}
              height={52}
              priority
              className="h-12 w-12 object-cover md:h-14 md:w-14"
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

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex lg:items-center lg:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white transition hover:text-yellow-500"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* DESKTOP QUOTE */}
        <div className="hidden lg:block">
          <Link
            href="/en/contact"
            className="rounded-full bg-yellow-500 px-5 py-2.5 font-semibold text-black transition hover:bg-yellow-400"
          >
            Get Free Quote
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center justify-center text-3xl text-yellow-500 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-yellow-500/20 bg-black lg:hidden">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="flex flex-col items-center gap-5">

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-medium text-white transition hover:text-yellow-500"
                >
                  {link.name}
                </Link>
              ))}

              <Link
                href="/en/contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-full bg-yellow-500 px-7 py-2.5 font-semibold text-black transition hover:bg-yellow-400"
              >
                Get Free Quote
              </Link>

            </div>
          </div>
        </div>
      )}
    </nav>
  );
}