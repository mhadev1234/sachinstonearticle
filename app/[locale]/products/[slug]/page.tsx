 import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;

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

  return (
    <main className="min-h-screen bg-black px-5 py-24 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <div className="mb-8">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center rounded-lg border border-yellow-500/50 px-5 py-2.5 text-sm font-semibold text-yellow-500 transition hover:bg-yellow-500 hover:text-black"
          >
            ← Back to Products
          </Link>
        </div>

        {/* Product */}
        <div className="grid overflow-hidden rounded-3xl border border-yellow-500/20 bg-zinc-950 lg:grid-cols-2">

          {/* Image */}
          <div className="relative min-h-87.5 bg-zinc-900 lg:min-h-150">

            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-87.5 items-center justify-center text-gray-500 lg:min-h-150">
                Image Coming Soon
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

            {/* Featured */}
            {item.featured && (
              <span className="absolute left-5 top-5 rounded-full bg-yellow-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-black">
                Featured
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">

            {/* Category */}
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-500">
              {item.category}
            </p>

            {/* Name */}
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              {item.name}
            </h1>

            {/* Divider */}
            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-16 bg-yellow-500" />
              <span className="h-2 w-2 rotate-45 bg-yellow-500" />
              <span className="h-px w-16 bg-yellow-500/40" />
            </div>

            {/* Description */}
            {item.description ? (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-yellow-500">
                  Product Details
                </h2>

                <p className="mt-4 whitespace-pre-line text-base leading-8 text-gray-300">
                  {item.description}
                </p>
              </div>
            ) : (
              <p className="mt-8 text-gray-400">
                Contact us for complete product details and specifications.
              </p>
            )}

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <a
                href="https://wa.me/917300479168?text=Hello%20Sachin%20Stone%20%26%20Article%2C%20I%20want%20to%20enquire%20about%20a%20stone%20product."
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-yellow-500 px-7 py-3.5 text-center font-bold text-black transition hover:bg-yellow-400"
              >
                Enquire on WhatsApp
              </a>

              <Link
                href={`/${locale}/contact`}
                className="rounded-xl border border-yellow-500 px-7 py-3.5 text-center font-bold text-yellow-500 transition hover:bg-yellow-500 hover:text-black"
              >
                Contact Us
              </Link>

            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl border border-yellow-500/20 bg-zinc-950 p-8 text-center">

          <h2 className="text-2xl font-bold sm:text-3xl">
            Looking for Custom Stone Work?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-400">
            We provide premium stone craftsmanship, custom designs,
            temple stone work, CNC stone jali and architectural stone work
            across India.
          </p>

          <Link
            href={`/${locale}/contact`}
            className="mt-6 inline-block rounded-xl bg-yellow-500 px-7 py-3.5 font-bold text-black transition hover:bg-yellow-400"
          >
            Get Free Quote
          </Link>

        </div>
      </div>
    </main>
  );
}