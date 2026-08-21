import Link from "next/link";
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
    .select("*")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Products error:", error);
  }

  const productList: Product[] = products ?? [];

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">

        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-yellow-500">
            Sachin Stone & Article
          </p>

          <h1 className="text-4xl font-bold md:text-6xl">
            Our Products
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-gray-400">
            Explore our premium stone products and architectural stone work.
          </p>
        </div>

        {productList.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-12 text-center">
            <h2 className="text-2xl font-bold">
              Products Coming Soon
            </h2>

            <p className="mt-3 text-gray-400">
              Our premium stone products will be available here soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {productList.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950"
              >
                <div className="aspect-[4/3] bg-zinc-900">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      Image Coming Soon
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <p className="mb-2 text-sm text-yellow-500">
                    {product.category}
                  </p>

                  <h2 className="text-xl font-bold">
                    {product.name}
                  </h2>

                  {product.description && (
                    <p className="mt-3 text-sm leading-6 text-gray-400">
                      {product.description}
                    </p>
                  )}

                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-6 inline-block rounded-lg border border-yellow-500 px-5 py-3 text-sm font-semibold text-yellow-500 hover:bg-yellow-500 hover:text-black"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}