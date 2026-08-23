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

export default async function ProductDetailPage({
  params,
}: Props) {
  const { locale, slug } = await params;

  /* =====================================================
     LOAD PRODUCT
  ===================================================== */

  const { data: product, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, category, description, image_url, featured, active"
    )
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !product) {
    notFound();
  }

  const item = product as Product;

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

  const { data: otherProductsData } = await supabase
    .from("products")
    .select(
      "id, name, slug, category, image_url"
    )
    .eq("active", true)
    .neq("id", item.id)
    .order("created_at", {
      ascending: false,
    })
    .limit(6);

  const otherProducts: OtherProduct[] =
    otherProductsData ?? [];

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

            {item.image_url ? (
              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">

                <img
                  src={item.image_url}
                  alt={item.name}
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
          OTHER PRODUCTS
      ================================================= */}

      {otherProducts.length > 0 && (
        <section className="border-t border-zinc-900 px-6 py-16 lg:py-20">

          <div className="mx-auto max-w-7xl">

            <div className="text-center">

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-500">
                Explore More
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Other{" "}
                <span className="text-yellow-500">
                  Products
                </span>
              </h2>

            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {otherProducts.map(
                (product) => (
                  <Link
                    key={product.id}
                    href={`/${locale}/products/${product.slug}`}
                    className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition hover:-translate-y-1 hover:border-yellow-500/50"
                  >

                    {product.image_url ? (
                      <div className="h-52 overflow-hidden">

                        <img
                          src={product.image_url}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />

                      </div>
                    ) : (
                      <div className="flex h-52 items-center justify-center bg-zinc-900 text-sm text-gray-600">
                        No Image
                      </div>
                    )}

                    <div className="p-6">

                      <p className="text-xs font-semibold uppercase tracking-wider text-yellow-500">
                        {product.category}
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-4">

                        <h3 className="font-bold text-white transition group-hover:text-yellow-500">
                          {product.name}
                        </h3>

                        <ArrowRight
                          size={18}
                          className="shrink-0 text-yellow-500 transition group-hover:translate-x-1"
                        />

                      </div>

                      <p className="mt-3 text-sm text-gray-500">
                        View product details
                      </p>

                    </div>

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