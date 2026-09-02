"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { productImageSets } from "@/components/catalogData";

const productImages = productImageSets;

export default function ProductImageGallery({ slug, name, imageUrl }: { slug: string; name: string; imageUrl?: string | null }) {
  const images = Array.from(new Set([...(imageUrl ? [imageUrl] : []), ...(productImages[slug] ?? [])]));
  const [index, setIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (paused || images.length < 2) return;
    const id = window.setInterval(() => setIndex((current) => (current + 1) % images.length), 7000);
    return () => window.clearInterval(id);
  }, [paused, images.length]);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const pauseTemporarily = () => {
    setPaused(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPaused(false), 2500);
  };
  const next = () => { setIndex((current) => (current + 1) % images.length); pauseTemporarily(); };
  const previous = () => { setIndex((current) => (current - 1 + images.length) % images.length); pauseTemporarily(); };
  const safeIndex = images.length ? Math.min(index, images.length - 1) : 0;

  return (
    <div className="group relative aspect-[4/3] overflow-hidden bg-zinc-900" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {images.length ? images.map((image, imageIndex) => (
        <div key={image} className={`absolute inset-0 transition-opacity duration-1000 ${imageIndex === safeIndex && !failedImages[image] ? "opacity-100" : "opacity-0"}`}>
          <Image src={image} alt={`${name} — stone craftsmanship view ${imageIndex + 1}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized={image.startsWith("http")} className="object-contain p-2 transition-transform duration-1000 group-hover:scale-[1.02]" priority={imageIndex === 0} onError={() => { setFailedImages((state) => ({ ...state, [image]: true })); if (imageIndex === safeIndex) { const nextValid = images.findIndex((candidate, candidateIndex) => candidateIndex !== imageIndex && !failedImages[candidate]); if (nextValid >= 0) setIndex(nextValid); } }} />
        </div>
      )) : (
        <div className="flex h-full items-center justify-center text-sm text-zinc-500">Image coming soon</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
      {images.length > 1 && <>
        <div className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">Multiple views</div>
        <div className="absolute right-3 top-3 z-10 flex gap-1.5 rounded-full bg-black/45 px-2.5 py-2 backdrop-blur-sm">{images.map((_, dot) => <button key={dot} type="button" aria-label={`Show image ${dot + 1}`} onClick={(event) => { event.preventDefault(); setIndex(dot); pauseTemporarily(); }} className={`h-1.5 rounded-full transition-all ${dot === index ? "w-6 bg-white" : "w-1.5 bg-white/50"}`} />)}</div>
        <button type="button" aria-label="Previous image" onClick={(event) => { event.preventDefault(); previous(); }} className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur transition group-hover:opacity-100"><ChevronLeft size={18} /></button>
        <button type="button" aria-label="Next image" onClick={(event) => { event.preventDefault(); next(); }} className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur transition group-hover:opacity-100"><ChevronRight size={18} /></button>
      </>}
    </div>
  );
}
