create table public.sites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Untitled Site',
  slug text unique,
  html_content text not null default '',
  css_content text not null default '',
  category text check (category in ('event', 'valentine', 'personal', 'funny', 'work', 'other')),
  published boolean not null default false,
  has_watermark boolean not null default true,
  thumbnail_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_sites_user_id on public.sites(user_id);
create unique index idx_sites_slug on public.sites(slug) where slug is not null;
