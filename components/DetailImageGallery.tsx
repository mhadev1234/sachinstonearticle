"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type GalleryImage = { src: string; alt: string };

export default function DetailImageGallery({ images, autoRotate = false, intervalSeconds = 7 }: { images: GalleryImage[]; autoRotate?: boolean; intervalSeconds?: number }) {
  const unique = images.filter((item, index, all) => item.src && all.findIndex((x) => x.src === item.src) === index);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [lightbox, setLightbox] = useState(false);
  const touchStart = useRef<number | null>(null);

  const previous = () => setActive((current) => (current - 1 + unique.length) % unique.length);
  const next = () => setActive((current) => (current + 1) % unique.length);

  useEffect(() => {
    if (active >= unique.length) setActive(0);
  }, [active, unique.length]);

  useEffect(() => {
    if (!autoRotate || unique.length < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % unique.length), Math.max(2, intervalSeconds) * 1000);
    return () => window.clearInterval(timer);
  }, [autoRotate, intervalSeconds, unique.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setLightbox(false); return; }
      if (unique.length < 2) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
      if (event.key === "ArrowRight") { event.preventDefault(); next(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [unique.length]);

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStart.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const start = touchStart.current;
    const end = event.changedTouches[0]?.clientX;
    touchStart.current = null;
    if (start === null || typeof end !== "number" || unique.length < 2) return;
    const delta = start - end;
    if (Math.abs(delta) > 50) {
      if (delta > 0) next(); else previous();
    }
  }

  if (!unique.length) {
    return <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-600">No Image Available</div>;
  }

  const current = unique[active];
  const currentSrc = failed[current.src] ? (unique.find((item) => !failed[item.src])?.src ?? current.src) : current.src;

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative aspect-[4/3] w-full">
          <Image src={currentSrc} alt={current.alt} fill priority sizes="(max-width: 1024px) 100vw, 65vw" unoptimized={currentSrc.startsWith("http")} className="object-cover" onError={() => setFailed((state) => ({ ...state, [current.src]: true }))} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          <button type="button" onClick={() => setLightbox(true)} aria-label="Open image full screen" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-300">
            <Maximize2 className="h-4 w-4" />
          </button>
          {unique.length > 1 && (
            <>
              <button type="button" onClick={previous} aria-label="Previous image" className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-300"><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" onClick={next} aria-label="Next image" className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-300"><ChevronRight className="h-5 w-5" /></button>
            </>
          )}
        </div>
      </div>

      {unique.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {unique.slice(0, 5).map((item, index) => (
            <button key={item.src} type="button" onClick={() => setActive(index)} aria-label={`Show image ${index + 1}`} className={`relative aspect-[4/3] overflow-hidden rounded-lg border transition ${index === active ? "border-yellow-400" : "border-zinc-800 hover:border-zinc-600"}`}>
              <Image src={failed[item.src] ? currentSrc : item.src} alt="" fill sizes="120px" unoptimized={item.src.startsWith("http")} className="object-cover" onError={() => setFailed((state) => ({ ...state, [item.src]: true }))} />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal="true" onClick={() => setLightbox(false)}>
          <div className="relative h-[86vh] w-[94vw] max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <Image src={currentSrc} alt={current.alt} fill sizes="94vw" unoptimized={currentSrc.startsWith("http")} className="object-contain" onError={() => setFailed((state) => ({ ...state, [current.src]: true }))} />
            <button type="button" onClick={() => setLightbox(false)} aria-label="Close image" className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-xl text-white">×</button>
            {unique.length > 1 && (
              <>
                <button type="button" onClick={previous} aria-label="Previous image" className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-white"><ChevronLeft /></button>
                <button type="button" onClick={next} aria-label="Next image" className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-white"><ChevronRight /></button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
