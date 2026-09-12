 "use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { fallbackGalleryItems } from "@/components/catalogData";
import { useManagedImages } from "@/lib/useManagedImages";

type GalleryItem = readonly [string, string, string];

export default function HomeGallery() {
  const locale = useLocale();
  const fallback: GalleryItem[] = fallbackGalleryItems
    .slice(0, 8)
    .map(([src, title]) => [src, title, "Stone Work"]);

  const managed = useManagedImages(
    "home",
    "gallery",
    fallback.map(([src, title]) => ({ src, alt: title }))
  );

  const [images, setImages] = useState<GalleryItem[]>(fallback);

  useEffect(() => {
    if (!managed.images.length) return;

    setImages(
      managed.images.slice(0, 8).map((item, index): GalleryItem => [
        item.src,
        item.alt || fallback[index]?.[1] || "Stone craftsmanship",
        "Stone Work",
      ])
    );
  }, [managed.images]);

  return (
    <section
      id="gallery"
      className="border-t border-zinc-900 bg-black px-5 py-20 text-white sm:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-500">
            Gallery
          </p>

          <h2 className="mt-3 text-4xl font-bold sm:text-5xl lg:text-6xl">
            Recent work from our{" "}
            <span className="text-yellow-400">workshop</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            A visual selection of stone craftsmanship and architectural work.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {images.map(([src, title, category]) => (
            <Link
              key={src}
              href={`/${locale}/gallery`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <Image
                  src={src}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  unoptimized={
                    src.startsWith("http://") ||
                    src.startsWith("https://")
                  }
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                    {category}
                  </p>

                  <h3 className="mt-1 font-bold text-white">{title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-9 text-center">
          <Link
            href={`/${locale}/gallery`}
            className="inline-flex rounded-xl border border-yellow-500 px-6 py-3 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500 hover:text-black"
          >
            Open Full Gallery →
          </Link>
        </div>
      </div>
    </section>
  );
}