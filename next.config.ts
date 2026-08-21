import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.72.245.150"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wkpegqsvexqevhefuotv.supabase.co",
        pathname: "/storage/v1/object/public/gallery/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);