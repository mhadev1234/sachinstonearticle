# Batch 10 — Next QA Update

## Completed in this update
- Home gallery is capped to a curated first 6 items with a working View Full Gallery link.
- Full Gallery accepts image records even when `media_type` is blank/null, while still excluding explicit videos.
- Project showcase now has a 14-item curated local fallback and merges remote gallery uploads when available.
- Service listing preserves a real Supabase `image_url` when present and falls back only when it is missing.
- Service cards no longer show an empty image area when a DB image is absent but a canonical local image exists.
- Product and service local image sets no longer pair unrelated categories merely to create a second slide.
- Contact buttons use natural brand colors: WhatsApp green and Gmail-style red for email.
- Detail image gallery keeps the full-object `object-contain` presentation to avoid cropping.
- Duplicate service React keys use a stable slug/id/index combination.
- Gallery/project queries no longer require `media_type = image` at the database query layer; explicit videos are filtered in application code so newly uploaded image records are not accidentally hidden.

## QA limits
- A clean dependency install could not be completed in the isolated environment because npm network access timed out.
- Therefore `npm run build` and a real Supabase/Admin session test are not claimed as passed here.
- `.env.local` must remain a local machine secret and is not included in this ZIP.
