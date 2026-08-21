 import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase";

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

export default async function ProductsPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, category, description, image_url, featured, active"
    )
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Products error:", error);
  }

  const productList: Product[] = products ?? [];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black pt-20 text-white">

        {/* HERO */}

        <section className="relative overflow-hidden border-b border-yellow-500/10 bg-black px-6 py-20 md:py-28">

          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-500/10 blur-[140px]" />

          <div className="relative mx-auto max-w-5xl text-center">

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-yellow-500 md:text-sm">
              Sachin Stone & Article
            </p>

            <div className="mx-auto mb-6 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-yellow-500/50 md:w-24" />

              <span className="h-2 w-2 rotate-45 bg-yellow-500" />

              <span className="h-px w-12 bg-yellow-500/50 md:w-24" />
            </div>

            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Our{" "}
              <span className="text-yellow-500">
                Stone Products
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-gray-400 md:text-lg md:leading-8">
              Explore our premium stone products, handcrafted designs,
              architectural stone work and traditional craftsmanship.
            </p>

          </div>
        </section>

        {/* PRODUCTS */}

        <section className="px-6 py-16 md:py-20">

          <div className="mx-auto max-w-7xl">

            {productList.length === 0 ? (
              <div className="mx-auto max-w-2xl rounded-3xl border border-yellow-500/20 bg-zinc-950 p-12 text-center shadow-2xl">

                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/10">
                  <span className="text-2xl text-yellow-500">
                    ◆
                  </span>
                </div>

                <h2 className="text-2xl font-bold md:text-3xl">
                  Products Coming Soon
                </h2>

                <p className="mt-4 leading-7 text-gray-400">
                  Our premium stone products will be available here soon.
                  Please contact us for custom stone work and requirements.
                </p>

                <Link
                  href="/contact"
                  className="mt-8 inline-flex rounded-xl bg-yellow-500 px-7 py-3 font-semibold text-black transition hover:-translate-y-0.5 hover:bg-yellow-400"
                >
                  Enquire Now
                </Link>

              </div>
            ) : (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

                {productList.map((product) => (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-xl transition duration-300 hover:-translate-y-2 hover:border-yellow-500/40 hover:shadow-yellow-500/5"
                  >

                    {/* IMAGE */}

                    <div className="relative aspect-4/3 overflow-hidden bg-zinc-900">

                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={`${product.name} - Sachin Stone & Article`}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-500">
                          Image Coming Soon
                        </div>
                      )}

                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-70" />

                      {product.featured && (
                        <span className="absolute left-4 top-4 rounded-full border border-yellow-300/30 bg-yellow-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-black shadow-lg">
                          Featured
                        </span>
                      )}

                    </div>

                    {/* CONTENT */}

                    <div className="p-6">

                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-500">
                        {product.category}
                      </p>

                      <h2 className="mt-3 text-2xl font-bold leading-tight">
                        {product.name}
                      </h2>

                      {product.description && (
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-400">
                          {product.description}
                        </p>
                      )}

                      {/* BUTTONS */}

                      <div className="mt-7 flex flex-wrap gap-3">

                        <Link
                          href={`/products/${product.slug}`}
                          className="rounded-xl bg-yellow-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-yellow-400"
                        >
                          View Details
                        </Link>

                        <Link
                          href="/contact"
                          className="rounded-xl border border-yellow-500/60 px-5 py-3 text-sm font-semibold text-yellow-500 transition hover:bg-yellow-500 hover:text-black"
                        >
                          Enquire Now
                        </Link>

                      </div>

                    </div>

                  </article>
                ))}

              </div>
            )}

          </div>
        </section>

        {/* BOTTOM CTA */}

        {productList.length > 0 && (
          <section className="border-t border-yellow-500/10 bg-zinc-950 px-6 py-16">

            <div className="mx-auto max-w-4xl text-center">

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-500">
                Custom Stone Work
              </p>

              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                Looking for a Custom Stone Design?
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-400">
                Tell us about your project. We provide customized stone
                craftsmanship for temples, homes, hotels, resorts and
                architectural projects across India.
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-flex rounded-xl bg-yellow-500 px-8 py-4 font-bold text-black transition hover:-translate-y-1 hover:bg-yellow-400"
              >
                Get Free Quote
              </Link>

            </div>

          </section>
        )}

      </main>

      <Footer />
    </>
  );
}