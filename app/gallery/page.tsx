"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  category: string;
  created_at: string;
  media_type: string;
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchGallery() {
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

    fetchGallery();

    return () => {
      cancelled = true;
    };
  }, []);

  function openViewer(index: number) {
    setSelectedIndex(index);
  }

  function closeViewer() {
    setSelectedIndex(null);
  }

  function nextItem() {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null || gallery.length === 0) {
        return currentIndex;
      }

      return (currentIndex + 1) % gallery.length;
    });
  }

  function previousItem() {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null || gallery.length === 0) {
        return currentIndex;
      }

      return (
        (currentIndex - 1 + gallery.length) %
        gallery.length
      );
    });
  }

  // Keyboard controls
  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      }

      if (e.key === "ArrowRight") {
        setSelectedIndex((currentIndex) => {
          if (
            currentIndex === null ||
            gallery.length === 0
          ) {
            return currentIndex;
          }

          return (currentIndex + 1) % gallery.length;
        });
      }

      if (e.key === "ArrowLeft") {
        setSelectedIndex((currentIndex) => {
          if (
            currentIndex === null ||
            gallery.length === 0
          ) {
            return currentIndex;
          }

          return (
            (currentIndex - 1 + gallery.length) %
            gallery.length
          );
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedIndex, gallery.length]);

  const selectedItem =
    selectedIndex !== null
      ? gallery[selectedIndex]
      : null;

  return (
    <main className="min-h-screen bg-black px-4 py-20 text-white md:px-8">

      {/* Heading */}
      <div className="mx-auto mb-10 max-w-5xl text-center">
        <span className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-6 py-2 text-sm font-semibold uppercase tracking-[4px] text-yellow-400">
          Portfolio
        </span>

        <h1 className="mt-6 text-4xl font-bold text-yellow-500 md:text-5xl">
          Our Gallery
        </h1>

        <div className="mx-auto mt-4 h-1 w-28 rounded-full bg-yellow-500" />

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
          Explore our premium Temple Stone Work, Stone
          Carving, CNC Stone Jali, Marble Murti and
          Architectural Stone Projects completed with
          exceptional craftsmanship across India.
        </p>
      </div>

      {/* Back Home */}
      <div className="mb-10 text-center">
        <Link
          href="/"
          className="inline-block rounded-full border border-yellow-500 px-6 py-2 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500 hover:text-black"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-20 text-center text-gray-400">
          Loading gallery...
        </div>
      )}

      {/* Empty */}
      {!loading && gallery.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          No gallery images available yet.
        </div>
      )}

      {/* Gallery */}
      {!loading && gallery.length > 0 && (
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openViewer(index)}
              className="group overflow-hidden rounded-3xl border border-yellow-500/20 bg-neutral-900 text-left shadow-lg transition duration-500 hover:-translate-y-2 hover:border-yellow-500 hover:shadow-yellow-500/20"
            >
              <div className="relative h-72 overflow-hidden">

                {/* Image */}
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

                {/* Video */}
                {item.media_type === "video" && (
                  <video
                    src={item.image_url}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-black/30" />

                {/* Video Play Icon */}
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
      )}

      {/* FULLSCREEN VIEWER */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/95 p-4"
          onClick={closeViewer}
        >

          {/* Close */}
          <button
            type="button"
            onClick={closeViewer}
            aria-label="Close gallery viewer"
            className="absolute right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-yellow-500 bg-black/70 text-2xl text-yellow-400 hover:bg-yellow-500 hover:text-black"
          >
            ✕
          </button>

          {/* Previous */}
          {gallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                previousItem();
              }}
              aria-label="Previous gallery item"
              className="absolute left-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-yellow-500 bg-black/70 text-2xl text-yellow-400 hover:bg-yellow-500 hover:text-black md:left-8"
            >
              ‹
            </button>
          )}

          {/* Next */}
          {gallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextItem();
              }}
              aria-label="Next gallery item"
              className="absolute right-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-yellow-500 bg-black/70 text-2xl text-yellow-400 hover:bg-yellow-500 hover:text-black md:right-8"
            >
              ›
            </button>
          )}

          {/* Selected Media */}
          <div
            className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Selected Image */}
            {selectedItem.media_type === "image" && (
              <div className="relative h-[85vh] w-[90vw] max-w-6xl">
                <Image
                  src={selectedItem.image_url}
                  alt="Sachin Stone and Article stone work"
                  fill
                  unoptimized
                  sizes="90vw"
                  className="rounded-xl object-contain"
                />
              </div>
            )}

            {/* Selected Video */}
            {selectedItem.media_type === "video" && (
              <video
                src={selectedItem.image_url}
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