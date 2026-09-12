import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";
import { fallbackGalleryItems } from "@/components/catalogData";

const fallbackProjects = fallbackGalleryItems.map(([image_url, title, category], index) => ({
  id: `local-project-${index + 1}`, image_url, title, category,
}));

export const dynamic = "force-dynamic";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  let items = fallbackProjects;
  if (hasSupabaseEnv) try {
    const { data } = await supabase.from("gallery").select("id, title, image_url, category, media_type").order("created_at", { ascending: false }).limit(12);
    if (data?.length) {
      const remote = data.filter((item) => item.image_url && (!item.media_type || item.media_type === "image")).map((item) => ({ id: String(item.id), image_url: item.image_url, title: item.title || "Selected Stone Project", category: item.category || "Stone Craftsmanship" }));
      items = [...remote, ...fallbackProjects].filter((item, index, all) => all.findIndex((entry) => entry.image_url === item.image_url) === index).slice(0, 15);
    }
  } catch (error) {
    console.warn("Project showcase unavailable:", error);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black px-5 py-20 text-white sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center"><Link href={`/${locale}`} className="text-sm text-zinc-500 hover:text-yellow-400">← Back to Home</Link><p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-yellow-500">Project Showcase</p><h1 className="mt-3 text-4xl font-bold sm:text-5xl">Selected <span className="text-yellow-400">Stone Projects</span></h1><p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-base">Explore selected stone craftsmanship and architectural work. Explore selected stone craftsmanship with clear work categories and visual details. Project-specific location and scope information will be shown when those records are available.</p></div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => <Link key={item.id} href={`/${locale}/gallery`} className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition hover:-translate-y-1 hover:border-yellow-500/50"><div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image_url} alt={item.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized={item.image_url.startsWith("http")} className="object-contain p-3 transition duration-700 group-hover:scale-[1.02]" /></div><div className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-500">{item.category}</p><h2 className="mt-2 text-lg font-bold">{item.title}</h2><p className="mt-2 text-sm text-zinc-500">View project imagery →</p></div></Link>)}
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}
