 import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";
import DetailImageGallery from "@/components/DetailImageGallery";
import { serviceImageSets } from "@/components/catalogData";
import { getManagedImages } from "@/lib/contentImages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

interface ServiceItem {
  id: number;
  title: string;
  description: string | null;
  short_description: string | null;
  full_description: string | null;
  image_url: string | null;
  created_at?: string;
}

interface GalleryItem {
  id: number;
  title: string | null;
  image_url: string;
  category: string | null;
  media_type: string | null;
  created_at?: string;
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

/* =====================================================
   SLUG HELPER
===================================================== */

function makeSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* =====================================================
   FINAL SERVICE SLUG -> DATABASE TITLE MAPPING
===================================================== */

const serviceTitleMap: Record<string, string[]> = {
  "temple-stone-work": ["Temple Stone Work"],
  "cnc-stone-jali": ["CNC Stone Jali"],
  "murti-making": ["Murti Making"],
  "stone-carving": ["Stone Carving"],
  "stone-cutting": ["Stone Cutting"],
  "architectural-stone-work": ["Architectural Stone Work"],
  "hotel-resort-stone-work": ["Hotel & Resort Stone Work", "Hotel & Resort Work", "Hotel Resort Work"],
  "railway-station-stone-work": ["Railway Station Stone Work", "Railway Station Work"],
  "custom-architectural-stone-work": ["Custom Architectural Stone Work"],
};

/* =====================================================
   GET SERVICE BY FIXED SLUG
===================================================== */

async function getServiceBySlug(slug: string) {
  if (!hasSupabaseEnv) return fallbackServices.find((item) => makeSlug(item.title) === makeSlug(slug)) ?? null;
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, title, description, short_description, full_description, image_url, created_at"
    )
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    return fallbackServices.find((item) => makeSlug(item.title) === makeSlug(slug)) || null;
  }

  const databaseServices: ServiceItem[] = data ?? [];
  const normalizedSlug = makeSlug(slug);
  const allowedTitles = serviceTitleMap[normalizedSlug] || [];

  if (allowedTitles.length === 0) return null;

  const normalizedTitles = allowedTitles.map((title) => makeSlug(title));
  const databaseService = databaseServices.find((item) => normalizedTitles.includes(makeSlug(item.title)));

  // Always fall back to the canonical local service if the DB row is missing/incomplete.
  // This prevents a valid Navbar URL from becoming a 404 just because Supabase data is incomplete.
  return databaseService || fallbackServices.find((item) => normalizedTitles.includes(makeSlug(item.title))) || null;
}

