-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.sites enable row level security;
alter table public.generations enable row level security;
alter table public.chat_messages enable row level security;

-- PROFILES
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- SITES: owner CRUD
create policy "Users can view own sites"
  on public.sites for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create sites"
  on public.sites for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own sites"
  on public.sites for update
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can delete own sites"
  on public.sites for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- SITES: public read for published
create policy "Anyone can view published sites"
  on public.sites for select
  to anon, authenticated
  using (published = true);

-- GENERATIONS
create policy "Users can view own generations"
  on public.generations for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own generations"
  on public.generations for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- CHAT MESSAGES
create policy "Users can view own chat messages"
  on public.chat_messages for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own chat messages"
  on public.chat_messages for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
