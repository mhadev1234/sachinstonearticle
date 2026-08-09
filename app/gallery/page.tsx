"use client";

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
    fetchGallery();
  }, []);

  async function fetchGallery() {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gallery Error:", error);
      setLoading(false);
      return;
    }

    setGallery(data || []);
    setLoading(false);
  }

  function openViewer(index: number) {
    setSelectedIndex(index);
  }

  function closeViewer() {
    setSelectedIndex(null);
  }

  function nextItem() {
    if (selectedIndex === null || gallery.length === 0) return;

    setSelectedIndex(
      (selectedIndex + 1) % gallery.length
    );
  }

  function previousItem() {
    if (selectedIndex === null || gallery.length === 0) return;

    setSelectedIndex(
      (selectedIndex - 1 + gallery.length) %
        gallery.length
    );
  }

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
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedIndex]);

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white md:px-10">

      <div className="mx-auto max-w-7xl">

        {/* Heading */}

        <div className="mb-14 text-center">

          <span className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-6 py-2 text-sm font-semibold uppercase tracking-[4px] text-yellow-400">
            Portfolio
          </span>

          <h1 className="mt-6 text-4xl font-bold text-yellow-500 md:text-5xl">
            Our Gallery
          </h1>

          <div className="mx-auto mt-4 h-1 w-28 rounded-full bg-yellow-500"></div>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
            Explore our premium Temple Stone Work, Stone Carving,
            CNC Stone Jali, Marble Murti and Architectural Stone
            Projects completed with exceptional craftsmanship across India.
          </p>

        </div>

        {/* Back Home */}

        <div className="mb-10 text-center">

          <a
            href="/"
            className="
              inline-block
              rounded-full
              border
              border-yellow-500
              px-6
              py-2
              text-sm
              font-semibold
              text-yellow-400
              transition
              hover:bg-yellow-500
              hover:text-black
            "
          >
            ← Back to Home
          </a>

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

        {/* Full Gallery */}

        {!loading && gallery.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {gallery.map((item, index) => (

              <button
                key={item.id}
                type="button"
                onClick={() => openViewer(index)}
                className="
                  group
                  overflow-hidden
                  rounded-3xl
                  border
                  border-yellow-500/20
                  bg-neutral-900
                  shadow-lg
                  transition
                  duration-500
                  hover:-translate-y-2
                  hover:border-yellow-500
                  hover:shadow-yellow-500/20
                  text-left
                "
              >

                <div className="relative h-72 overflow-hidden">

                  {/* Image */}

                  {item.media_type === "image" && (
                    <img
                      src={item.image_url}
                      alt="Sachin Stone and Article stone work"
                      loading="lazy"
                      className="
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-700
                        group-hover:scale-110
                      "
                    />
                  )}

                  {/* Video */}

                  {item.media_type === "video" && (
                    <video
                      src={item.image_url}
                      muted
                      playsInline
                      preload="metadata"
                      className="
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-700
                        group-hover:scale-110
                      "
                    />
                  )}

                  {/* Overlay */}

                  <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-black/30" />

                  {/* Video Play Icon */}

                  {item.media_type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">

                      <div
                        className="
                          flex
                          h-16
                          w-16
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-yellow-400
                          bg-black/60
                          text-2xl
                          text-yellow-400
                          backdrop-blur-sm
                        "
                      >
                        ▶
                      </div>

                    </div>
                  )}

                </div>

              </button>

            ))}

          </div>
        )}

      </div>

      {/* FULLSCREEN VIEWER */}

      {selectedIndex !== null && gallery[selectedIndex] && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/95
            p-4
          "
          onClick={closeViewer}
        >

          {/* Close Button */}

          <button
            type="button"
            onClick={closeViewer}
            className="
              absolute
              right-5
              top-5
              z-50
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-yellow-500
              bg-black/70
              text-2xl
              text-yellow-400
              hover:bg-yellow-500
              hover:text-black
            "
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
              className="
                absolute
                left-4
                top-1/2
                z-50
                flex
                h-12
                w-12
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-yellow-500
                bg-black/70
                text-2xl
                text-yellow-400
                hover:bg-yellow-500
                hover:text-black
                md:left-8
              "
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
              className="
                absolute
                right-4
                top-1/2
                z-50
                flex
                h-12
                w-12
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-yellow-500
                bg-black/70
                text-2xl
                text-yellow-400
                hover:bg-yellow-500
                hover:text-black
                md:right-8
              "
            >
              ›
            </button>
          )}

          {/* Selected Media */}

          <div
            className="
              flex
              max-h-[90vh]
              max-w-[90vw]
              items-center
              justify-center
            "
            onClick={(e) => e.stopPropagation()}
          >

            {gallery[selectedIndex].media_type === "image" && (
              <img
                src={gallery[selectedIndex].image_url}
                alt="Sachin Stone and Article stone work"
                className="
                  max-h-[90vh]
                  max-w-[90vw]
                  rounded-xl
                  object-contain
                "
              />
            )}

            {gallery[selectedIndex].media_type === "video" && (
              <video
                src={gallery[selectedIndex].image_url}
                controls
                autoPlay
                playsInline
                className="
                  max-h-[90vh]
                  max-w-[90vw]
                  rounded-xl
                  bg-black
                "
              />
            )}

          </div>

        </div>
      )}

    </main>
  );
}