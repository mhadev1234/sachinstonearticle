"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";
import { useEffect, useRef, useState } from "react";

type Slide = readonly [string, string, readonly string[]];
const p = (name: string) => `/image/${name}`;
const s = (name: string) => `/image/showcase/${name}.jpg`;

// Curated from the clean stone photography already shipped with the project.
// Avoids collage/text-heavy source images in the main showcase.
const clean = {
  temple: [p("gallery1.jpeg"), s("gallery1-2"), p("gallery6.jpeg"), s("gallery6-2")],
  jali: [p("gallery3.jpeg"), s("gallery3-2"), s("gallery3-3"), s("gallery3-4")],
  carving: [p("gallery2.jpeg"), s("gallery2-2"), s("gallery2-3"), s("gallery2-4")],
  murti: [p("gallery4.jpeg"), s("gallery4-2"), s("gallery4-3"), s("gallery4-4")],
  architecture: [p("gallery5.jpeg"), s("gallery5-2"), s("gallery5-3"), s("gallery5-4")],
  heritage: [p("gallery6.jpeg"), s("gallery6-2"), s("gallery6-3"), s("gallery6-4")],
  templeMix: [p("gallery1.jpeg"), p("gallery6.jpeg"), s("gallery1-3"), s("gallery6-3")],
  carvingMix: [p("gallery2.jpeg"), p("gallery4.jpeg"), s("gallery2-3"), s("gallery4-3")],
};

const rs = (name: string) => `/image/rajasthan-style-hd/${name}.jpg`;

const baseServiceSlides: readonly Slide[] = [
  ["temple-stone-work", "Temple Stone Work", [rs("temple-stone-work")]],
  ["cnc-stone-jali", "CNC Stone Jali", [rs("cnc-stone-jali")]],
  ["murti-making", "Murti Making", [rs("murti-making")]],
  ["stone-carving", "Stone Carving", [rs("stone-carving")]],
  ["stone-cutting", "Stone Cutting", [rs("stone-cutting")]],
  ["architectural-stone-work", "Architectural Stone Work", [rs("architectural-stone-work")]],
  ["hotel-resort-stone-work", "Hotel & Resort Stone Work", [rs("hotel-resort-stone-work")]],
  ["railway-station-stone-work", "Railway Station Stone Work", [rs("railway-station-stone-work")]],
  ["custom-architectural-stone-work", "Custom Architectural Stone Work", [rs("architectural-stone-work")]],
];

const baseProductSlides: readonly Slide[] = [
  ["marble-stone-murti", "Marble Stone Murti", [rs("marble-stone-murti")]],
  ["marble-entry-gate", "Marble Entry Gate", [rs("marble-entry-gate")]],
  ["stone-carved-wall-panel", "Stone Carved Wall Panel", [rs("stone-carved-wall-panel")]],
  ["stone-chhatri-gazebo", "Stone Chhatri & Gazebo", [rs("stone-chhatri-gazebo")]],
  ["stone-doors-frames", "Stone Doors & Frames", [rs("stone-doors-frames")]],
  ["stone-fountains", "Stone Fountains", [rs("stone-fountains")]],
  ["stone-pillars-columns", "Stone Pillars & Columns", [rs("stone-pillars-columns")]],
  ["temple-stone-dome", "Temple Stone Dome", [rs("stone-domes")]],
  ["temple-stone-jali", "Temple Stone Jali", [rs("stone-jali-panels")]],
];

function makeSlug(text: string) { return text.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }

