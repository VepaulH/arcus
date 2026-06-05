-- Defines weekly_goals and onboarding_data with RLS policies.
-- If these tables already exist in your Supabase project (created via dashboard),
-- skip the CREATE TABLE blocks and run only the ALTER + CREATE POLICY statements.
--
-- Policies are split by role:
--   authenticated  — scoped to auth.uid() = user_id (browser / user JWT)
--   service_role   — unrestricted (backend service key; BYPASSRLS handles this,
--                    but explicit policies guard against misconfigured projects)

-- ── weekly_goals ─────────────────────────────────────────────

create table if not exists public.weekly_goals (
  id            uuid        default gen_random_uuid() primary key,
  user_id       uuid        references auth.users(id) on delete cascade not null,
  title         text        not null,
  current_count integer     default 0 not null,
  target        integer     not null,
  unit          text        not null,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.weekly_goals enable row level security;

drop policy if exists "weekly_goals: own read"         on public.weekly_goals;
drop policy if exists "weekly_goals: own insert"       on public.weekly_goals;
drop policy if exists "weekly_goals: own update"       on public.weekly_goals;
drop policy if exists "weekly_goals: own delete"       on public.weekly_goals;
drop policy if exists "weekly_goals: service_role all" on public.weekly_goals;

-- authenticated: users see / modify only their own rows
create policy "weekly_goals: own read"
  on public.weekly_goals for select
  to authenticated
  using (auth.uid() = user_id);

create policy "weekly_goals: own insert"
  on public.weekly_goals for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "weekly_goals: own update"
  on public.weekly_goals for update
  to authenticated
  using (auth.uid() = user_id);

create policy "weekly_goals: own delete"
  on public.weekly_goals for delete
  to authenticated
  using (auth.uid() = user_id);

-- service_role: backend has full access (auth.uid() is NULL for service_role)
create policy "weekly_goals: service_role all"
  on public.weekly_goals for all
  to service_role
  using (true)
  with check (true);


-- ── onboarding_data ───────────────────────────────────────────

create table if not exists public.onboarding_data (
  id              uuid        default gen_random_uuid() primary key,
  user_id         uuid        references auth.users(id) on delete cascade not null unique,
  revenue_range   text,
  looking_for     text,
  referral_source text,
  roadmap_id      text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.onboarding_data enable row level security;

drop policy if exists "onboarding_data: own read"         on public.onboarding_data;
drop policy if exists "onboarding_data: own insert"       on public.onboarding_data;
drop policy if exists "onboarding_data: own update"       on public.onboarding_data;
drop policy if exists "onboarding_data: service_role all" on public.onboarding_data;

create policy "onboarding_data: own read"
  on public.onboarding_data for select
  to authenticated
  using (auth.uid() = user_id);

create policy "onboarding_data: own insert"
  on public.onboarding_data for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "onboarding_data: own update"
  on public.onboarding_data for update
  to authenticated
  using (auth.uid() = user_id);

create policy "onboarding_data: service_role all"
  on public.onboarding_data for all
  to service_role
  using (true)
  with check (true);