/* =====================================================
   DYNAMIC SEO
===================================================== */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | Sachin Stone & Article",
      description:
        "The requested stone craftsmanship service could not be found.",
    };
  }

  const shortDescription =
    service.short_description ||
    service.description ||
    `Premium ${service.title} by Sachin Stone & Article. Professional stone craftsmanship and customized stone work across India.`;

  const description = shortDescription
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  const title =
    `${service.title} | Sachin Stone & Article`;

  const siteUrl =
    "https://sachinstonearticle.vercel.app";

  /*
   * IMPORTANT:
   * Canonical URL uses the fixed URL slug from the browser.
   * This keeps hotel/railway URLs consistent with Navbar.
   */
  const canonicalUrl =
    `${siteUrl}/${locale}/services/${makeSlug(slug)}`;

  const keywords = [
    service.title,
    `${service.title} Rajasthan`,
    `${service.title} India`,
    `${service.title} Dausa`,
    `${service.title} Jaipur`,
    "stone work",
    "stone craftsmanship",
    "Sachin Stone & Article",
  ];

  return {
    title,
    description,
    keywords,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Sachin Stone & Article",
      type: "website",
      locale:
        locale === "hi"
          ? "hi_IN"
          : "en_IN",

      images: service.image_url
        ? [
            {
              url: service.image_url,
              width: 1200,
              height: 630,
              alt: service.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: service.image_url
        ? [service.image_url]
        : undefined,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

/* =====================================================
   PAGE
===================================================== */

export default async function ServiceDetailPage({
  params,
}: Props) {
  const { locale, slug } = await params;

  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const managed = await getManagedImages(
    "service",
    makeSlug(service.title),
    (serviceImageSets[makeSlug(service.title)] || []).map(src => ({ src, alt: service.title })),
    false,
    7
  );

  /* =================================================
     LOAD GALLERY
  ================================================= */

  let galleryData: GalleryItem[] = [];

  if (hasSupabaseEnv) {
    try {
      const { data } = await supabase
        .from("gallery")
        .select("id, title, image_url, category, media_type, created_at")
        .order("created_at", { ascending: false });
      galleryData = ((data as GalleryItem[] | null) ?? []).filter((item) => item.image_url && (!item.media_type || item.media_type === "image"));
    } catch {
      galleryData = [];
    }
  }

  const gallery: GalleryItem[] = galleryData;

  const localImages = serviceImageSets[makeSlug(service.title)] || [];
  const localFallback: GalleryItem[] = localImages.map((image_url, index) => ({
    id: -1000 - index,
    title: service.title,
    image_url,
    category: service.title,
    media_type: "image",
  }));
  const dbFallback: GalleryItem[] = service.image_url
    ? [{ id: -1, title: service.title, image_url: service.image_url, category: service.title, media_type: "image" }]
    : [];

  const usableGallery = [...gallery, ...localFallback, ...dbFallback].filter((item, index, all) =>
    all.findIndex((entry) => entry.image_url === item.image_url) === index
  );

  /* =================================================
     FIND SERVICE GALLERY IMAGES
  ================================================= */

  const serviceName =
    service.title.trim().toLowerCase();

  const serviceGalleryImages =
    usableGallery.filter((item) => {
      const category =
        item.category?.trim().toLowerCase() || "";

      if (!category) {
        return false;
      }

      return (
        category === serviceName ||
        category.includes(serviceName) ||
        serviceName.includes(category)
      );
    });

  /* =================================================
     MAIN IMAGE
  ================================================= */

  const mainImage =
    service.image_url?.trim() ||
    serviceGalleryImages[0]?.image_url ||
    serviceImageSets[makeSlug(service.title)]?.[0] ||
    null;

  /* =================================================
     DESCRIPTION
  ================================================= */

  const shortDescription =
    service.short_description ||
    service.description ||
    "Premium stone craftsmanship by Sachin Stone & Article.";

  const fullDescription =
    service.full_description ||
    service.description ||
    shortDescription;

  /* =================================================
     WHATSAPP
  ================================================= */

  const whatsappMessage =
    encodeURIComponent(
      `Hello Sachin Stone & Article, I am interested in ${service.title}. Please share more details and quotation.`
    );

  const whatsappUrl =
    `https://wa.me/917300479168?text=${whatsappMessage}`;

  /* =================================================
     OTHER SERVICES
  ================================================= */

  let otherServices: ServiceItem[] = [];

  if (hasSupabaseEnv) {
    try {
      const { data } = await supabase
        .from("services")
        .select(
          "id, title, description, short_description, full_description, image_url, created_at"
        )
        .neq("id", service.id)
        .order("created_at", { ascending: true })
        ;

      const allowedServiceSlugs = new Set(Object.keys(serviceTitleMap));
      otherServices = ((data as ServiceItem[] | null) || []).filter((item) => allowedServiceSlugs.has(makeSlug(getServiceSlug(item.title))));
    } catch {
      // Public detail pages remain usable when Supabase is unavailable.
    }
  }

  /* =================================================
     PAGE
  ================================================= */

  return (
    <main className="min-h-screen bg-black text-white">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden border-b border-yellow-500/20 bg-zinc-950">

        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">

          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-yellow-500"
          >
            <ArrowLeft size={17} />
            Back to Services
          </Link>

          <div className="mt-10 max-w-4xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-4 py-2 text-sm font-medium text-yellow-500">
              <Sparkles size={16} />
              Premium Stone Craftsmanship
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {service.title}
            </h1>

            <div className="mt-7 h-px w-24 bg-yellow-500" />

            <p className="mt-7 max-w-3xl text-lg leading-8 text-gray-400">
              {shortDescription}
            </p>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">

        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr]">

          {/* LEFT */}

          <div>

            <DetailImageGallery
              images={managed.images.length ? managed.images : (mainImage ? [{ src: mainImage, alt: service.title }, ...serviceGalleryImages.map(item => ({ src: item.image_url, alt: service.title }))] : serviceGalleryImages.map(item => ({ src: item.image_url, alt: service.title })))}
              autoRotate={managed.autoRotate}
              intervalSeconds={managed.intervalSeconds}
            />

            {/* DESCRIPTION */}

            <div className="mt-12">

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-500">
                About This Service
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Professional{" "}
                <span className="text-yellow-500">
                  {service.title}
                </span>
              </h2>

              <div className="mt-7 space-y-5">

                {fullDescription
                  .split("\n")
                  .filter(
                    (text) =>
                      text.trim() !== ""
                  )
                  .map((text, index) => (
                    <p
                      key={index}
                      className="text-base leading-8 text-gray-400"
                    >
                      {text}
                    </p>
                  ))}

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <div className="sticky top-24 rounded-2xl border border-zinc-800 bg-zinc-950 p-7">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">
                Start Your Project
              </p>

              <h2 className="mt-3 text-2xl font-bold text-white">
                Discuss Your Requirement
              </h2>

              <p className="mt-4 leading-7 text-gray-400">
                Share your project requirements
                with Sachin Stone & Article and
                get professional guidance and
                quotation.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-yellow-500 px-5 py-3.5 font-bold text-black transition hover:bg-yellow-400"
              >
                <MessageCircle size={20} />
                WhatsApp Enquiry
              </a>

              <Link
                href={`/${locale}/contact`}
                className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 px-5 py-3.5 font-semibold text-white transition hover:border-yellow-500 hover:text-yellow-500"
              >
                <Phone size={19} />
                Get Free Quote
              </Link>

              <div className="mt-7 border-t border-zinc-800 pt-6">

                <div className="space-y-5">

                  <div>
                    <h3 className="font-semibold text-yellow-500">
                      Premium Craftsmanship
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Detailed stone craftsmanship
                      with professional finishing.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-yellow-500">
                      Customized Designs
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Designs and dimensions
                      customized according to
                      your project.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-yellow-500">
                      All India Service
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Stone projects undertaken
                      across India.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          SERVICE GALLERY
      ================================================= */}

      {serviceGalleryImages.length > 0 && (
        <section className="border-t border-zinc-900 bg-zinc-950">

          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">

            <div className="mb-10">

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-500">
                Our Work
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                {service.title}{" "}
                <span className="text-yellow-500">
                  Gallery
                </span>
              </h2>

            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {serviceGalleryImages.map(
                (image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-800 bg-black"
                  >

                    <Image
                      src={image.image_url}
                      alt={service.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized={image.image_url.startsWith("http")}
                      className="object-contain p-3 transition duration-700 group-hover:scale-[1.02]"
                    />

                  </div>
                )
              )}

            </div>

          </div>

        </section>
      )}

      {/* =================================================
          CTA
      ================================================= */}

      <section className="border-t border-zinc-900 bg-black">

        <div className="mx-auto max-w-5xl px-6 py-16 text-center lg:py-20">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-500">
            Sachin Stone & Article
          </p>

          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Looking for{" "}
            <span className="text-yellow-500">
              {service.title}
            </span>
            ?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-400">
            Contact us for premium stone
            craftsmanship, customized designs
            and professional project solutions.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-7 py-3.5 font-bold text-black transition hover:bg-yellow-400"
            >
              <MessageCircle size={19} />
              Contact on WhatsApp
            </a>

            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-7 py-3.5 font-semibold text-white transition hover:border-yellow-500 hover:text-yellow-500"
            >
              Contact Us
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

      </section>

      {/* =================================================
          OTHER SERVICES
      ================================================= */}

      {otherServices.length > 0 && (
        <section className="border-t border-zinc-900 px-6 py-16 lg:py-20">

          <div className="mx-auto max-w-7xl">

            <div className="text-center">

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-500">
                Explore More
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Other{" "}
                <span className="text-yellow-500">
                  Services
                </span>
              </h2>

            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {otherServices.map(
                (item) => (
                  <Link
                    key={`${getServiceSlug(item.title)}-${item.id}`}
                    href={`/${locale}/services/${getServiceSlug(
                      item.title
                    )}`}
                    className="group rounded-xl border border-zinc-800 bg-zinc-950 p-6 transition hover:-translate-y-1 hover:border-yellow-500/50"
                  >

                    <div className="flex items-center justify-between gap-4">

                      <h3 className="font-bold text-white transition group-hover:text-yellow-500">
                        {item.title}
                      </h3>

                      <ArrowRight
                        size={18}
                        className="shrink-0 text-yellow-500 transition group-hover:translate-x-1"
                      />

                    </div>

                    <p className="mt-3 text-sm text-gray-500">
                      View full details
                    </p>

                  </Link>
                )
              )}

            </div>

          </div>

        </section>
      )}

    </main>
  );
}

/* =====================================================
   DATABASE TITLE -> FIXED URL SLUG
   Used by "Other Services"
===================================================== */

function getServiceSlug(title: string) {
  const normalizedTitle = title
    .trim()
    .toLowerCase();

  const fixedSlugMap: Record<string, string> = {
    "temple stone work":
      "temple-stone-work",

    "cnc stone jali":
      "cnc-stone-jali",

    "murti making":
      "murti-making",

    "stone carving":
      "stone-carving",

    "stone cutting":
      "stone-cutting",

    "architectural stone work":
      "architectural-stone-work",

    "hotel & resort work":
      "hotel-resort-stone-work",

    "hotel resort work":
      "hotel-resort-stone-work",

    "railway station work":
      "railway-station-stone-work",

    "railway station stone work":
      "railway-station-stone-work",
  };

  return (
    fixedSlugMap[normalizedTitle] ||
    makeSlug(title)
  );
}