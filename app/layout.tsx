import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://sachinstonearticle.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Sachin Stone & Article | Premium Stone Work in Rajasthan",
    template: "%s | Sachin Stone & Article",
  },

  description:
    "Sachin Stone & Article is a Rajasthan-based stone craftsmanship company in Sikandra, Dausa, specializing in premium Temple Stone Work, CNC Stone Jali, Murti Making, Stone Carving and architectural stone projects across India.",

  keywords: [
    "Sachin Stone & Article",
    "Stone Work Rajasthan",
    "Temple Stone Work India",
    "Temple Stone Work Rajasthan",
    "Stone Carving Rajasthan",
    "CNC Stone Jali Work",
    "CNC Jali Stone Work",
    "Murti Making Rajasthan",
    "Marble Murti Making",
    "Stone Architecture",
    "Architectural Stone Work",
    "Temple Contractor India",
    "Hotel Resort Stone Work",
    "Railway Station Stone Work",
    "Stone Craftsmanship India",
    "Stone Work Dausa",
    "Stone Work Sikandra",
  ],

  authors: [
    {
      name: "Sachin Stone & Article",
    },
  ],

  creator: "Sachin Stone & Article",
  publisher: "Sachin Stone & Article",

  alternates: {
    canonical: siteUrl,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "733acbb9effb511c",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  openGraph: {
    title: "Sachin Stone & Article | Premium Stone Work in Rajasthan",

    description:
      "Premium Temple Stone Work, CNC Stone Jali, Murti Making, Stone Carving and Architectural Stone Projects across India.",

    url: siteUrl,

    siteName: "Sachin Stone & Article",

    locale: "en_IN",

    type: "website",

    images: [
      {
        url: "/image/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Sachin Stone & Article - Premium Stone Craftsmanship",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Sachin Stone & Article | Premium Stone Work India",

    description:
      "Premium Temple Stone Work, CNC Stone Jali, Murti Making and Stone Carving across India.",

    images: ["/image/hero.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black">
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",

              name: "Sachin Stone & Article",

              image: `${siteUrl}/image/hero.jpeg`,

              url: siteUrl,

              telephone: "+91-9829676595",

              email: "sudeshsaini244@gmail.com",

              address: {
                "@type": "PostalAddress",
                streetAddress: "Sikandra",
                addressLocality: "Dausa",
                addressRegion: "Rajasthan",
                postalCode: "303326",
                addressCountry: "IN",
              },

              areaServed: {
                "@type": "Country",
                name: "India",
              },

              description:
                "Sachin Stone & Article provides premium Temple Stone Work, Stone Carving, CNC Stone Jali, Murti Making and Architectural Stone Projects across India.",

              sameAs: ["https://wa.me/917300479168"],
            }),
          }}
        />

        {children}
      </body>
    </html>
  );
}