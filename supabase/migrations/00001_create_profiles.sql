create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  tier text not null default 'free' check (tier in ('free', 'pro')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  generations_used integer not null default 0,
  edits_used integer not null default 0,
  usage_reset_at timestamptz not null default date_trunc('month', now()),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-reset usage counters monthly
create or replace function public.check_usage_reset()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.usage_reset_at < date_trunc('month', now()) then
    new.generations_used := 0;
    new.edits_used := 0;
    new.usage_reset_at := date_trunc('month', now());
  end if;
  return new;
end;
$$;

create trigger before_profile_access
  before update on public.profiles
  for each row execute function public.check_usage_reset();
