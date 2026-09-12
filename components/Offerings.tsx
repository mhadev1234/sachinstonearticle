"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";

type CardItem = {
  slug: string;
  name: string;
  image: string;
  label: string;
};

const fallbackServices: CardItem[] = [
  { slug: "temple-stone-work", name: "Temple Stone Work", image: "/image/rajasthan-style-hd/temple-stone-work.jpg", label: "Temple Craftsmanship" },
  { slug: "cnc-stone-jali", name: "CNC Stone Jali", image: "/image/rajasthan-style-hd/cnc-stone-jali.jpg", label: "Precision Stone Jali" },
  { slug: "murti-making", name: "Murti Making", image: "/image/rajasthan-style-hd/murti-making.jpg", label: "Marble & Stone Murti" },
  { slug: "stone-carving", name: "Stone Carving", image: "/image/rajasthan-style-hd/stone-carving.jpg", label: "Detailed Hand Carving" },
  { slug: "stone-cutting", name: "Stone Cutting", image: "/image/rajasthan-style-hd/stone-cutting-items.jpg", label: "Accurate Stone Preparation" },
  { slug: "architectural-stone-work", name: "Architectural Stone Work", image: "/image/rajasthan-style-hd/architectural-stone-work.jpg", label: "Custom Architectural Work" },
  { slug: "hotel-resort-stone-work", name: "Hotel & Resort Stone Work", image: "/image/rajasthan-style-hd/hotel-resort-stone-work.jpg", label: "Hospitality Stone Work" },
  { slug: "railway-station-stone-work", name: "Railway Station Stone Work", image: "/image/rajasthan-style-hd/railway-station-stone-work.jpg", label: "Public Infrastructure Work" },
];

const fallbackProducts: CardItem[] = [
  { slug: "marble-stone-murti", name: "Marble Stone Murti", image: "/image/rajasthan-style-hd/marble-stone-murti.jpg", label: "Stone Murti" },
  { slug: "marble-entry-gate", name: "Marble Entry Gate", image: "/image/rajasthan-style-hd/marble-entry-gate.jpg", label: "Stone Entrance" },
  { slug: "stone-carved-wall-panel", name: "Stone Carved Wall Panel", image: "/image/rajasthan-style-hd/stone-carved-wall-panel.jpg", label: "Stone Carving" },
  { slug: "stone-chhatri-gazebo", name: "Stone Chhatri & Gazebo", image: "/image/rajasthan-style-hd/stone-chhatri-gazebo.jpg", label: "Architectural Stone" },
  { slug: "stone-doors-frames", name: "Stone Doors & Frames", image: "/image/rajasthan-style-hd/stone-doors-frames.jpg", label: "Stone Architecture" },
  { slug: "stone-fountains", name: "Stone Fountains", image: "/image/rajasthan-style-hd/stone-fountains.jpg", label: "Landscape Stone" },
  { slug: "stone-pillars-columns", name: "Stone Pillars & Columns", image: "/image/rajasthan-style-hd/stone-pillars-columns.jpg", label: "Architectural Stone" },
  { slug: "temple-stone-dome", name: "Temple Stone Dome", image: "/image/rajasthan-style-hd/stone-domes.jpg", label: "Temple Stone" },
  { slug: "temple-stone-jali", name: "Temple Stone Jali", image: "/image/rajasthan-style-hd/stone-jali-panels.jpg", label: "Stone Jali" },
];

function VisualCard({ item, locale, type }: { item: CardItem; locale: string; type: "service" | "product" }) {
  return (
    <Link
      href={`/${locale}/${type === "service" ? "services" : "products"}/${item.slug}`}
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 transition duration-300 hover:-translate-y-1 hover:border-yellow-500/50 hover:shadow-2xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
        <Image
          src={item.image}
          alt={`${item.name} — Sachin Stone & Article`}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          unoptimized={item.image.startsWith("http://") || item.image.startsWith("https://")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">
            {item.label}
          </p>
          <h3 className="mt-1 text-xl font-bold text-white">
            {item.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export default function Offerings() {
  const locale = useLocale();
  const [services, setServices] = useState<CardItem[]>(fallbackServices);
  const [products, setProducts] = useState<CardItem[]>(fallbackProducts);

  useEffect(() => {
    if (!hasSupabaseEnv) return;

    let cancelled = false;

    async function loadManagedImages() {
      try {
        const { data } = await supabase
          .from("content_images")
          .select("entity_type, entity_key, url, is_primary, sort_order")
          .eq("active", true)
          .in("entity_type", ["service", "product"])
          .order("sort_order", { ascending: true });

        if (cancelled || !data?.length) return;

        const primary = new Map<string, string>();

        for (const row of data) {
          if (row.url && (!primary.has(`${row.entity_type}:${row.entity_key}`) || row.is_primary)) {
            primary.set(`${row.entity_type}:${row.entity_key}`, row.url);
          }
        }

        setServices(
          fallbackServices.map((item) => ({
            ...item,
            image: primary.get(`service:${item.slug}`) || item.image,
          }))
        );

        setProducts(
          fallbackProducts.map((item) => ({
            ...item,
            image: primary.get(`product:${item.slug}`) || item.image,
          }))
        );
      } catch {
        // Local fallback cards remain visible.
      }
    }

    void loadManagedImages();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="offerings"
      className="offerings-section border-t border-zinc-900 bg-black px-5 py-20 text-white sm:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-500">
            Our Services &amp; Products
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Crafted for <span className="text-yellow-400">Exceptional Spaces</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            Premium stone craftsmanship shaped with traditional skill and modern precision.
          </p>
        </div>

        <div className="mt-14">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-yellow-500">
              Our Services
            </p>
            <h3 className="mt-2 text-3xl font-bold sm:text-4xl">
              From raw stone to finished craftsmanship
            </h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 8).map((item) => (
              <VisualCard key={item.slug} item={item} locale={locale} type="service" />
            ))}
          </div>

          <div className="mt-9 text-center">
            <Link
              href={`/${locale}/services`}
              className="inline-flex rounded-xl border border-yellow-500 px-6 py-3 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500 hover:text-black"
            >
              View All Services →
            </Link>
          </div>
        </div>

        <div className="mt-20 border-t border-zinc-900 pt-16">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-yellow-500">
              Our Products
            </p>
            <h3 className="mt-2 text-3xl font-bold sm:text-4xl">
              Stone pieces we craft to order
            </h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((item) => (
              <VisualCard key={item.slug} item={item} locale={locale} type="product" />
            ))}
          </div>

          <div className="mt-9 text-center">
            <Link
              href={`/${locale}/products`}
              className="inline-flex rounded-xl border border-yellow-500 px-6 py-3 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500 hover:text-black"
            >
              See All Products →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
