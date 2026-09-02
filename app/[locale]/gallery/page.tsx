"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";

interface GalleryItem {
  id: number;
  title: string | null;
  image_url: string;
  category: string | null;
  created_at: string | null;
  media_type: string | null;
}

export default function GalleryPage() {
  const params = useParams();
  const locale = params.locale === "hi" ? "hi" : "en";
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    async function loadGallery() {
      const localFallback: GalleryItem[] = [
        ["/image/gallery1.jpeg", "Temple Stone Work", "Temple Craftsmanship"],
        ["/image/gallery2.jpeg", "Hand Stone Carving", "Stone Carving"],
        ["/image/gallery3.jpeg", "CNC Stone Jali", "Stone Jali"],
        ["/image/gallery4.jpeg", "Marble Murti", "Murti Making"],
        ["/image/gallery5.jpeg", "Architectural Stone Work", "Architectural Stone Work"],
        ["/image/gallery6.jpeg", "Premium Stone Craftsmanship", "Stone Craftsmanship"],
      ].map(([image_url, title, category], index) => ({
        id: -(index + 1), title, image_url, category, created_at: null, media_type: "image"
      }));

      try {
        if (!hasSupabaseEnv) {
          setGallery(localFallback);
          return;
        }

        const { data, error } = await supabase
          .from("gallery")
          .select("id, title, image_url, category, created_at, media_type")
          .order("created_at", { ascending: false });

        if (error) {
          setGallery(localFallback);
          return;
        }

        setGallery(((data as GalleryItem[]) || []).filter((item) => item.image_url && (!item.media_type || item.media_type === "image")));
      } catch {
        setGallery(localFallback);
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(gallery.map((item) => item.category?.trim()).filter(Boolean) as string[])
      ),
    ],
    [gallery]
  );

  const filteredGallery = useMemo(
    () =>
      activeCategory === "All"
        ? gallery
        : gallery.filter((item) => item.category === activeCategory),
    [activeCategory, gallery]
  );

  function previousItem() {
    setSelectedIndex((current) => {
      if (current === null || filteredGallery.length < 2) return current;
      return (current - 1 + filteredGallery.length) % filteredGallery.length;
    });
  }

  function nextItem() {
    setSelectedIndex((current) => {
      if (current === null || filteredGallery.length < 2) return current;
      return (current + 1) % filteredGallery.length;
    });
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (selectedIndex === null) return;
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowRight") nextItem();
      if (event.key === "ArrowLeft") previousItem();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, filteredGallery.length]);

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    setTouchStart(event.touches[0]?.clientX ?? null);
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStart === null) return;
    const end = event.changedTouches[0]?.clientX;
    if (typeof end !== "number") return;
    const delta = touchStart - end;
    if (Math.abs(delta) > 50) {
      if (delta > 0) nextItem();
      else previousItem();
    }
    setTouchStart(null);
  }

  return (
    <main className="min-h-screen bg-black px-4 py-20 text-white md:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-4xl text-center">
          <span className="inline-flex rounded-full border border-yellow-500/25 bg-yellow-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-yellow-400">
            Portfolio
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Our <span className="text-yellow-500">Stone Work</span>
          </h1>
          <div className="mx-auto mt-5 h-px w-24 bg-yellow-500" />
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
            Explore our stone craftsmanship, architectural details and selected work imagery.
            Each image is presented as visual work from our gallery.
          </p>
        </div>

        <div className="mb-10 text-center">
          <Link
            href={`/${locale}`}
            className="inline-flex rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-yellow-500 hover:text-yellow-400"
          >
            ← Back to Home
          </Link>
        </div>

        {!loading && gallery.length > 0 && (
          <div className="mb-12 flex flex-wrap justify-center gap-2.5" aria-label="Gallery categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  setSelectedIndex(null);
                }}
                className={`rounded-full border px-4 py-2.5 text-sm font-medium transition duration-300 ${
                  activeCategory === category
                    ? "border-yellow-500 bg-yellow-500 text-black"
                    : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-yellow-500/60 hover:text-yellow-400"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading && <div className="py-20 text-center text-zinc-500">Loading gallery...</div>}

        {!loading && gallery.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 px-6 py-20 text-center text-zinc-500">
            No gallery images available yet.
          </div>
        )}

        {!loading && filteredGallery.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGallery.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-left shadow-xl shadow-black/20 transition duration-500 hover:-translate-y-1 hover:border-yellow-500/50"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                  <Image
                    src={item.image_url}
                    alt={item.title || "Sachin Stone and Article stone craftsmanship"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={item.image_url.startsWith("http")}
                    className="object-contain p-2 transition duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    {item.category && (
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-yellow-400">
                        {item.category}
                      </p>
                    )}
                    {item.title && <p className="mt-1 text-base font-semibold text-white">{item.title}</p>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && gallery.length > 0 && filteredGallery.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 px-6 py-20 text-center text-zinc-500">
            No images are available in this category yet.
          </div>
        )}
      </div>

      {selectedIndex !== null && filteredGallery[selectedIndex] && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={() => setSelectedIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
        >
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-xl text-zinc-200 transition hover:border-yellow-500 hover:text-yellow-400"
            aria-label="Close image viewer"
          >
            ×
          </button>

          {filteredGallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  previousItem();
                }}
                className="absolute left-3 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-2xl text-zinc-200 transition hover:border-yellow-500 hover:text-yellow-400 sm:left-6"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  nextItem();
                }}
                className="absolute right-3 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-2xl text-zinc-200 transition hover:border-yellow-500 hover:text-yellow-400 sm:right-6"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          <div
            className="flex max-h-[90vh] max-w-[92vw] flex-col items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={filteredGallery[selectedIndex].image_url}
              unoptimized={filteredGallery[selectedIndex].image_url.startsWith("http")}
              alt={filteredGallery[selectedIndex].title || "Sachin Stone and Article stone craftsmanship"}
              width={1800}
              height={1200}
              className="max-h-[82vh] w-auto max-w-[92vw] rounded-xl object-contain"
            />
            {(filteredGallery[selectedIndex].title || filteredGallery[selectedIndex].category) && (
              <div className="mt-4 text-center">
                {filteredGallery[selectedIndex].category && (
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-400">
                    {filteredGallery[selectedIndex].category}
                  </p>
                )}
                {filteredGallery[selectedIndex].title && (
                  <p className="mt-1 text-sm text-zinc-300">{filteredGallery[selectedIndex].title}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
