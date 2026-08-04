import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },

    sitemap: "https://sachinstonearticle.vercel.app/sitemap.xml",

    host: "https://sachinstonearticle.vercel.app",
  };
}