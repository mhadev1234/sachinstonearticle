 "use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";

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
      const fallback: Product[] = [
        { id: "local-1", name: "Marble Stone Murti", slug: "marble-stone-murti", category: "Stone Murti", description: "Fine marble and stone murti craftsmanship.", image_url: "/image/rajasthan-style-hd/marble-stone-murti.jpg", featured: true, active: true },
        { id: "local-2", name: "Marble Entry Gate", slug: "marble-entry-gate", category: "Stone Entrance", description: "Statement stone and marble entrances.", image_url: "/image/rajasthan-style-hd/marble-entry-gate.jpg", featured: true, active: true },
        { id: "local-3", name: "Stone Carved Wall Panel", slug: "stone-carved-wall-panel", category: "Stone Carving", description: "Detailed relief and carved wall panels.", image_url: "/image/rajasthan-style-hd/stone-carved-wall-panel.jpg", featured: true, active: true },
        { id: "local-4", name: "Stone Chhatri & Gazebo", slug: "stone-chhatri-gazebo", category: "Architectural Stone", description: "Traditional chhatri and gazebo elements.", image_url: "/image/rajasthan-style-hd/stone-chhatri-gazebo.jpg", featured: true, active: true },
        { id: "local-5", name: "Stone Doors & Frames", slug: "stone-doors-frames", category: "Stone Architecture", description: "Customized carved stone doors and frames.", image_url: "/image/rajasthan-style-hd/stone-doors-frames.jpg", featured: false, active: true },
        { id: "local-6", name: "Stone Fountains", slug: "stone-fountains", category: "Landscape Stone", description: "Elegant carved stone fountains.", image_url: "/image/rajasthan-style-hd/stone-fountains.jpg", featured: false, active: true },
        { id: "local-7", name: "Stone Pillars & Columns", slug: "stone-pillars-columns", category: "Architectural Stone", description: "Custom pillars and columns for temples, entrances and architectural elevations.", image_url: "/image/rajasthan-style-hd/stone-pillars-columns.jpg", featured: false, active: true },
        { id: "local-8", name: "Temple Stone Dome", slug: "temple-stone-dome", category: "Temple Stone", description: "Traditional temple dome elements crafted with detailed stone workmanship.", image_url: "/image/rajasthan-style-hd/stone-domes.jpg", featured: true, active: true },
        { id: "local-9", name: "Temple Stone Jali", slug: "temple-stone-jali", category: "Stone Jali", description: "Intricate jali patterns for temples, facades and architectural interiors.", image_url: "/image/rajasthan-style-hd/stone-jali-panels.jpg", featured: true, active: true },
      ];
      if (!hasSupabaseEnv) {
        setProducts(fallback);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            "id, name, slug, category, description, image_url, featured, active"
          )
          .eq("active", true)
          .order("featured", { ascending: false })
          .order("created_at", { ascending: false })
          ;

        if (error || !data?.length) {
          setProducts(fallback);
          return;
        }

        let merged = data as Product[];
        const { data: managedImages } = await supabase.from("content_images")
          .select("entity_key,url,is_primary,sort_order")
          .eq("entity_type", "product").eq("active", true)
          .order("sort_order", { ascending: true });
        if (managedImages?.length) {
          const imageMap = new Map<string, string>();
          for (const row of managedImages) {
            if (!imageMap.has(row.entity_key) || row.is_primary) imageMap.set(row.entity_key, row.url);
          }
          merged = merged.map(item => ({ ...item, image_url: imageMap.get(item.slug) || item.image_url || null }));
        }
        setProducts(merged);
      } catch (error) {
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
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={product.image_url.startsWith("http")}
                    className="object-contain p-3 transition-transform duration-700 group-hover:scale-[1.02]"
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