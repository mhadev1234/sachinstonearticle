# Admin + Supabase final setup

The admin panel intentionally remains protected by Supabase Auth. It is not bypassed.

Create `.env.local` inside the `sachin-stone-article` project folder with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wkpegqsvexqevhefuotv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

Use the publishable/anon client key from the Supabase project settings. Never paste a service-role key into the browser or chat.

After changing `.env.local`, stop the dev server and run `npm run dev` again.
