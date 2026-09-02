"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import { useManagedImages } from "@/lib/useManagedImages";

const services = [
  ["temple-stone-work", "Temple Stone Work", "Temple craftsmanship" , "/image/rajasthan-style-hd/temple-stone-work.jpg"],
  ["cnc-stone-jali", "CNC Stone Jali", "Precision jali work", "/image/rajasthan-style-hd/cnc-stone-jali.jpg"],
  ["murti-making", "Murti Making", "Marble & stone murtis", "/image/rajasthan-style-hd/murti-making.jpg"],
  ["stone-carving", "Stone Carving", "Detailed hand carving", "/image/rajasthan-style-hd/stone-carving.jpg"],
  ["stone-cutting", "Stone Cutting", "Accurate stone preparation", "/image/rajasthan-style-hd/stone-cutting-items.jpg"],
  ["architectural-stone-work", "Architectural Stone Work", "Custom architectural pieces", "/image/rajasthan-style-hd/architectural-stone-work.jpg"],
  ["hotel-resort-stone-work", "Hotel & Resort Stone Work", "Hospitality stone work", "/image/rajasthan-style-hd/hotel-resort-stone-work.jpg"],
  ["railway-station-stone-work", "Railway Station Stone Work", "Public infrastructure work", "/image/rajasthan-style-hd/railway-station-stone-work.jpg"],
  ["custom-architectural-stone-work", "Custom Architectural Stone Work", "Made-to-measure work", "/image/rajasthan-style-hd/architectural-stone-work.jpg"],
] as const;

function ServiceCard({ item, locale }: { item: typeof services[number]; locale: string }) {
  const [slug, title, subtitle, fallbackImage] = item;
  const managed = useManagedImages("service", slug, [{ src: fallbackImage, alt: title }]);
  const image = managed.images[0]?.src || fallbackImage;
  return (
    <Link key={slug} href={`/${locale}/services/${slug}`} className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition duration-500 hover:-translate-y-1 hover:border-yellow-500/40">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900"><Image src={image} alt={`${title} — Sachin Stone & Article`} fill sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw" className="object-contain p-3 transition duration-700 group-hover:scale-[1.025]" /><div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">Service</p><div className="mt-1 flex items-end justify-between gap-3"><div><h3 className="text-lg font-semibold text-white">{title}</h3><p className="mt-1 text-sm text-white/65">{subtitle}</p></div><ArrowRight className="h-5 w-5 shrink-0 text-yellow-400" /></div></div></div>
    </Link>
  );
}

export default function Services() {
  const locale = useLocale();

  return (
    <section id="services" className="services-showcase border-t border-zinc-900 bg-black px-5 py-16 text-white sm:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-500">Our Services</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Stone craftsmanship, clearly presented.</h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((item) => <ServiceCard key={item[0]} item={item} locale={locale} />)}
        </div>

        <div className="mt-9 text-center">
          <Link href={`/${locale}/services`} className="inline-flex rounded-xl border border-yellow-500 px-6 py-3 text-sm font-semibold text-yellow-500 transition hover:bg-yellow-500 hover:text-black">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
