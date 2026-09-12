 import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
const SITE_URL = "https://sachinstonearticle.vercel.app";
const LOCALES = ["hi", "en", "ar", "zh", "fr", "ru"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = `${SITE_URL}/${locale}`;

  const languages: Record<string, string> = Object.fromEntries(
    LOCALES.map((item) => [item, `${SITE_URL}/${item}`])
  );
  languages["x-default"] = `${SITE_URL}/en`;

  return {
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      url: canonical,
      locale: locale === "hi" ? "hi_IN" : locale === "en" ? "en_IN" : locale,
    },
  };
}


export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (
    !routing.locales.includes(
      locale as (typeof routing.locales)[number]
    )
  ) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}