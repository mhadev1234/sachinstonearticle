"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { hasSupabaseEnv, supabase } from "../lib/supabase";
import { fallbackGalleryItems } from "@/components/catalogData";

interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  category: string;
  created_at: string;
  media_type: string;
}

export default function Gallery() {
  const t = useTranslations("Gallery");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] === "hi" ? "hi" : "en";

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let cancelled = false;

    async function loadGallery() {
      const fallback: GalleryItem[] = fallbackGalleryItems.map(([image_url, title, category], index) => ({
        id: -(index + 1), title, image_url, category, created_at: "", media_type: "image"
      }));

      if (!hasSupabaseEnv) {
        if (!cancelled) setGallery(fallback);
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !data?.length) {
          if (!cancelled) setGallery(fallback);
          return;
        }

        const remote = ((data as GalleryItem[]) || []).filter((item) => item.image_url && (!item.media_type || item.media_type === "image"));
        const local = fallback;
        const merged = [...remote, ...local].filter((item, index, all) =>
          item.image_url && all.findIndex((entry) => entry.image_url === item.image_url) === index
        );
        if (!cancelled) setGallery(merged);
      } catch {
        if (!cancelled) setGallery(fallback);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadGallery();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          gallery
            .map((item) => item.category?.trim())
            .filter(Boolean)
        )
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

  const visibleGallery = filteredGallery.slice(0, 6);

  function openViewer(index: number) {
    const item = visibleGallery[index];
    if (!item) return;
    const filteredIndex = filteredGallery.findIndex((entry) => entry.id === item.id);
    if (filteredIndex !== -1) setSelectedIndex(filteredIndex);
  }

  const closeViewer = useCallback(() => setSelectedIndex(null), []);

  const nextItem = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || filteredGallery.length < 2) return current;
      return (current + 1) % filteredGallery.length;
    });
  }, [filteredGallery.length]);

  const previousItem = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || filteredGallery.length < 2) return current;
      return (current - 1 + filteredGallery.length) % filteredGallery.length;
    });
  }, [filteredGallery.length]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (selectedIndex === null) return;
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowRight") nextItem();
      if (event.key === "ArrowLeft") previousItem();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, closeViewer, nextItem, previousItem]);

  return (
    <>
      <section id="gallery" className="bg-black px-5 py-24 text-white sm:px-6 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="inline-flex rounded-full border border-yellow-500/25 bg-yellow-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-yellow-400">
              {t("portfolio")}
            </span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
              {t("heading")}
            </h2>
            <div className="mx-auto mt-5 h-px w-24 bg-yellow-500" />
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
              {t("description")}
            </p>
          </div>

          {!loading && gallery.length > 0 && (
            <div className="mb-10 flex flex-wrap justify-center gap-2.5" aria-label="Gallery categories">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    setSelectedIndex(null);
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition duration-300 ${
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

          {loading && <div className="py-20 text-center text-zinc-500">{t("loading")}</div>}

          {!loading && gallery.length === 0 && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 px-6 py-20 text-center text-zinc-500">
              {t("empty")}
            </div>
          )}

          {!loading && gallery.length > 0 && filteredGallery.length === 0 && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 px-6 py-20 text-center text-zinc-500">
              No images are available in this category yet.
            </div>
          )}

          {!loading && visibleGallery.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleGallery.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openViewer(index)}
                    aria-label={`View ${item.title || "stone craftsmanship"}`}
                    className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-left shadow-xl shadow-black/20 transition duration-500 hover:-translate-y-1 hover:border-yellow-500/50"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                      <Image
                        src={item.image_url}
                        alt={item.title || "Sachin Stone and Article stone craftsmanship"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={item.image_url.startsWith("http")}
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        {item.category && (
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-yellow-400">
                            {item.category}
                          </p>
                        )}
                        {item.title && (
                          <p className="mt-1 line-clamp-2 text-base font-semibold text-white">
                            {item.title}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {filteredGallery.length > 6 && (
                <div className="mt-10 text-center">
                  <Link
                    href={`/${locale}/gallery`}
                    className="inline-flex items-center rounded-full border border-yellow-500 bg-yellow-500 px-7 py-3 font-semibold text-black transition hover:bg-transparent hover:text-yellow-400"
                  >
                    View Full Gallery <span className="ml-2">→</span>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {selectedIndex !== null && filteredGallery[selectedIndex] && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={closeViewer}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
        >
          <button
            type="button"
            onClick={closeViewer}
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
    </>
  );
}
