 import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

function mergeMessages(
  fallback: Record<string, any>,
  current: Record<string, any>
): Record<string, any> {
  const result: Record<string, any> = { ...fallback };

  for (const key of Object.keys(current)) {
    if (
      current[key] &&
      typeof current[key] === "object" &&
      !Array.isArray(current[key]) &&
      fallback[key] &&
      typeof fallback[key] === "object" &&
      !Array.isArray(fallback[key])
    ) {
      result[key] = mergeMessages(fallback[key], current[key]);
    } else {
      result[key] = current[key];
    }
  }

  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const defaultMessages = (
    await import("../messages/en.json")
  ).default;

  const localeMessages =
    locale === "en"
      ? defaultMessages
      : (await import(`../messages/${locale}.json`)).default;

  const messages = mergeMessages(
    defaultMessages,
    localeMessages
  );

  return {
    locale,
    messages,
  };
});