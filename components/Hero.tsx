"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-black"
    >
      {/* Background Image */}

      <Image
        src="/image/hero.jpeg"
        alt="Sachin Stone & Article"
        fill
        priority
        className="scale-105 object-cover object-center brightness-110 contrast-105 saturate-110"
      />

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/35" />

      {/* Premium Gradient */}

      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/35 to-black/90" />

      {/* Golden Glow */}

      <div className="absolute left-1/2 top-0 h-160 w-160 -translate-x-1/2 translate-y-0 rounded-full bg-yellow-500/10 blur-[170px]" />

      {/* Content */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">

        <div className="mx-auto max-w-6xl text-center">

          {/* Tag */}

          <p className="mb-5 text-[14px] font-semibold uppercase tracking-[6px] text-yellow-400 md:text-[15px]">
            Rajasthan's Premium Stone Craftsmanship
          </p>

          {/* Heading */}

          <h1 className="leading-none">

            <span className="block text-6xl font-black text-white drop-shadow-[0_8px_35px_rgba(0,0,0,.8)] md:text-7xl lg:text-8xl">
              Sachin
            </span>

            <span className="mt-2 block text-6xl font-black text-yellow-400 drop-shadow-[0_8px_35px_rgba(250,204,21,.4)] md:text-7xl lg:text-8xl">
              Stone & Article
            </span>

          </h1>

          {/* Gold Line */}

          <div className="mx-auto mt-6 h-1 w-52 rounded-full bg-linear-to-r from-yellow-300 via-yellow-500 to-yellow-300 shadow-[0_0_30px_rgba(250,204,21,.7)]" />

          {/* Subtitle */}

          <h2 className="mt-8 text-2xl font-bold text-white md:text-4xl">
            Premium Temple Stone Work
          </h2>

          <p className="mt-3 text-base font-medium text-yellow-300 md:text-xl">
            Murti • Stone Carving • CNC Stone Jali
          </p>

          {/* Description */}

          <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-gray-200 md:text-lg">
            Creating magnificent stone architecture with{" "}
            <span className="font-bold text-yellow-400">
              15+ Years Experience
            </span>{" "}
            of traditional craftsmanship and modern finishing.
          </p>

          {/* Buttons */}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">

            {/* Get Free Quote */}

            <a
              href="#contact"
              className="rounded-xl bg-linear-to-r from-yellow-400 to-yellow-500 px-8 py-4 text-base font-bold text-black shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              Get Free Quote
            </a>

            {/* WhatsApp */}

            <a
              href="https://wa.me/917300479168?text=Hello%20Sachin%20Stone%20%26%20Article%2C%20I%20want%20to%20know%20more%20about%20your%20stone%20work."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border-2 border-yellow-400 bg-black/20 px-8 py-4 text-base font-bold text-yellow-400 backdrop-blur-md transition-all duration-300 hover:bg-yellow-400 hover:text-black"
            >
              WhatsApp Now
            </a>

          </div>

          {/* Premium Stats */}

          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">

            {[
              ["15+", "Years Experience"],
              ["500+", "Projects Completed"],
              ["100%", "Quality Work"],
              ["India", "Service Available"],
            ].map(([value, label]) => (

              <div
                key={label}
                className="rounded-2xl border border-yellow-400/30 bg-white/10 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:bg-white/15"
              >

                <h3 className="text-3xl font-extrabold text-yellow-400">
                  {value}
                </h3>

                <p className="mt-2 text-xs tracking-wide text-gray-200 md:text-sm">
                  {label}
                </p>

              </div>

            ))}

          </div>

          {/* Scroll Down */}

          <div className="mt-12 flex justify-center">

            <a
              href="#about"
              className="group flex flex-col items-center gap-3 text-gray-300 transition-all duration-300 hover:text-yellow-400"
            >

              <span className="text-[11px] font-semibold uppercase tracking-[5px]">
                Scroll Down
              </span>

              <div className="relative flex h-12 w-7 justify-center rounded-full border-2 border-yellow-400">

                <span className="absolute top-2 h-2 w-2 animate-bounce rounded-full bg-yellow-400" />

              </div>

            </a>

          </div>

        </div>

      </div>

      {/* Bottom Fade */}

      <div className="absolute inset-x-0 bottom-0 h-40 bg-black/70" />

    </section>
  );
}

