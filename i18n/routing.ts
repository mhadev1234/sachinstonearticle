import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "hi", "ar", "zh", "ru", "fr"],
  defaultLocale: "en",
});