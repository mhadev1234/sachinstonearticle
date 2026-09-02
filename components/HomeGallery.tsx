"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fallbackGalleryItems } from "@/components/catalogData";
import { useManagedImages } from "@/lib/useManagedImages";

const fallbackImages = fallbackGalleryItems.slice(0, 9);

export default function HomeGallery() {
  const locale = useLocale();
  const [images, setImages] = useState<readonly (readonly [string, string, string])[]>(fallbackImages);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const resumeTimer = useRef<number | null>(null);


  const managed = useManagedImages(
    "home",
    "gallery",
    fallbackImages.map(([src, title, category]) => ({ src, alt: title }))
  );

  useEffect(() => {
    setImages(managed.images.map((item) => [item.src, item.alt, "Stone Work"] as const));
  }, [managed.images]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % images.length), 4800);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  useEffect(() => () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
  }, []);

  const previous = () => setActive((current) => (current - 1 + images.length) % images.length);
  const next = () => setActive((current) => (current + 1) % images.length);

  return (
    <section id="gallery" className="border-t border-zinc-900 bg-black px-5 py-14 text-white sm:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-500">Gallery</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">A Glimpse of Our <span className="text-yellow-400">Craftsmanship</span></h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-zinc-400">Selected stone work images. Explore the full gallery for more.</p></div>
        <div
          className="relative mx-auto mt-8 max-w-4xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onClick={() => setPaused((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") { event.preventDefault(); previous(); setPaused(true); }
            if (event.key === "ArrowRight") { event.preventDefault(); next(); setPaused(true); }
            if (event.key === " ") { event.preventDefault(); setPaused((value) => !value); }
          }}
          tabIndex={0}
          aria-label="Gallery image slider. Use arrow keys to change images and Space to pause or resume."
        >
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            <div className="relative aspect-[16/8] min-h-[220px] w-full sm:min-h-[320px]">
              <Image src={images[active][0]} alt={images[active][1]} fill sizes="(max-width: 640px) 92vw, 896px" unoptimized={images[active][0].startsWith("http")} className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7"><p className="text-lg font-bold sm:text-2xl">{images[active][1]}</p></div>
            </div>
          </div>
          <button type="button" aria-label="Previous gallery image" onClick={(event) => { event.stopPropagation(); previous(); setPaused(true); }} className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white backdrop-blur-md hover:border-yellow-400 hover:text-yellow-300"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" aria-label="Next gallery image" onClick={(event) => { event.stopPropagation(); next(); setPaused(true); }} className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white backdrop-blur-md hover:border-yellow-400 hover:text-yellow-300"><ChevronRight className="h-5 w-5" /></button>
        </div>
        <div className="mt-4 hidden grid-cols-5 gap-3 md:grid lg:grid-cols-7">
          {images.slice(0, 7).map((item, index) => (
            <button key={item[0]} type="button" onClick={() => { setActive(index); setPaused(true); }} className={`group relative aspect-[4/3] overflow-hidden rounded-xl border ${index === active ? "border-yellow-400" : "border-zinc-800"}`}>
              <Image src={item[0]} alt={item[1]} fill sizes="160px" unoptimized={item[0].startsWith("http")} className="object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-black/65 px-2 py-1 text-left text-[10px] font-semibold text-white">{item[1]}</div>
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-2" onClick={(event) => event.stopPropagation()}>{images.map((item, index) => <button key={item[0]} type="button" aria-label={`Show ${item[1]}`} onClick={() => { setActive(index); setPaused(true); }} className={`h-1.5 rounded-full transition-all ${index === active ? "w-8 bg-yellow-400" : "w-1.5 bg-zinc-700"}`} />)}</div>
        <div className="mt-6 text-center"><Link href={`/${locale}/gallery`} className="inline-flex rounded-xl border border-yellow-500 px-6 py-3 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500 hover:text-black">View Full Gallery</Link></div>
      </div>
    </section>
  );
}
