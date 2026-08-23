 "use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  category: string;
  created_at: string;
  media_type: string;
}

export default function GalleryPage() {
  const params = useParams();
  const locale =
    params.locale === "hi" ? "hi" : "en";

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);

  useEffect(() => {
    async function loadGallery() {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error("Gallery Error:", error);
        setLoading(false);
        return;
      }

      setGallery((data as GalleryItem[]) || []);
      setLoading(false);
    }

    loadGallery();
  }, []);

  function previousItem() {
    setSelectedIndex((current) => {
      if (current === null || gallery.length === 0) {
        return current;
      }

      return (
        (current - 1 + gallery.length) %
        gallery.length
      );
    });
  }

  function nextItem() {
    setSelectedIndex((current) => {
      if (current === null || gallery.length === 0) {
        return current;
      }

      return (current + 1) % gallery.length;
    });
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (selectedIndex === null) return;

      if (e.key === "Escape") {
        setSelectedIndex(null);
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
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedIndex]);

  return (
    <main className="min-h-screen bg-black px-4 py-20 text-white md:px-8">

      {/* HEADER */}
      <div className="mx-auto mb-10 max-w-5xl text-center">
        <span className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-6 py-2 text-sm font-semibold uppercase tracking-[4px] text-yellow-400">
          Portfolio
        </span>

        <h1 className="mt-6 text-4xl font-bold text-yellow-500 md:text-5xl">
          Our Gallery
        </h1>

        <div className="mx-auto mt-4 h-1 w-28 rounded-full bg-yellow-500" />

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
          Explore our premium Temple Stone Work,
          Stone Carving, CNC Stone Jali, Marble Murti
          and Architectural Stone Projects completed
          with exceptional craftsmanship across India.
        </p>
      </div>

      {/* BACK */}
      <div className="mb-10 text-center">
        <Link
          href={`/${locale}`}
          className="inline-block rounded-full border border-yellow-500 px-6 py-2 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500 hover:text-black"
        >
          ← Back to Home
        </Link>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="py-20 text-center text-gray-400">
          Loading gallery...
        </div>
      )}

      {/* EMPTY */}
      {!loading && gallery.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          No gallery images available yet.
        </div>
      )}

      {/* ALL GALLERY */}
      {!loading && gallery.length > 0 && (
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="group overflow-hidden rounded-3xl border border-yellow-500/20 bg-neutral-900 text-left shadow-lg transition duration-500 hover:-translate-y-2 hover:border-yellow-500 hover:shadow-yellow-500/20"
            >
              <div className="relative h-72 overflow-hidden">

                {item.media_type === "image" && (
                  <Image
                    src={item.image_url}
                    alt="Sachin Stone and Article stone work"
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                )}

                {item.media_type === "video" && (
                  <>
                    <video
                      src={item.image_url}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-yellow-400 bg-black/60 text-2xl text-yellow-400">
                        ▶
                      </div>
                    </div>
                  </>
                )}

                <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/30" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* FULLSCREEN */}
      {selectedIndex !== null &&
        gallery[selectedIndex] && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setSelectedIndex(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-yellow-500 bg-black/70 text-2xl text-yellow-400 hover:bg-yellow-500 hover:text-black"
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
                className="absolute left-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-yellow-500 bg-black/70 text-2xl text-yellow-400 hover:bg-yellow-500 hover:text-black md:left-8"
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
                className="absolute right-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-yellow-500 bg-black/70 text-2xl text-yellow-400 hover:bg-yellow-500 hover:text-black md:right-8"
              >
                ›
              </button>
            )}

            <div
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[90vh] max-w-[90vw] items-center justify-center"
            >
              {gallery[selectedIndex].media_type ===
                "image" && (
                <Image
                  src={gallery[selectedIndex].image_url}
                  alt="Sachin Stone and Article stone work"
                  width={1600}
                  height={1000}
                  unoptimized
                  className="max-h-[90vh] w-auto max-w-[90vw] rounded-xl object-contain"
                />
              )}

              {gallery[selectedIndex].media_type ===
                "video" && (
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
    </main>
  );
}