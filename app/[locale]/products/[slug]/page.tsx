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
import { productImageSets } from "@/components/catalogData";
import { getManagedImages } from "@/lib/contentImages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  image_url: string | null;
  featured: boolean;
  active: boolean;
};

type OtherProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  image_url: string | null;
};


function getLocalProductImages(slug: string, name: string, primary?: string | null) {
  const local = (productImageSets[slug] || []).map((src) => ({
    src,
    alt: `${name} — stone craftsmanship`,
  }));
  const ordered = primary
    ? [{ src: primary, alt: name }, ...local]
    : local;
  return ordered.filter((item, index, all) => all.findIndex((entry) => entry.src === item.src) === index);
}

const fallbackProducts: Product[] = [
  { id: "local-marble-stone-murti", name: "Marble Stone Murti", slug: "marble-stone-murti", category: "Stone Murti", description: "Fine marble and stone murti craftsmanship with customized requirements.", image_url: "/image/rajasthan-style-hd/marble-stone-murti.jpg", featured: true, active: true },
  { id: "local-marble-entry-gate", name: "Marble Entry Gate", slug: "marble-entry-gate", category: "Stone Entrance", description: "Statement stone and marble entrances crafted for temples, homes and heritage spaces.", image_url: "/image/rajasthan-style-hd/marble-entry-gate.jpg", featured: true, active: true },
  { id: "local-stone-carved-wall-panel", name: "Stone Carved Wall Panel", slug: "stone-carved-wall-panel", category: "Stone Carving", description: "Detailed relief and carved wall panels for distinctive architectural spaces.", image_url: "/image/rajasthan-style-hd/stone-carved-wall-panel.jpg", featured: true, active: true },
  { id: "local-stone-chhatri-gazebo", name: "Stone Chhatri & Gazebo", slug: "stone-chhatri-gazebo", category: "Architectural Stone", description: "Traditional chhatri and gazebo elements for gardens, resorts and heritage projects.", image_url: "/image/rajasthan-style-hd/stone-chhatri-gazebo.jpg", featured: true, active: true },
  { id: "local-stone-doors-frames", name: "Stone Doors & Frames", slug: "stone-doors-frames", category: "Stone Architecture", description: "Customized carved stone doors and frames for distinctive entrances.", image_url: "/image/rajasthan-style-hd/stone-doors-frames.jpg", featured: false, active: true },
  { id: "local-stone-fountains", name: "Stone Fountains", slug: "stone-fountains", category: "Landscape Stone", description: "Elegant carved stone fountains for gardens, hotels, resorts and homes.", image_url: "/image/rajasthan-style-hd/stone-fountains.jpg", featured: false, active: true },
  { id: "local-stone-pillars-columns", name: "Stone Pillars & Columns", slug: "stone-pillars-columns", category: "Architectural Stone", description: "Custom pillars and columns for temples, entrances and architectural elevations.", image_url: "/image/rajasthan-style-hd/stone-pillars-columns.jpg", featured: false, active: true },
  { id: "local-temple-stone-dome", name: "Temple Stone Dome", slug: "temple-stone-dome", category: "Temple Stone", description: "Traditional temple dome elements crafted with detailed stone workmanship.", image_url: "/image/rajasthan-style-hd/stone-domes.jpg", featured: true, active: true },
  { id: "local-temple-stone-jali", name: "Temple Stone Jali", slug: "temple-stone-jali", category: "Stone Jali", description: "Intricate jali patterns for temples, facades and architectural interiors.", image_url: "/image/rajasthan-style-hd/stone-jali-panels.jpg", featured: true, active: true },
];

