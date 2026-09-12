# BATCH12 – Global Admin Image Management

Adds a single Admin Image Manager for website image assets. It covers built-in catalog images plus persisted Supabase-managed images and supports primary/first image, order, auto rotation, interval, upload and delete.

## Supabase
Run `supabase/content-image-management.sql` once in Supabase SQL Editor before using persistent controls.

## QA
- TypeScript/ESLint/build must be run with the project's own environment variables.
- Built-in assets remain available even when the database has no rows.
- Admin-uploaded assets are stored in the existing `gallery` bucket under `managed/...`.


FIX INCLUDED: Home Gallery keeps the original fallback/local gallery images first.
New Admin-managed Home Gallery images are appended after the existing images and
use sort_order only for their own ordering. No new Image Manager section is added.
