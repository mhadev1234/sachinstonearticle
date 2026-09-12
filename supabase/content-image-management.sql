create table if not exists public.content_images (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_key text not null,
  url text not null,
  alt text not null default '',
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  auto_rotate boolean not null default false,
  interval_seconds integer not null default 7,
  source text not null default 'admin',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists content_images_entity_idx on public.content_images(entity_type, entity_key, sort_order);
create unique index if not exists content_images_primary_idx on public.content_images(entity_type, entity_key) where is_primary = true;
alter table public.content_images enable row level security;
drop policy if exists "public can read active content images" on public.content_images;
drop policy if exists "authenticated admins can insert content images" on public.content_images;
drop policy if exists "authenticated admins can update content images" on public.content_images;
drop policy if exists "authenticated admins can delete content images" on public.content_images;
create policy "public can read active content images" on public.content_images for select using (active = true);
create policy "authenticated admins can insert content images" on public.content_images for insert to authenticated with check (true);
create policy "authenticated admins can update content images" on public.content_images for update to authenticated using (true) with check (true);
create policy "authenticated admins can delete content images" on public.content_images for delete to authenticated using (true);

-- Keep updated_at current for every admin change.
create or replace function public.set_content_images_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists content_images_updated_at on public.content_images;
create trigger content_images_updated_at before update on public.content_images for each row execute function public.set_content_images_updated_at();

-- Seed the website's built-in image catalogue. Safe to run repeatedly.
insert into public.content_images (entity_type, entity_key, url, alt, sort_order, is_primary, source, active) values
  ('home','hero','/image/hero.jpeg','hero',0,false,'built-in',true),
  ('home','about','/image/about.jpeg','about',1,false,'built-in',true),
  ('footer','designed-by','/image/logo.png','designed by',2,false,'built-in',true),
  ('gallery','main','/image/gallery1.jpeg','main',3,false,'built-in',true),
  ('gallery','main','/image/gallery2.jpeg','main',4,false,'built-in',true),
  ('gallery','main','/image/gallery3.jpeg','main',5,false,'built-in',true),
  ('gallery','main','/image/gallery4.jpeg','main',6,false,'built-in',true),
  ('gallery','main','/image/gallery5.jpeg','main',7,false,'built-in',true),
  ('gallery','main','/image/gallery6.jpeg','main',8,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery1-1.jpg','showcase',9,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery1-2.jpg','showcase',10,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery1-3.jpg','showcase',11,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery1-4.jpg','showcase',12,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery2-1.jpg','showcase',13,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery2-2.jpg','showcase',14,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery2-3.jpg','showcase',15,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery2-4.jpg','showcase',16,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery3-1.jpg','showcase',17,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery3-2.jpg','showcase',18,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery3-3.jpg','showcase',19,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery3-4.jpg','showcase',20,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery4-1.jpg','showcase',21,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery4-2.jpg','showcase',22,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery4-3.jpg','showcase',23,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery4-4.jpg','showcase',24,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery5-1.jpg','showcase',25,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery5-2.jpg','showcase',26,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery5-3.jpg','showcase',27,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery5-4.jpg','showcase',28,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery6-1.jpg','showcase',29,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery6-2.jpg','showcase',30,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery6-3.jpg','showcase',31,false,'built-in',true),
  ('project','showcase','/image/showcase/gallery6-4.jpg','showcase',32,false,'built-in',true)
on conflict do nothing;
