import Image from "next/image";
import Link from "next/link";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";
import { fallbackGalleryItems } from "@/components/catalogData";

interface GalleryItem {
  id: number;
  title: string | null;
  image_url: string;
  category: string | null;
  created_at: string | null;
  media_type: string | null;
}

export default async function FeaturedWork({ locale }: { locale: string }) {
  let items: GalleryItem[] = [];
  try {
    if (!hasSupabaseEnv) {
      items = [];
    } else {
      const { data } = await supabase
      .from("gallery")
      .select("id, title, image_url, category, created_at, media_type")
      .order("created_at", { ascending: false })
      .limit(6);
      const remote = ((data as GalleryItem[] | null) ?? []).filter((item) => item.image_url && (!item.media_type || item.media_type === "image"));
      const local = fallbackGalleryItems.slice(0, 6).map(([image_url, title, category], index) => ({
        id: -(index + 1), title, image_url, category, created_at: null, media_type: "image"
      }));
      items = [...local, ...remote].filter((item, index, all) =>
        all.findIndex((entry) => entry.image_url === item.image_url) === index
      ).slice(0, 6);
    }
  } catch {
    // Keep the local showcase available when Supabase is unavailable.
  }

  if (!items.length) {
    items = fallbackGalleryItems.slice(0, 6).map(([image_url, title, category], index) => ({
      id: -(index + 1), title, image_url, category, created_at: null, media_type: "image"
    }));
  }

  return (
    <section className="border-t border-zinc-900 bg-zinc-950 px-5 py-20 text-white sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-500">
              Project Showcase
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Selected <span className="text-yellow-500">Stone Projects</span>
            </h2>
            <p className="mt-5 text-base leading-8 text-gray-400 sm:text-lg">
              A visual selection of stone craftsmanship and architectural work. Explore the full project showcase for available work details and imagery.
            </p>
          </div>
          <Link
            href={`/${locale}/projects`}
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-yellow-500 px-6 py-3 font-semibold text-yellow-500 transition hover:bg-yellow-500 hover:text-black"
          >
            View All Projects
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}/projects`}
              className="group overflow-hidden rounded-2xl border border-zinc-800 bg-black"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                <Image
                  src={item.image_url}
                  alt={item.title || item.category || "Stone craftsmanship by Sachin Stone & Article"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized={item.image_url.startsWith("http")}
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                {item.category && (
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-500">
                    {item.category}
                  </p>
                )}
                <h3 className="mt-2 text-lg font-bold text-white transition group-hover:text-yellow-500">
                  {item.title || "Featured Stone Work"}
                </h3>
                <p className="mt-2 text-sm text-gray-500">Explore Projects →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
