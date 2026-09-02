# Batch 10 image/route QA notes

- Product and service detail galleries use deterministic local catalog images first and safe fallback handling for broken remote URLs.
- The public gallery and project showcase merge local catalogue imagery with Supabase records so newly visible local assets are not hidden when the database has records.
- Admin lists show the canonical local image when a DB row has no image URL.
- Navbar is borderless at the top and uses a bottom border only after scroll.
- If Next.js reports an old hydration class mismatch after replacing this ZIP, stop the dev server, delete the project `.next` directory, then restart `npm run dev`; do not copy `.next` from another project.