function ImageCard({ slug, name, images, locale, basePath }: { slug: string; name: string; images: readonly string[]; locale: string; basePath: "services" | "products" }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const resumeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (paused || images.length < 2) return;
    const timer = window.setInterval(() => setImageIndex((current) => (current + 1) % images.length), 9000);
    return () => window.clearInterval(timer);
  }, [paused, images.length]);

  useEffect(() => () => { if (resumeTimer.current) window.clearTimeout(resumeTimer.current); }, []);

  const pauseTemporarily = () => {
    setPaused(true);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setPaused(false), 2200);
  };
  const nextImage = () => { setImageIndex((i) => (i + 1) % images.length); pauseTemporarily(); };
  const previousImage = () => { setImageIndex((i) => (i - 1 + images.length) % images.length); pauseTemporarily(); };

  return (
    <Link
      href={`/${locale}/${basePath}/${slug}`}
      aria-label={`View ${name}`}
      className="offering-card group relative block overflow-hidden rounded-xl bg-zinc-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchStart.current = e.touches[0]?.clientX ?? null; setPaused(true); }}
      onTouchEnd={(e) => {
        const start = touchStart.current;
        const end = e.changedTouches[0]?.clientX;
        touchStart.current = null;
        if (start !== null && typeof end === "number" && Math.abs(start - end) > 45) {
          start > end ? nextImage() : previousImage();
        } else pauseTemporarily();
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className={`absolute inset-0 transition-opacity duration-1000 ${index === imageIndex ? "opacity-100" : "opacity-0"}`}>
            <Image src={image} alt={`${name} — stone craftsmanship view ${index + 1}`} fill sizes="(max-width: 767px) 88vw, (max-width: 1279px) 46vw, 24vw" className="object-contain p-2 transition-transform duration-1000 group-hover:scale-[1.02]" unoptimized={image.startsWith("http")} />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-12 sm:px-5 sm:pb-5">
          <p className="offering-kicker text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">{basePath === "services" ? "Our Service" : "Our Product"}</p>
          <h4 className="offering-title mt-1 text-lg font-bold leading-tight text-white sm:text-xl">{name}</h4>
        </div>
        {images.length > 1 && <div className="absolute right-3 top-3 flex gap-1 rounded-full bg-black/45 px-2 py-1 backdrop-blur-sm">{images.map((_, dot) => <span key={dot} className={`h-1.5 rounded-full transition-all ${dot === imageIndex ? "w-4 bg-white" : "w-1.5 bg-white/45"}`} />)}</div>}
      </div>
    </Link>
  );
}

function ImageSlider({ items, locale, basePath }: { items: readonly Slide[]; locale: string; basePath: "services" | "products" }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const resumeTimer = useRef<number | null>(null);

  useEffect(() => {
    const updateVisible = () => setVisible(window.innerWidth >= 1280 ? 4 : window.innerWidth >= 768 ? 2 : 1);
    updateVisible(); window.addEventListener("resize", updateVisible); return () => window.removeEventListener("resize", updateVisible);
  }, []);
  const maxIndex = Math.max(0, items.length - visible);
  useEffect(() => { if (index > maxIndex) setIndex(maxIndex); }, [index, maxIndex]);
  useEffect(() => {
    if (paused || maxIndex === 0) return;
    const timer = window.setInterval(() => setIndex((current) => current >= maxIndex ? 0 : current + 1), 9000);
    return () => window.clearInterval(timer);
  }, [paused, maxIndex]);
  useEffect(() => () => { if (resumeTimer.current) window.clearTimeout(resumeTimer.current); }, []);
  const pauseTemporarily = () => { setPaused(true); if (resumeTimer.current) window.clearTimeout(resumeTimer.current); resumeTimer.current = window.setTimeout(() => setPaused(false), 2200); };
  const next = () => { setIndex((i) => i >= maxIndex ? 0 : i + 1); pauseTemporarily(); };
  const previous = () => { setIndex((i) => i <= 0 ? maxIndex : i - 1); pauseTemporarily(); };
  const cardWidth = 100 / visible;

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={(e) => { setTouchStart(e.touches[0]?.clientX ?? null); setPaused(true); }} onTouchEnd={(e) => { const start=touchStart; const end=e.changedTouches[0]?.clientX; setTouchStart(null); if(start!==null&&typeof end==='number'&&Math.abs(start-end)>45){start>end?next():previous();}else pauseTemporarily(); }}>
      <div className="overflow-hidden px-1"><div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${index * cardWidth}%)` }}>
        {items.map(([slug,name,images]) => <div key={slug} className="shrink-0 px-2" style={{ width: `${cardWidth}%` }}><ImageCard slug={slug} name={name} images={images} locale={locale} basePath={basePath} /></div>)}
      </div></div>
      {maxIndex > 0 && <><button type="button" onClick={previous} aria-label="Previous" className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur transition hover:bg-black"><ChevronLeft className="h-5 w-5" /></button><button type="button" onClick={next} aria-label="Next" className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur transition hover:bg-black"><ChevronRight className="h-5 w-5" /></button></>}
      <div className="mt-4 flex justify-center gap-1.5">{Array.from({length:maxIndex+1}).map((_,dot)=><button key={dot} type="button" aria-label={`Go to slide ${dot+1}`} onClick={()=>{setIndex(dot);pauseTemporarily();}} className={`h-1.5 rounded-full transition-all ${dot===index?"w-7 bg-white":"w-1.5 bg-white/25"}`} />)}</div>
    </div>
  );
}

export default function Offerings() {
  const locale = useLocale();
  const [serviceSlides, setServiceSlides] = useState<readonly Slide[]>(baseServiceSlides);
  const [productSlides, setProductSlides] = useState<readonly Slide[]>(baseProductSlides);

  useEffect(() => {
    let cancelled = false;
    async function loadAdminImages() {
      if (!hasSupabaseEnv) return;
      try {
        const { data: managedRows } = await supabase
          .from("content_images")
          .select("entity_type, entity_key, url, alt, is_primary, sort_order, active")
          .eq("active", true)
          .in("entity_type", ["service", "product"])
          .order("entity_key", { ascending: true })
          .order("sort_order", { ascending: true });

        const grouped = new Map<string, string[]>();
        for (const row of managedRows ?? []) {
          const key = `${row.entity_type}:${row.entity_key}`;
          const list = grouped.get(key) ?? [];
          if (row.url && !list.includes(row.url)) list.push(row.url);
          grouped.set(key, list);
        }

        if (cancelled) return;

        setServiceSlides(
          baseServiceSlides.map(([slug, name, fallbackImages]) => {
            const managed = grouped.get(`service:${slug}`) ?? [];
            return [slug, name, [...managed, ...fallbackImages.filter((url) => !managed.includes(url))]] as Slide;
          })
        );

        setProductSlides(
          baseProductSlides.map(([slug, name, fallbackImages]) => {
            const managed = grouped.get(`product:${slug}`) ?? [];
            return [slug, name, [...managed, ...fallbackImages.filter((url) => !managed.includes(url))]] as Slide;
          })
        );
      } catch {
        // Local catalogue remains available if Supabase is unavailable.
      }
    }
    void loadAdminImages();
    return () => { cancelled = true; };
  }, []);

  return <section id="offerings" className="offerings-section border-t border-zinc-900 bg-black px-5 py-16 text-white sm:px-8 lg:py-20">
    <div className="mx-auto max-w-7xl">
      <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-500">Our Services &amp; Products</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Crafted for <span className="text-yellow-400">Exceptional Spaces</span></h2><p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">Premium stone craftsmanship, custom work and architectural solutions shaped with traditional skill and modern precision.</p></div>
      <div className="mt-12"><div className="mb-5 text-center"><h3 className="offering-heading text-2xl font-semibold">Our Services</h3><p className="offering-description mx-auto mt-2 max-w-2xl text-sm text-zinc-500">Specialized stone craftsmanship for temples, architecture, hospitality and custom projects.</p></div><ImageSlider items={serviceSlides} locale={locale} basePath="services" /><div className="mt-6 text-center"><Link href={`/${locale}/services`} className="offering-cta inline-flex rounded-lg border border-yellow-500 px-6 py-3 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500 hover:text-black">View More Services</Link></div></div>
      <div className="mt-16 border-t border-zinc-900 pt-14"><div className="mb-5 text-center"><h3 className="offering-heading text-2xl font-semibold">Our Products</h3><p className="offering-description mx-auto mt-2 max-w-2xl text-sm text-zinc-500">Selected stone creations designed for timeless entrances, temples and architectural spaces.</p></div><ImageSlider items={productSlides} locale={locale} basePath="products" /><div className="mt-6 text-center"><Link href={`/${locale}/products`} className="offering-cta inline-flex rounded-lg border border-yellow-500 px-6 py-3 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500 hover:text-black">View More Products</Link></div></div>
    </div>
  </section>;
}
