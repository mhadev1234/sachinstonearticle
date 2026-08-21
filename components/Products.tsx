 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
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

export default function Products() {
  const locale = useLocale();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            "id, name, slug, category, description, image_url, featured, active"
          )
          .eq("active", true)
          .order("featured", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(6);

        if (error) {
          console.error("Products load error:", error);
          return;
        }

        setProducts(data ?? []);
      } catch (error) {
        console.error("Products error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section
      id="products"
      className="border-t border-zinc-900 bg-black px-5 py-20 text-white sm:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mx-auto mb-12 max-w-3xl text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-yellow-500">
            Sachin Stone & Article
          </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Our{" "}
            <span className="text-yellow-500">
              Stone Products
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
            Explore our premium stone products, traditional
            craftsmanship and architectural stone designs,
            created with precision and attention to detail.
          </p>

          <div className="mx-auto mt-7 h-px w-20 bg-yellow-500" />

        </div>

        {/* PRODUCT GRID */}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {products.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/50 hover:shadow-[0_15px_45px_rgba(250,204,21,0.08)]"
            >

              {/* IMAGE */}

              <div className="relative aspect-4/3 overflow-hidden bg-zinc-900">

                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    No Image Available
                  </div>
                )}

                {/* IMAGE OVERLAY */}

                <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/5" />

                {/* FEATURED */}

                {product.featured && (
                  <span className="absolute left-4 top-4 rounded-full border border-yellow-300/30 bg-yellow-500 px-3 py-1 text-xs font-bold text-black shadow-lg">
                    Featured
                  </span>
                )}

              </div>

              {/* CONTENT */}

              <div className="p-6">

                {/* CATEGORY */}

                {product.category && (
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-500">
                    {product.category}
                  </p>
                )}

                {/* NAME */}

                <h3 className="mt-2 text-xl font-bold leading-tight text-white transition group-hover:text-yellow-500 sm:text-2xl">
                  {product.name}
                </h3>

                {/* DESCRIPTION */}

                {product.description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-400">
                    {product.description}
                  </p>
                )}

                <div className="my-6 h-px bg-zinc-800" />

                {/* BUTTONS */}

                <div className="flex flex-col gap-3 sm:flex-row">

                  <Link
                    href={`/${locale}/products/${product.slug}`}
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
                  >
                    View Details
                  </Link>

                  <Link
                    href={`/${locale}#contact`}
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-yellow-500 px-5 py-3 text-sm font-semibold text-yellow-500 transition hover:bg-yellow-500 hover:text-black"
                  >
                    Enquire Now
                  </Link>

                </div>

              </div>

            </article>
          ))}

        </div>

        {/* VIEW ALL */}

        <div className="mt-12 text-center">

          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center justify-center rounded-xl border border-yellow-500 px-7 py-3.5 font-semibold text-yellow-500 transition-all duration-300 hover:bg-yellow-500 hover:text-black"
          >
            View All Products
          </Link>

        </div>

      </div>
    </section>
  );
}