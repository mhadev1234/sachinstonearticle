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

  const typedProduct = product as Product;

  const whatsappMessage = encodeURIComponent(
    `Hello Sachin Stone & Article, I am interested in ${typedProduct.name}. Please share more details and quotation.`
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 bg-zinc-950 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">

          <Link
            href={`/${locale}/products`}
            className="mb-8 inline-block text-sm font-medium text-yellow-500 transition hover:text-yellow-400"
          >
            ← Back to Products
          </Link>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900">
              <div className="aspect-4/3">
                {typedProduct.image_url ? (
                  <img
                    src={typedProduct.image_url}
                    alt={typedProduct.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    Image Coming Soon
                  </div>
                )}
              </div>
            </div>

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-500">
                {typedProduct.category}
              </p>

              {typedProduct.featured && (
                <span className="mt-4 inline-block rounded-full bg-yellow-500 px-4 py-1.5 text-xs font-bold text-black">
                  Featured Product
                </span>
              )}

              <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
                {typedProduct.name}
              </h1>

              <div className="mt-6 h-px w-24 bg-yellow-500" />

              {typedProduct.description && (
                <p className="mt-8 text-base leading-8 text-gray-400 md:text-lg">
                  {typedProduct.description}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">

                <a
                  href={`https://wa.me/917300479168?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-yellow-500 px-6 py-3 text-center font-semibold text-black transition hover:bg-yellow-400"
                >
                  WhatsApp Enquiry
                </a>

                <Link
                  href={`/${locale}#contact`}
                  className="rounded-xl border border-yellow-500 px-6 py-3 text-center font-semibold text-yellow-500 transition hover:bg-yellow-500 hover:text-black"
                >
                  Get Free Quote
                </Link>

              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-white/10 bg-black p-5">
                  <p className="text-sm text-gray-500">
                    Craftsmanship
                  </p>

                  <p className="mt-1 font-semibold">
                    Premium Stone Work
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black p-5">
                  <p className="text-sm text-gray-500">
                    Service
                  </p>

                  <p className="mt-1 font-semibold">
                    All India
                  </p>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl rounded-3xl border border-yellow-500/20 bg-zinc-950 p-8 text-center md:p-14">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-500">
            Sachin Stone & Article
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Looking for a Custom Stone Design?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">
            Tell us about your project. Our experienced stone craftsmen can
            create customized stone work according to your requirements.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

            <a
              href={`https://wa.me/917300479168?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-yellow-500 px-7 py-3 font-bold text-black transition hover:bg-yellow-400"
            >
              Contact on WhatsApp
            </a>

            <Link
              href={`/${locale}#contact`}
              className="rounded-xl border border-white/20 px-7 py-3 font-semibold text-white transition hover:border-yellow-500 hover:text-yellow-500"
            >
              Contact Us
            </Link>

          </div>
        </div>
      </section>
    </main>
  );
}