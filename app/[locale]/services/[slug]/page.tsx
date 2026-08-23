 import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

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
  "temple-stone-work": [
    "Temple Stone Work",
  ],

  "cnc-stone-jali": [
    "CNC Stone Jali",
  ],

  "murti-making": [
    "Murti Making",
  ],

  "stone-carving": [
    "Stone Carving",
  ],

  "stone-cutting": [
    "Stone Cutting",
  ],

  "architectural-stone-work": [
    "Architectural Stone Work",
  ],

  "hotel-resort-stone-work": [
    "Hotel & Resort Work",
    "Hotel Resort Work",
  ],

  "railway-station-stone-work": [
    "Railway Station Work",
    "Railway Station Stone Work",
  ],
};

/* =====================================================
   GET SERVICE BY FIXED SLUG
===================================================== */

async function getServiceBySlug(slug: string) {
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, title, description, short_description, full_description, image_url, created_at"
    )
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error("Service Load Error:", error);
    return null;
  }

  const services: ServiceItem[] = data || [];

  const normalizedSlug = makeSlug(slug);

  const allowedTitles =
    serviceTitleMap[normalizedSlug] || [];

  if (allowedTitles.length === 0) {
    return null;
  }

  const normalizedTitles = allowedTitles.map(
    (title) => makeSlug(title)
  );

  const service = services.find((item) => {
    const databaseTitleSlug = makeSlug(item.title);

    return normalizedTitles.includes(
      databaseTitleSlug
    );
  });

  return service || null;
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

  /* =================================================
     LOAD GALLERY
  ================================================= */

  const {
    data: galleryData,
    error: galleryError,
  } = await supabase
    .from("gallery")
    .select(
      "id, title, image_url, category, media_type, created_at"
    )
    .eq("media_type", "image")
    .order("created_at", {
      ascending: false,
    });

  if (galleryError) {
    console.error(
      "Gallery Error:",
      galleryError
    );
  }

  const gallery: GalleryItem[] =
    galleryData || [];

  /* =================================================
     FIND SERVICE GALLERY IMAGES
  ================================================= */

  const serviceName =
    service.title.trim().toLowerCase();

  const serviceGalleryImages =
    gallery.filter((item) => {
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

  const { data: otherServicesData, error: otherServicesError } =
    await supabase
      .from("services")
      .select(
        "id, title, description, short_description, full_description, image_url, created_at"
      )
      .neq("id", service.id)
      .order("created_at", {
        ascending: true,
      })
      .limit(6);

  if (otherServicesError) {
    console.error(
      "Other Services Error:",
      otherServicesError
    );
  }

  const otherServices: ServiceItem[] =
    otherServicesData || [];

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

            {mainImage ? (
              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">

                <img
                  src={mainImage}
                  alt={service.title}
                  className="h-[350px] w-full object-cover sm:h-[500px]"
                />

              </div>
            ) : (
              <div className="flex h-[350px] items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 text-gray-600 sm:h-[500px]">
                No Image Available
              </div>
            )}

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
                    className="group overflow-hidden rounded-xl border border-zinc-800 bg-black"
                  >

                    <img
                      src={image.image_url}
                      alt={service.title}
                      loading="lazy"
                      className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
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
                    key={item.id}
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