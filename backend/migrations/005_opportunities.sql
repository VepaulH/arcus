-- Live startup opportunities (competitions, accelerators, hackathons, grants),
-- refreshed weekly by an LLM web-search job. Replaces the hardcoded frontend list.

create table if not exists public.opportunities (
  id          uuid        default gen_random_uuid() primary key,
  title       text        not null,
  type        text        check (type in ('Competition', 'Accelerator', 'Hackathon', 'Grant', 'Event')) not null,
  url         text        not null,
  description text,
  deadline    text,
  source      text,
  fetched_at  timestamptz default now() not null,
  created_at  timestamptz default now() not null
);

alter table public.opportunities enable row level security;

-- Anyone signed in can read the current opportunity list
create policy "opportunities: authenticated read"
  on public.opportunities for select
  to authenticated
  using (true);

-- Only the backend (service role) writes
create policy "opportunities: service_role all"
  on public.opportunities for all
  to service_role
  using (true)
  with check (true);
