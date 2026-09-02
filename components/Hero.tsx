"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useManagedImages } from "@/lib/useManagedImages";

const defaultSlides = [
  { src: "/image/hero.jpeg", alt: "Premium temple stone craftsmanship", eyebrow: "Rajasthan Stone Craftsmanship" },
  { src: "/image/gallery3.jpeg", alt: "Intricate CNC stone jali craftsmanship", eyebrow: "Precision Stone Jali" },
  { src: "/image/gallery2.jpeg", alt: "Traditional stone carving craftsmanship", eyebrow: "Skilled Stone Carving" },
  { src: "/image/gallery5.jpeg", alt: "Architectural stone craftsmanship", eyebrow: "Architectural Stone Work" },
];

export default function Hero() {
  const locale = useLocale();
  const managed = useManagedImages("home", "hero", defaultSlides.map(x => ({src:x.src, alt:x.alt})), true, 6.5);
  const slides = managed.images.map((x, i) => ({ ...x, eyebrow: defaultSlides[i % defaultSlides.length]?.eyebrow || "Rajasthan Stone Craftsmanship" }));
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef<number | null>(null);
  const swiping = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, managed.interval * 1000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, managed.interval, slides.length]);

  const previous = () => setActive((current) => (current - 1 + slides.length) % slides.length);
  const next = () => setActive((current) => (current + 1) % slides.length);

  return (
    <section
      id="home"
      className="relative min-h-[88svh] overflow-hidden bg-black text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
        swiping.current = false;
        setPaused(true);
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        const end = event.changedTouches[0]?.clientX;
        if (start !== null && typeof end === "number" && Math.abs(start - end) > 45) {
          swiping.current = true;
          if (start > end) next(); else previous();
          window.setTimeout(() => { swiping.current = false; setPaused(false); }, 1800);
        }
        touchStart.current = null;
      }}
      onClick={() => {
        if (swiping.current) return;
        setPaused((value) => !value);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); previous(); setPaused(true); }
        if (event.key === "ArrowRight") { event.preventDefault(); next(); setPaused(true); }
        if (event.key === " ") { event.preventDefault(); setPaused((value) => !value); }
      }}
      tabIndex={0}
      aria-label="Hero image slider. Use arrow keys to change slides and Space to pause or resume."
    >
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === active ? "opacity-100" : "opacity-0"}`}
          aria-hidden={index !== active}
        >
          <Image src={slide.src} alt={slide.alt} fill priority={index === 0} sizes="100vw" className="object-cover object-center" />
        </div>
      ))}

      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black" />

      <div className="relative z-10 flex min-h-[88svh] items-center justify-center px-5 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-6xl text-center">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-yellow-400/35 bg-black/35 px-5 py-2 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-yellow-300 sm:text-xs">{slides[active].eyebrow}</span>
          </div>

          <h1 className="text-4xl font-light tracking-[1px] sm:text-6xl md:text-7xl lg:text-8xl">
            Sachin Stone <span className="font-semibold text-yellow-400">&amp; Article</span>
          </h1>

          <div className="mx-auto mt-7 h-px w-24 bg-yellow-400/70 sm:w-32" />

          <h2 className="mt-7 text-xl font-medium sm:text-3xl md:text-4xl">Rajasthan&apos;s Premium Stone Craftsmanship</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-200 sm:text-base sm:leading-8">
            Temple stone work, murti making, CNC stone jali, carving and architectural stone solutions crafted with experience and attention to detail.
          </p>

          <div
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            onClick={(event) => event.stopPropagation()}
          >
            <Link href={`/${locale}/contact`} className="w-full max-w-52 rounded-xl bg-yellow-400 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-black transition hover:-translate-y-0.5 hover:bg-yellow-300 sm:w-auto">
              Get Free Quote
            </Link>
            <a href="https://wa.me/917300479168?text=Hello%20Sachin%20Stone%20%26%20Article%2C%20I%20want%20to%20know%20more%20about%20your%20stone%20work." target="_blank" rel="noopener noreferrer" className="w-full max-w-52 rounded-xl border border-yellow-400/70 bg-black/35 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-yellow-300 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-yellow-400 hover:text-black sm:w-auto">
              WhatsApp
            </a>
          </div>

          <div className="mx-auto mt-8 flex w-fit items-center gap-4 border-t border-white/15 pt-4 text-left">
            <div>
              <p className="text-2xl font-semibold text-yellow-400">15+</p>
              <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-300 sm:text-[10px]">Years Experience</p>
            </div>
            <span className="h-8 w-px bg-yellow-400/30" />
            <p className="text-[10px] uppercase leading-5 tracking-[0.18em] text-zinc-300 sm:text-xs">Traditional Craft<br />Modern Precision</p>
          </div>
        </div>
      </div>

      <button type="button" onClick={(event) => { event.stopPropagation(); previous(); }} aria-label="Previous hero slide" className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-xl text-white backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-300 sm:flex">‹</button>
      <button type="button" onClick={(event) => { event.stopPropagation(); next(); }} aria-label="Next hero slide" className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-xl text-white backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-300 sm:flex">›</button>

      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2" onClick={(event) => event.stopPropagation()}>
        {slides.map((slide, index) => (
          <button key={slide.src} type="button" onClick={() => { setActive(index); setPaused(true); }} aria-label={`Go to slide ${index + 1}`} className={`h-1.5 rounded-full transition-all ${index === active ? "w-8 bg-yellow-400" : "w-1.5 bg-white/50"}`} />
        ))}
      </div>
    </section>
  );
}
