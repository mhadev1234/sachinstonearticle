 import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["hi", "en", "ar", "zh", "fr", "ru"],
  defaultLocale: "hi",
  localePrefix: "always",
});