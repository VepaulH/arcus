create table connections (
  id uuid default gen_random_uuid() primary key,
  requester_id uuid references profiles(id) on delete cascade not null,
  addressee_id uuid references profiles(id) on delete cascade not null,
  status text check (status in ('pending', 'accepted', 'declined')) default 'pending' not null,
  created_at timestamptz default now() not null,
  unique(requester_id, addressee_id)
);
