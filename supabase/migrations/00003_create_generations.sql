create table public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  site_id uuid not null references public.sites(id) on delete cascade,
  prompt text not null,
  generation_type text not null check (generation_type in ('create', 'edit')),
  model_used text not null,
  tokens_used integer,
  created_at timestamptz not null default now()
);

create index idx_generations_user_id on public.generations(user_id);
create index idx_generations_site_id on public.generations(site_id);
