 "use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "../lib/supabase";

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

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGallery() {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gallery Error:", error);

        if (!cancelled) {
          setLoading(false);
        }

        return;
      }

      if (!cancelled) {
        setGallery(data || []);
        setLoading(false);
      }
    }

    loadGallery();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleGallery = gallery.slice(0, 6);

  function openViewer(index: number) {
    const selectedItem = visibleGallery[index];

    if (!selectedItem) return;

    const originalIndex = gallery.findIndex(
      (item) => item.id === selectedItem.id
    );

    if (originalIndex !== -1) {
      setSelectedIndex(originalIndex);
    }
  }

  const closeViewer = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const nextItem = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null || gallery.length === 0) {
        return currentIndex;
      }

      return (currentIndex + 1) % gallery.length;
    });
  }, [gallery.length]);

  const previousItem = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null || gallery.length === 0) {
        return currentIndex;
      }

      return (
        (currentIndex - 1 + gallery.length) % gallery.length
      );
    });
  }, [gallery.length]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (selectedIndex === null) return;

      if (e.key === "Escape") {
        closeViewer();
      }

      if (e.key === "ArrowRight") {
        nextItem();
      }

      if (e.key === "ArrowLeft") {
        previousItem();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedIndex,
    closeViewer,
    nextItem,
    previousItem,
  ]);

  return (
    <>
      <section
        id="gallery"
        className="bg-black px-6 py-24 text-white"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mb-14 text-center">

            <span className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-6 py-2 text-sm font-semibold uppercase tracking-[4px] text-yellow-400">
              {t("portfolio")}
            </span>

            <h2 className="mt-6 text-4xl font-bold text-yellow-500 md:text-5xl">
              {t("heading")}
            </h2>

            <div className="mx-auto mt-4 h-1 w-28 rounded-full bg-yellow-500" />

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
              {t("description")}
            </p>

          </div>

          {loading && (
            <div className="py-20 text-center text-gray-400">
              {t("loading")}
            </div>
          )}

          {!loading && gallery.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              {t("empty")}
            </div>
          )}

          {!loading && gallery.length > 0 && (
            <>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                {visibleGallery.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openViewer(index)}
                    className="group overflow-hidden rounded-3xl border border-yellow-500/20 bg-neutral-900 text-left shadow-lg transition duration-500 hover:-translate-y-2 hover:border-yellow-500 hover:shadow-yellow-500/20"
                  >
                    <div className="relative h-72 overflow-hidden">

                      {item.media_type === "image" && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image_url}
                          alt="Sachin Stone and Article stone work"
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                      )}

                      {item.media_type === "video" && (
                        <video
                          src={item.image_url}
                          muted
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                      )}

                      <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-black/30" />

                      {item.media_type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-yellow-400 bg-black/60 text-2xl text-yellow-400 backdrop-blur-sm">
                            ▶
                          </div>
                        </div>
                      )}

                    </div>
                  </button>
                ))}

              </div>

              {gallery.length > 6 && (
                <div className="mt-12 text-center">
                  <Link
                    href="/gallery"
                    className="inline-block rounded-full border border-yellow-500 bg-yellow-500 px-8 py-3 font-semibold text-black transition duration-300 hover:bg-transparent hover:text-yellow-400"
                  >
                    {t("viewMore")}
                  </Link>
                </div>
              )}
            </>
          )}

        </div>
      </section>

      {selectedIndex !== null && gallery[selectedIndex] && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/95 p-4"
          onClick={closeViewer}
        >

          <button
            type="button"
            onClick={closeViewer}
            className="absolute right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-yellow-500 bg-black/70 text-2xl text-yellow-400 transition hover:bg-yellow-500 hover:text-black"
            aria-label="Close gallery viewer"
          >
            ✕
          </button>

          {gallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                previousItem();
              }}
              className="absolute left-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-yellow-500 bg-black/70 text-2xl text-yellow-400 transition hover:bg-yellow-500 hover:text-black md:left-8"
              aria-label="Previous gallery item"
            >
              ‹
            </button>
          )}

          {gallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextItem();
              }}
              className="absolute right-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-yellow-500 bg-black/70 text-2xl text-yellow-400 transition hover:bg-yellow-500 hover:text-black md:right-8"
              aria-label="Next gallery item"
            >
              ›
            </button>
          )}

          <div
            className="flex max-h-[90vh] max-w-[90vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >

            {gallery[selectedIndex].media_type === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={gallery[selectedIndex].image_url}
                alt="Sachin Stone and Article stone work"
                className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
              />
            )}

            {gallery[selectedIndex].media_type === "video" && (
              <video
                src={gallery[selectedIndex].image_url}
                controls
                autoPlay
                playsInline
                className="max-h-[90vh] max-w-[90vw] rounded-xl bg-black"
              />
            )}

          </div>
        </div>
      )}
    </>
  );
}