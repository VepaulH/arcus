-- Enable Row Level Security on the connections table.
-- The backend service-role key bypasses RLS, so all existing API routes are unaffected.
-- These policies guard against any direct client-side access.

alter table connections enable row level security;

-- Either party can read their own connections
create policy "connections: own read"
  on connections for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- A user can only initiate a connection as the requester
create policy "connections: own insert"
  on connections for insert
  with check (auth.uid() = requester_id);

-- Either party can update (requester cancels, addressee accepts/declines)
create policy "connections: own update"
  on connections for update
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- Either party can delete the connection
create policy "connections: own delete"
  on connections for delete
  using (auth.uid() = requester_id or auth.uid() = addressee_id);
