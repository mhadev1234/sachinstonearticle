# Batch 10 — Final QA Locked Revision

This revision consolidates the latest requested fixes without adding `.env.local` or other secrets.

## Locked behavior
- Navbar is borderless at the top; the border appears when the home hero is nearly finished.
- WhatsApp, phone and email use their own recognizable brand/communication icons and colors.
- Supabase-hosted product/service/gallery images are rendered with `unoptimized` when remote, avoiding the Next image optimizer 400 issue seen in the supplied console log.
- Admin-saved product/service image URLs are preserved and take priority over local fallback images.
- Home Services/Products showcase now syncs the current admin image URL for the canonical catalogue items.
- Gallery accepts image rows whose `media_type` is blank as image records.
- Service list keys are unique and deterministic.
- Product/service stone objects use `object-contain` in the visual catalogue/detail areas to avoid unwanted cropping.
- No `.env.local`, secrets, `node_modules`, or `.next` directory is packaged.

## Static QA
- Local asset reference check: 0 missing.
- Navbar canonical services: 9.
- Navbar canonical products: 9.
- Service list duplicate-key fix present.
- Home catalogue Supabase image sync present.
- Source delimiter count check: 0 issues.

## Environment limitation
A full `npm ci`, `npm run lint`, and `npm run build` could not be completed in this environment because the npm registry dependency download was unavailable/timed out. Therefore this archive is not represented as a successfully production-built artifact. The user's local `.env.local` must remain outside the ZIP.
