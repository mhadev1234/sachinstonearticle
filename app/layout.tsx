import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {

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


  openGraph: {

    title:
      "Sachin Stone and Article | Premium Stone Work India",

    description:
      "Premium Temple Stone Work, CNC Stone Jali, Murti Making and Architectural Stone Projects across India.",

    siteName:
      "Sachin Stone and Article",

    locale:
      "en_IN",

    type:
      "website",

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

        {children}

      </body>

    </html>

  );

}