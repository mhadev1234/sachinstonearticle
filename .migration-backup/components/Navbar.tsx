"use client";

import Image from "next/image";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-yellow-500/20 bg-black/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">

        {/* Logo */}
        <div className="flex items-center gap-3">

          <div className="overflow-hidden rounded-full border-2 border-yellow-500">
            <Image
              src="/image/logo.png"
              alt="Sachin Stone and Article"
              width={48}
              height={48}
              className="h-12 w-12 md:h-16 md:w-16"
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

        </div>

        {/* Desktop Menu */}
        <ul className="hidden items-center gap-8 text-white md:flex">

          <li>
            <a href="#home" className="transition hover:text-yellow-500">
              Home
            </a>
          </li>

          <li>
            <a href="#about" className="transition hover:text-yellow-500">
              About
            </a>
          </li>

          <li>
            <a href="#services" className="transition hover:text-yellow-500">
              Services
            </a>
          </li>

          <li>
            <a href="#gallery" className="transition hover:text-yellow-500">
              Gallery
            </a>
          </li>

          <li>
            <a href="#reviews" className="transition hover:text-yellow-500">
              Reviews
            </a>
          </li>

          <li>
            <a href="#contact" className="transition hover:text-yellow-500">
              Contact
            </a>
          </li>

        </ul>

        {/* Desktop Button */}
        <a
          href="#enquiry"
          className="hidden rounded-full bg-yellow-500 px-6 py-2 font-semibold text-black transition hover:bg-yellow-400 md:block"
        >
          Get Quote
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-3xl text-yellow-500 md:hidden"
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-yellow-500/20 bg-black md:hidden">

          <ul className="flex flex-col items-center gap-5 py-6 text-white">

            <li>
              <a href="#home" onClick={() => setMenuOpen(false)}>
                Home
              </a>
            </li>

            <li>
              <a href="#about" onClick={() => setMenuOpen(false)}>
                About
              </a>
            </li>

            <li>
              <a href="#services" onClick={() => setMenuOpen(false)}>
                Services
              </a>
            </li>

            <li>
              <a href="#gallery" onClick={() => setMenuOpen(false)}>
                Gallery
              </a>
            </li>

            <li>
              <a href="#reviews" onClick={() => setMenuOpen(false)}>
                Reviews
              </a>
            </li>

            <li>
              <a href="#contact" onClick={() => setMenuOpen(false)}>
                Contact
              </a>
            </li>

            <li>
              <a
                href="#enquiry"
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-yellow-500 px-6 py-2 font-semibold text-black"
              >
                Get Quote
              </a>
            </li>

          </ul>

        </div>
      )}
    </nav>
  );
}