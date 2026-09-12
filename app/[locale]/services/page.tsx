 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { serviceImageSets } from "@/components/catalogData";

interface ServiceItem {
  id: number;
  title: string;
  description: string | null;
  short_description: string | null;
  full_description: string | null;
  image_url: string | null;
}

const fallbackServices: ServiceItem[] = [
  { id: 1, title: "Temple Stone Work", description: "Traditional and architectural temple stone craftsmanship.", short_description: "Temple stone craftsmanship with detailed carving and finishing.", full_description: "Customized temple stone work shaped with traditional craftsmanship and modern precision.", image_url: "/image/rajasthan-style-hd/temple-stone-work.jpg" },
  { id: 2, title: "CNC Stone Jali", description: "Intricate stone jali patterns for architectural spaces.", short_description: "Precision-cut stone jali for temples, homes and architecture.", full_description: "CNC stone jali designs prepared for customized architectural applications.", image_url: "/image/rajasthan-style-hd/cnc-stone-jali.jpg" },
  { id: 3, title: "Murti Making", description: "Fine marble and stone murti craftsmanship.", short_description: "Detailed stone and marble murti craftsmanship.", full_description: "Custom murti making with attention to proportion, carving and finish.", image_url: "/image/rajasthan-style-hd/murti-making.jpg" },
  { id: 4, title: "Stone Carving", description: "Handcrafted decorative and architectural stone carving.", short_description: "Traditional hand carving for architectural stone details.", full_description: "Stone carving for architectural, decorative and heritage-inspired work.", image_url: "/image/rajasthan-style-hd/stone-carving.jpg" },
  { id: 5, title: "Stone Cutting", description: "Accurate stone cutting for customized project requirements.", short_description: "Professional stone cutting for project-specific requirements.", full_description: "Stone cutting and preparation coordinated around project dimensions and requirements.", image_url: "/image/rajasthan-style-hd/stone-cutting.jpg" },
  { id: 6, title: "Architectural Stone Work", description: "Custom stone elements for modern and traditional architecture.", short_description: "Architectural stone solutions for distinctive spaces.", full_description: "Customized architectural stone work for entrances, elevations and interior details.", image_url: "/image/rajasthan-style-hd/architectural-stone-work.jpg" },
  { id: 7, title: "Hotel & Resort Stone Work", description: "Stone craftsmanship for hospitality and resort spaces.", short_description: "Custom stone work for hotels, resorts and hospitality projects.", full_description: "Architectural and decorative stone work for hospitality environments.", image_url: "/image/rajasthan-style-hd/hotel-resort-stone-work.jpg" },
  { id: 8, title: "Railway Station Stone Work", description: "Architectural stone work for public infrastructure projects.", short_description: "Professional stone work for railway and public infrastructure spaces.", full_description: "Customized stone craftsmanship for railway stations and public architecture.", image_url: "/image/rajasthan-style-hd/railway-station-stone-work.jpg" },
  { id: 9, title: "Custom Architectural Stone Work", description: "Custom stone elements designed around project-specific requirements.", short_description: "Made-to-measure architectural stone craftsmanship.", full_description: "Custom architectural stone work developed for distinctive entrances, elevations, heritage and modern spaces.", image_url: "/image/rajasthan-style-hd/architectural-stone-work.jpg" },
];

function makeSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ServicesPage() {
  const params = useParams();

  const locale =
    typeof params.locale === "string"
      ? params.locale
      : "en";

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      if (!hasSupabaseEnv) {
        setServices(fallbackServices);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("services")
          .select(
            "id, title, description, short_description, full_description, image_url"
          )
          .order("created_at", {
            ascending: true,
          });

        if (error) {
          setServices(fallbackServices);
        } else {
          const allowed = new Set(fallbackServices.map((item) => makeSlug(item.title)));
          const bySlug = new Map((data ?? []).map((item: ServiceItem) => [makeSlug(item.title), item]));
          const canonical = fallbackServices.map((fallback) => {
            const db = bySlug.get(makeSlug(fallback.title));
            return db ? { ...fallback, ...db, image_url: db.image_url || fallback.image_url } : fallback;
          });
          setServices(canonical);
        }
      } catch (error) {
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-yellow-500/20 bg-black">

        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center lg:px-8 lg:py-28">

          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-4 py-2 text-sm font-medium text-yellow-500">
            <Sparkles size={16} />
            Rajasthan Stone Craftsmanship
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Our Premium{" "}
            <span className="text-yellow-500">
              Stone Services
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
            From traditional temple stone work to precision CNC stone jali
            and architectural craftsmanship, we create premium stone
            solutions with attention to every detail.
          </p>

          <div className="mx-auto mt-8 h-px w-24 bg-yellow-500" />

        </div>
      </section>

      {/* SERVICES */}

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">

        {/* LOADING */}

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-100 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-950"
              />
            ))}

          </div>
        ) : services.length === 0 ? (

          /* EMPTY */

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-20 text-center">

            <h2 className="text-2xl font-semibold text-white">
              Services Coming Soon
            </h2>

            <p className="mt-3 text-gray-500">
              Our premium stone services will be available here shortly.
            </p>

          </div>
        ) : (

          /* SERVICE GRID */

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {services.map((service, index) => {

              const shortText =
                service.short_description ||
                service.description ||
                "Premium stone craftsmanship by Sachin Stone & Article.";

              const serviceSlug = makeSlug(service.title);

              return (
                <article
                  key={`${serviceSlug}-${service.id}-${index}`}
                  className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/50"
                >

                  {/* IMAGE */}

                  <div className="relative h-64 overflow-hidden bg-zinc-900">

                    {service.image_url || serviceImageSets[serviceSlug]?.[0] ? (
                      <Image
                        src={service.image_url || serviceImageSets[serviceSlug]?.[0] || "/image/about.jpeg"}
                        alt={`${service.title} - Sachin Stone & Article`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={Boolean(service.image_url?.startsWith("http"))}
                        className="object-contain p-3 transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-zinc-900 text-gray-600">
                        No Image
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/30 transition group-hover:bg-black/20" />

                    <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-sm font-semibold text-yellow-500 backdrop-blur">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="p-6">

                    <h2 className="text-xl font-bold leading-tight text-white transition group-hover:text-yellow-500">
                      {service.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-400">
                      {shortText}
                    </p>

                    <div className="my-5 h-px bg-zinc-800" />

                    <Link
                      href={`/${locale}/services/${serviceSlug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-500 transition-all hover:gap-3 hover:text-yellow-400"
                    >
                      View Details
                      <ArrowRight size={17} />
                    </Link>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </section>

      {/* CTA */}

      <section className="border-t border-zinc-900 bg-zinc-950">

        <div className="mx-auto max-w-5xl px-6 py-16 text-center lg:py-20">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-500">
            Have a Stone Project?
          </p>

          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Let&apos;s Build Something{" "}
            <span className="text-yellow-500">
              Exceptional
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-400">
            Share your requirements with us and get professional guidance
            for your stone work project.
          </p>

          <Link
            href={`/${locale}/contact`}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-7 py-3.5 font-bold text-black transition hover:bg-yellow-400"
          >
            Get Free Quote
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </main>
      <Footer />
    </>
  );
}
