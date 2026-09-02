# Batch 12 Image Manager Update

## Image Manager UX
- Added a clear page/section location for every image group.
- Added search and readable Home / Services / Products / Projects / Gallery / Footer filters.
- Added visible image number and FIRST IMAGE badge.
- Added explicit Edit button and edit dialog.
- Edit supports image name/alt text, visibility, auto-rotation, and rotation interval.
- Added Replace image action for built-in and admin-uploaded images.
- Kept Add image, Set First, Move Up/Down and Delete controls.
- Built-in images are protected from deletion; Edit/Replace should be used instead.
- Navbar was not modified by this update.

## Supabase
The existing `content_images` table and RLS design remain the source of truth. No `.env.local` file is added to the ZIP.

## User test
After extracting the ZIP:
1. Start the project normally.
2. Open Admin → Images.
3. Confirm the page/section label is visible.
4. Click Edit on an image and save a small change.
5. Click Replace image if a real image replacement is needed.
6. Refresh the page and confirm the change remains.


FIX INCLUDED: Home Gallery keeps the original fallback/local gallery images first.
New Admin-managed Home Gallery images are appended after the existing images and
use sort_order only for their own ordering. No new Image Manager section is added.
