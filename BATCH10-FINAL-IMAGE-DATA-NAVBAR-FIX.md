# Batch 10 — Image/Data + Navbar Fix

- Navbar is borderless at the top and reveals its bottom border only when the home hero is nearly finished.
- WhatsApp uses the WhatsApp logo in its native green; Call uses a phone receiver icon in blue; Email uses the envelope icon in Gmail red.
- Supabase remote image URLs bypass the Next image optimizer to avoid the observed 400 responses from `/_next/image`.
- Product listing/detail pages now preserve the actual admin/Supabase `image_url` instead of replacing it with a local fallback.
- Product detail galleries put the admin image first, then local category images, without duplicates.
- Home Gallery now loads recent admin gallery uploads from Supabase, so new gallery images can appear on Home as well as the full Gallery.
- Full Gallery and Project Showcase support remote Supabase images without the optimizer failure.
- Service and product pages continue to use the fixed canonical 9 + 9 catalogue.
- No `.env.local` or secrets are included.