async function getProductBySlug(slug: string): Promise<Product | null> {
  if (hasSupabaseEnv) try {
    const { data } = await supabase
      .from("products")
      .select("id, name, slug, category, description, image_url, featured, active")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();
    if (data) return data as Product;
  } catch {
    // Use local fallback when Supabase is not configured/available.
  }
  return fallbackProducts.find((item) => item.slug === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Sachin Stone & Article",
      robots: { index: false, follow: false },
    };
  }

  const description = (product.description ||
    `Premium ${product.name} by Sachin Stone & Article, with customized stone craftsmanship and project solutions across India.`)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  const canonicalUrl = `https://sachinstonearticle.vercel.app/${locale}/products/${slug}`;
  const title = `${product.name} | Sachin Stone & Article`;

  return {
    title,
    description,
    keywords: [product.name, product.category, `${product.name} Rajasthan`, `${product.name} India`, "Sachin Stone & Article"].filter(Boolean),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Sachin Stone & Article",
      type: "website",
      locale: locale === "hi" ? "hi_IN" : "en_IN",
      images: product.image_url ? [{ url: product.image_url, width: 1200, height: 630, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image_url ? [product.image_url] : undefined,
    },
    robots: { index: true, follow: true },
  };
}


function ProductCard({ product, locale }: { product: OtherProduct; locale: string }) {
  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-zinc-800 bg-black transition duration-300 hover:-translate-y-1 hover:border-yellow-500/50 hover:shadow-[0_18px_50px_rgba(250,204,21,0.06)]"
    >
      {product.image_url ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
          <Image
            src={product.image_url}
            alt={`${product.name} — Sachin Stone & Article`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={product.image_url.startsWith("http")}
            className="object-contain p-3 transition duration-700 group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-zinc-900 text-sm text-gray-600">
          Image coming soon
        </div>
      )}
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-500">
          {product.category || "Stone Product"}
        </p>
        <div className="mt-2 flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white transition group-hover:text-yellow-500">
            {product.name}
          </h3>
          <ArrowRight size={18} className="shrink-0 text-yellow-500 transition group-hover:translate-x-1" />
        </div>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          View details, customization and enquiry options
        </p>
      </div>
    </Link>
  );
}

