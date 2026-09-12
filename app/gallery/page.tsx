import { redirect } from "next/navigation";

/**
 * Keep the legacy non-localized gallery URL from rendering a second,
 * Supabase-only gallery implementation. The localized page contains the
 * production gallery UI and its safe local fallback.
 */
export default function LegacyGalleryRedirect() {
  redirect("/en/gallery");
}
