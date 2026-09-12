# Batch 7 — Accessibility, Image Performance & Final UX Polish

Built from Batch 6 FINAL QA.

## Changes
- Added reduced-motion awareness to the Hero and Services/Products sliders.
- Added keyboard controls to Hero and Services/Products sliders.
- Added touch swipe and Escape/arrow-key controls to the product/service detail image viewer.
- Replaced raw `<img>` usage in public service/product/detail galleries with `next/image` for optimized image loading.
- Made service detail gallery image containers aspect-safe for responsive layouts.
- Kept the localized Gallery/Supabase fallback behavior silent for expected unavailable-data cases, avoiding unnecessary Gallery Error console noise.
- Converted the legacy non-localized `/gallery` route into a redirect to the production localized gallery, preventing a second broken Supabase-only gallery implementation.
- Corrected Featured Work wording so gallery imagery is not presented as a verified project record when project metadata is unavailable.
- Preserved the locked Home sequence, image sliders, compact enquiry CTA, footer structure, theme modes, and existing routes.

## QA
- All local public image references were checked against `public/image`.
- No raw `<img>` tags remain in public-facing service/product/detail components.
- Bracket/brace balance checks passed on edited TSX files.
- ZIP integrity verified after packaging.
- Full `npm ci` / Next production build remains unavailable in this environment because a required npm package is not cached and registry access is unavailable.
