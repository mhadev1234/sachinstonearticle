"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Image */}

      <Image
        src="/image/hero.jpeg"
        alt="Sachin Stone & Article"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/50" />

      {/* Premium Gradient */}

      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/45 to-black/95" />

      {/* Golden Glow */}

      <div className="absolute left-1/2 top-1/2 h-105 w-105 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-500/10 blur-[150px]" />

      {/* Hero Content */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-6xl text-center">

          {/* Premium Welcome */}

          <div className="mb-8 mt-10 flex items-center justify-center gap-4 sm:mb-10 sm:mt-14">
            <span className="h-px w-10 bg-yellow-400/60 sm:w-20" />

            <div className="rounded-full border border-yellow-400/40 bg-black/30 px-6 py-2.5 backdrop-blur-md">
              <p className="text-[10px] font-medium uppercase tracking-[5px] text-yellow-300 sm:text-xs sm:tracking-[7px]">
                Crafting Timeless Beauty
              </p>
            </div>

            <span className="h-px w-10 bg-yellow-400/60 sm:w-20" />
          </div>

          {/* Brand Name */}

          <h1 className="leading-none">
            <span className="block text-5xl font-light tracking-[3px] text-white sm:text-7xl md:text-8xl lg:text-9xl">
              SACHIN
            </span>

            <span className="mt-4 block whitespace-nowrap text-3xl font-semibold tracking-[1px] text-yellow-400 sm:text-5xl md:text-7xl lg:text-8xl">
              STONE &amp; ARTICLE
            </span>
          </h1>

          {/* Elegant Gold Divider */}

          <div className="mx-auto mt-8 flex items-center justify-center gap-4">
            <span className="h-px w-14 bg-yellow-400/50 sm:w-28" />

            <span className="h-2.5 w-2.5 rotate-45 border border-yellow-400 bg-yellow-400/20 shadow-[0_0_20px_rgba(250,204,21,0.7)]" />

            <span className="h-px w-14 bg-yellow-400/50 sm:w-28" />
          </div>

          {/* Tagline */}

          <h2 className="mt-8 text-xl font-medium tracking-[1px] text-white sm:text-3xl md:text-4xl">
            Where Stone Becomes Art
          </h2>

          {/* Description */}

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-gray-200 sm:text-base sm:leading-8 md:text-lg">
            We transform natural stone into timeless expressions of art,
            elegance and craftsmanship. Every creation is carefully crafted
            with precision, passion and attention to detail, bringing together
            traditional artistry and refined design. From beautifully detailed
            stonework to distinctive architectural creations, our work reflects
            a commitment to quality, character and lasting beauty.
          </p>

          {/* CTA Buttons */}

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#contact"
              className="w-full max-w-55 rounded-xl bg-yellow-400 px-8 py-4 text-sm font-bold uppercase tracking-wide text-black shadow-[0_10px_35px_rgba(250,204,21,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 sm:w-auto"
            >
              Get Free Quote
            </a>

            <a
              href="https://wa.me/917300479168?text=Hello%20Sachin%20Stone%20%26%20Article%2C%20I%20want%20to%20know%20more%20about%20your%20stone%20work."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-55 rounded-xl border border-yellow-400/70 bg-black/30 px-8 py-4 text-sm font-bold uppercase tracking-wide text-yellow-400 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-400 hover:text-black sm:w-auto"
            >
              WhatsApp Now
            </a>
          </div>

          {/* Experience */}

          <div className="mx-auto mt-10 flex w-fit items-center gap-5 border-t border-yellow-400/20 pt-5">
            <div className="text-left">
              <p className="text-2xl font-semibold text-yellow-400 sm:text-3xl">
                15+
              </p>

              <p className="text-[9px] uppercase tracking-[3px] text-gray-300 sm:text-xs">
                Years
              </p>
            </div>

            <span className="h-8 w-px bg-yellow-400/30" />

            <p className="text-left text-[10px] uppercase leading-5 tracking-[2px] text-gray-300 sm:text-xs">
              Craftsmanship
              <br />
              Excellence
            </p>
          </div>

          {/* Discover More */}

          <a
            href="#about"
            className="mt-9 inline-flex flex-col items-center gap-3 text-gray-400 transition-colors duration-300 hover:text-yellow-400"
          >
            <span className="text-[9px] uppercase tracking-[4px]">
              Discover More
            </span>

            <span className="h-8 w-px bg-linear-to-b from-yellow-400 to-transparent" />
          </a>
        </div>
      </div>

      {/* Bottom Fade */}

      <div className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-black via-black/40 to-transparent" />
    </section>
  );
}