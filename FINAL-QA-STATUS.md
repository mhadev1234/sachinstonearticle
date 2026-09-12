# Batch 10 — Interim QA Status

This file is intentionally marked **INTERIM**, not final.

## Completed in this pass
- Canonical catalogue reduced to **9 Products** and **9 Services**.
- Railway/Public Projects kept out of Products.
- Custom Architectural Stone Work kept as a Service.
- Product and Service list/detail fallbacks use the same canonical slugs.
- Valid local Product/Service routes have deterministic fallbacks even when Supabase is unavailable or returns an API error.
- Database Product/Service results are constrained to the canonical catalogue and local category images are preferred for the public catalogue.
- Rajasthan-style category assets are used for the matching Product/Service cards.
- Category assets were upscaled into `public/image/rajasthan-style-hd/` for cleaner large-card rendering.
- Product card galleries no longer fall back to unrelated Product images.
- Object presentation uses `object-contain` for Product card imagery to reduce unwanted cropping.
- Navbar is borderless at the top and shows a subtle bottom border after scrolling.
- Luxury Light navbar is forced to a light surface instead of remaining black.
- Brand uses two centered lines: `SACHIN` / `STONE & ARTICLE`.
- Footer includes the larger `Designed by Sudesh (Sidh)` signature with a circular S badge.
- WhatsApp/Email/Phone icons use distinct brand/natural colors.
- Next.js smooth-scroll warning is addressed with `data-scroll-behavior="smooth"`.

## Checks completed
- 9 Product fallback entries found.
- 9 Service fallback entries found.
- Product and Service dynamic route files exist.
- Local image references used by TSX files resolve to existing files.
- Basic delimiter/brace/parenthesis balance checked on modified TSX files.

## Still pending
- Fresh original high-resolution Product/Service image generation. This cannot be completed in the current image-generation window.
- A clean `npm ci` / `npm run build` in this environment could not be completed because npm registry access timed out.
- Real Supabase/Admin login testing still requires the project's local `.env.local` credentials on the user's machine.

Do not call this release 100% final until those pending checks are completed.


## Interim 9.0-target hardening
- Public Gallery now has a local fallback when Supabase is not configured.
- Public Products now has a canonical local fallback when Supabase is not configured.
- Service detail gallery access is guarded by Supabase configuration and no longer performs an unguarded request.
- Product/service/detail image presentation prefers full-object containment to reduce unwanted cropping.
- Brand accent is aligned with the black/white/hot-pink visual system.
- Remaining deliberate dependency: real Admin/Supabase authentication requires the project's private `.env.local` on the user's machine.
- Remaining visual dependency: new category-specific HD image sets will be added later.


## Visual-first refinement
- Homepage Services now shows all 9 canonical services with direct detail links.
- Service cards use concise copy and image-first presentation.
- Luxury Light receives a dedicated light treatment for the services showcase.
