 import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://sachinstonearticle.vercel.app";

const locales = ["hi", "en", "ar", "zh", "fr", "ru"];

const staticPages = [
  "",
  "/about",
  "/services",
  "/gallery",
  "/reviews",
  "/products",
  "/contact",
];

function makeSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [];

  /*
   * =====================================================
   * STATIC LOCALIZED PAGES
   * =====================================================
   */

  for (const locale of locales) {
    for (const page of staticPages) {
      sitemap.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: page === "" ? 1 : 0.8,
      });
    }
  }

  /*
   * =====================================================
   * PRODUCTS
   * =====================================================
   */

  const {
    data: products,
    error: productsError,
  } = await supabase
    .from("products")
    .select("slug, updated_at, active")
    .eq("active", true);

  if (productsError) {
    console.error(
      "Sitemap Products Error:",
      productsError
    );
  }

  if (products) {
    for (const product of products) {
      if (!product.slug) continue;

      for (const locale of locales) {
        sitemap.push({
          url: `${BASE_URL}/${locale}/products/${product.slug}`,
          lastModified: product.updated_at
            ? new Date(product.updated_at)
            : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  }

  /*
   * =====================================================
   * SERVICES
   * =====================================================
   */

  const {
    data: services,
    error: servicesError,
  } = await supabase
    .from("services")
    .select("title, created_at");

  if (servicesError) {
    console.error(
      "Sitemap Services Error:",
      servicesError
    );
  }

  if (services) {
    for (const service of services) {
      if (!service.title) continue;

      const slug = makeSlug(service.title);

      if (!slug) continue;

      for (const locale of locales) {
        sitemap.push({
          url: `${BASE_URL}/${locale}/services/${slug}`,
          lastModified: service.created_at
            ? new Date(service.created_at)
            : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  }

  /*
   * =====================================================
   * RETURN SITEMAP
   * =====================================================
   */

  return sitemap;
}