export default async function ProductDetailPage({
  params,
}: Props) {
  const { locale, slug } = await params;

  /* =====================================================
     LOAD PRODUCT
  ===================================================== */

  const item = await getProductBySlug(slug);

  if (!item) {
    notFound();
  }

  const managed = await getManagedImages(
    "product",
    item.slug,
    getLocalProductImages(item.slug, item.name, item.image_url),
    false,
    7
  );

  /* =====================================================
     WHATSAPP
  ===================================================== */

  const whatsappMessage = encodeURIComponent(
    `Hello Sachin Stone & Article, I am interested in ${item.name}. Please share more details and quotation.`
  );

  const whatsappUrl =
    `https://wa.me/917300479168?text=${whatsappMessage}`;

  /* =====================================================
     OTHER PRODUCTS
  ===================================================== */

  let otherProducts: OtherProduct[] = [];
  try {
    const { data: otherProductsData } = await supabase
      .from("products")
      .select("id, name, slug, category, image_url")
      .eq("active", true)
      .neq("id", item.id)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      ;
    otherProducts = (otherProductsData ?? []).map((product) => ({ ...product, image_url: product.image_url || productImageSets[product.slug]?.[0] || null }));
  } catch {
    otherProducts = fallbackProducts
      .filter((product) => product.slug !== item.slug)
      
      .map(({ id, name, slug, category, image_url }) => ({ id, name, slug, category, image_url }));
  }
  if (!otherProducts.length) {
    otherProducts = fallbackProducts
      .filter((product) => product.slug !== item.slug)
      
      .map(({ id, name, slug, category, image_url }) => ({ id, name, slug, category, image_url }));
  }

  const relatedProducts = otherProducts
    .filter((product) => product.category && product.category.toLowerCase() === item.category.toLowerCase())
    .slice(0, 3);

  const moreProducts = otherProducts
    .filter((product) => !relatedProducts.some((related) => related.id === product.id))
    .slice(0, 3);

  /* =====================================================
     DESCRIPTION
  ===================================================== */

  const description =
    item.description?.trim() ||
    `Premium ${item.name} crafted by Sachin Stone & Article with professional stone craftsmanship, customized designs and quality finishing.`;

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <main className="min-h-screen bg-black text-white">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden border-b border-yellow-500/20 bg-zinc-950">

        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">

          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-yellow-500"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>

          <div className="mt-10 max-w-4xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-4 py-2 text-sm font-medium text-yellow-500">
              <Sparkles size={16} />
              Premium Stone Product
            </div>

            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.25em] text-yellow-500">
              {item.category}
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {item.name}
            </h1>

            <div className="mt-7 h-px w-24 bg-yellow-500" />

            <p className="mt-7 max-w-3xl text-lg leading-8 text-gray-400">
              {description}
            </p>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">

        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr]">

          {/* =================================================
              LEFT
          ================================================= */}

          <div>

            {/* PRODUCT IMAGE */}

            <DetailImageGallery
              images={managed.images}
              autoRotate={managed.autoRotate}
              intervalSeconds={managed.intervalSeconds}
            />

            {/* DESCRIPTION */}

            <div className="mt-12">

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-500">
                About This Product
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Premium{" "}
                <span className="text-yellow-500">
                  {item.name}
                </span>
              </h2>

              <div className="mt-7 space-y-5">

                {description
                  .split("\n")
                  .filter(
                    (text) => text.trim() !== ""
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

            <div className="mt-10">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-500">
                    Project information
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-white">
                    Built around your requirements
                  </h3>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Applications", `Suitable for ${item.category || "architectural and decorative stone projects"}, temples, entrances and customized installations.`],
                ["Customization", "Dimensions, patterns and design details can be discussed according to your project requirement."],
                ["Material & Finish", "Material selection and finishing can be discussed with the project requirement before quotation."],
                ["Project Coordination", "Share your location and requirement to discuss delivery, installation or project coordination."],
              ].map(([heading, text]) => (
                <div key={heading} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                  <h3 className="font-semibold text-yellow-500">{heading}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
                </div>
              ))}
              </div>
            </div>

          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

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

              {/* WHATSAPP */}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-yellow-500 px-5 py-3.5 font-bold text-black transition hover:bg-yellow-400"
              >
                <MessageCircle size={20} />
                WhatsApp Enquiry
              </a>

              {/* CONTACT */}

              <Link
                href={`/${locale}/contact`}
                className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 px-5 py-3.5 font-semibold text-white transition hover:border-yellow-500 hover:text-yellow-500"
              >
                <Phone size={19} />
                Get Free Quote
              </Link>

              {/* FEATURES */}

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
              {item.name}
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
          RELATED PRODUCTS
      ================================================= */}

      {(relatedProducts.length > 0 || moreProducts.length > 0) && (
        <section className="border-t border-zinc-900 bg-zinc-950 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl">
            {relatedProducts.length > 0 && (
              <>
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-500">
                    Related to this product
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                    Explore <span className="text-yellow-500">Related Products</span>
                  </h2>
                  <p className="mt-4 leading-7 text-gray-400">
                    Explore other stone products in the same category for a more complete project solution.
                  </p>
                </div>

                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} locale={locale} />
                  ))}
                </div>
              </>
            )}

            {moreProducts.length > 0 && (
              <div className={relatedProducts.length > 0 ? "mt-16 border-t border-zinc-800 pt-16" : ""}>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-500">
                  Explore more
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                  More <span className="text-yellow-500">Stone Products</span>
                </h2>

                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {moreProducts.map((product) => (
                    <ProductCard key={product.id} product={product} locale={locale} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: item.name,
            description,
            image: item.image_url ? [item.image_url] : undefined,
            category: item.category,
            brand: { "@type": "Brand", name: "Sachin Stone & Article" },
          }),
        }}
      />

    </main>
  );
}