"use client";

import Link from "next/link";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Footer() {
  const locale = useLocale();
  const [designedByImage, setDesignedByImage] = useState("/image/logo.png");

  useEffect(() => {
    let cancelled = false;
    async function loadFooterImage() {
      const { data } = await supabase
        .from("content_images")
        .select("url,sort_order,is_primary,active")
        .eq("entity_type", "footer")
        .eq("entity_key", "designed-by")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      const first = data?.find((item) => item.is_primary)?.url || data?.[0]?.url;
      if (!cancelled && first) setDesignedByImage(first);
    }
    void loadFooterImage();
    return () => { cancelled = true; };
  }, []);
  const base = `/${locale}`;
  const quickLinks = [
    ["Home", base], ["About Us", `${base}/about`], ["Services", `${base}/services`], ["Products", `${base}/products`],
    ["Projects", `${base}/projects`], ["Gallery", `${base}/gallery`], ["Reviews", `${base}/reviews`], ["FAQ", `${base}#faq`], ["Contact Us", `${base}/contact`],
  ];
  const services = [
    ["Temple Stone Work", "temple-stone-work"],
    ["CNC Stone Jali", "cnc-stone-jali"],
    ["Murti Making", "murti-making"],
    ["Stone Carving", "stone-carving"],
    ["Stone Cutting", "stone-cutting"],
    ["Architectural Stone Work", "architectural-stone-work"],
    ["Hotel & Resort Stone Work", "hotel-resort-stone-work"],
    ["Railway Station Stone Work", "railway-station-stone-work"],
    ["Custom Architectural Stone Work", "custom-architectural-stone-work"],
  ];
  const products = [
    ["Marble Stone Murti", "marble-stone-murti"],
    ["Marble Entry Gate", "marble-entry-gate"],
    ["Stone Carved Wall Panel", "stone-carved-wall-panel"],
    ["Stone Chhatri & Gazebo", "stone-chhatri-gazebo"],
    ["Stone Doors & Frames", "stone-doors-frames"],
    ["Stone Fountains", "stone-fountains"],
    ["Stone Pillars & Columns", "stone-pillars-columns"],
    ["Temple Stone Dome", "temple-stone-dome"],
    ["Temple Stone Jali", "temple-stone-jali"],
  ];
  const projects = [
    ["Temple Stone Work", `${base}/projects`],
    ["CNC Stone Jali", `${base}/projects`],
    ["Architectural Stone Work", `${base}/projects`],
  ];

  return (
    <footer className="border-t border-zinc-900 bg-black px-5 py-14 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-2xl font-bold text-yellow-400 brand-gold">Sachin Stone &amp; Article</h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-400">Premium temple stone work, murti making, CNC stone jali, carving and architectural stone craftsmanship from Rajasthan.</p>
            <p className="mt-4 text-sm font-semibold text-zinc-200">15+ Years of Craftsmanship</p>

          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">Quick Links</h3>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2 text-sm text-zinc-400">
              {quickLinks.map(([label, href]) => <Link key={label} href={href} className="transition hover:text-yellow-400">{label}</Link>)}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">Our Services</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">{services.map(([label, slug]) => <li key={slug}><Link href={`${base}/services/${slug}`} className="transition hover:text-yellow-400">{label}</Link></li>)}</ul>
            <h3 className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">Featured Products</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">{products.map(([label, slug]) => <li key={slug}><Link href={`${base}/products/${slug}`} className="transition hover:text-yellow-400">{label}</Link></li>)}</ul>
            <h3 className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">Project Showcase</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">{projects.map(([label, href]) => <li key={label}><Link href={href} className="transition hover:text-yellow-400">{label}</Link></li>)}</ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">Contact &amp; Location</h3>
            <div className="mt-4 space-y-4 text-sm text-zinc-400">
              <Link href={`${base}/contact#map`} className="flex gap-3 transition hover:text-yellow-400"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" /><span>Sikandra, Dausa, Rajasthan, India</span></Link>
              <a href="tel:+919829676595" className="flex items-center gap-3 transition hover:text-yellow-400"><Phone className="h-4 w-4 phone-brand" /> +91 98296 76595</a>
              <a href="https://wa.me/917300479168" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition hover:text-yellow-400"><MessageCircle className="h-4 w-4 whatsapp-brand" /> WhatsApp Enquiry</a>
              <Link href={`${base}/contact#map`} className="inline-flex font-semibold text-yellow-400 transition hover:text-yellow-300">Get Directions →</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-900 pt-6 text-xs text-zinc-500">
          <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>© {new Date().getFullYear()} Sachin Stone &amp; Article. All Rights Reserved.</p>
            <div className="flex justify-center gap-5 sm:justify-end">
              <Link href={`${base}/privacy-policy`} className="transition hover:text-yellow-400">Privacy Policy</Link>
              <Link href={`${base}/terms`} className="transition hover:text-yellow-400">Terms</Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 border-t border-zinc-900 pt-7 text-center">
            <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-yellow-500/70 bg-black shadow-lg shadow-yellow-500/10 ring-4 ring-yellow-500/5"><Image src={designedByImage} alt="Designed by Sudesh" fill sizes="56px" className="object-cover" unoptimized={designedByImage.startsWith("http")} /></div>
            <p className="text-base font-semibold tracking-wide text-zinc-200 sm:text-lg">Designed by Sudesh (Sidh)</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
