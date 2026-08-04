import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sachinstonearticle.vercel.app"),

  title:
    "Sachin Stone and Article | Premium Temple Stone Work & Stone Craftsmanship India",

  description:
    "Sachin Stone and Article is a Rajasthan based stone craftsmanship company providing premium Temple Stone Work, CNC Stone Jali, Murti Making, Stone Carving, Architectural Stone Work, Hotel & Resort Projects and Railway Station Stone Work across India.",

  keywords: [
    "Temple Stone Work India",
    "Rajasthan Stone Work",
    "Stone Carving",
    "CNC Stone Jali Work",
    "Marble Temple Manufacturer",
    "Murti Making",
    "Stone Architecture",
    "Temple Contractor India",
    "Architectural Stone Work",
    "Hotel Resort Stone Work",
    "Railway Station Stone Work",
    "Sachin Stone and Article",
    "Sikandra Dausa Rajasthan",
  ],

  authors: [
    {
      name: "Sachin Stone and Article",
    },
  ],

  creator: "Sachin Stone and Article",

  alternates: {
    canonical: "https://sachinstonearticle.vercel.app",
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
    title:
      "Sachin Stone and Article | Premium Stone Work India",

    description:
      "Premium Temple Stone Work, CNC Stone Jali, Murti Making and Architectural Stone Projects across India.",

    url: "https://sachinstonearticle.vercel.app",

    siteName: "Sachin Stone and Article",

    locale: "en_IN",

    type: "website",

    images: [
      {
        url: "/image/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Sachin Stone and Article",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sachin Stone and Article",
    description:
      "Premium Temple Stone Work, CNC Stone Jali, Murti Making & Stone Carving across India.",
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
      <body className="min-h-full flex flex-col">
        <Script
  id="schema"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Sachin Stone and Article",
      image: "https://sachinstonearticle.vercel.app/image/logo.png",
      url: "https://sachinstonearticle.vercel.app",
      telephone: "+91-9829676595",
      email: "sudeshsaini244@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Sikandra",
        addressLocality: "Dausa",
        addressRegion: "Rajasthan",
        postalCode: "303326",
        addressCountry: "IN"
      },
      areaServed: "India",
      description:
        "Premium Temple Stone Work, Stone Carving, CNC Stone Jali, Murti Making and Architectural Stone Projects across India.",
      sameAs: [
        "https://wa.me/919829676595"
      ]
    }),
  }}
/>
        {children}
        

<GoogleAnalytics gaId="G-S27MEMKVV2" />

      </body>
    </html>
  );
}