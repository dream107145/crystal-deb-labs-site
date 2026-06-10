-- Developer assignments and per-project chat

create table public.request_assignments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.project_requests (id) on delete cascade,
  developer_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (request_id, developer_id)
);

create index request_assignments_dev_idx on public.request_assignments (developer_id);

create table public.project_messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.project_requests (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index project_messages_request_idx on public.project_messages (request_id, created_at);

-- Participant = request owner, assigned developer, or admin
create or replace function public.is_request_participant(req_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    exists (
      select 1 from public.project_requests r
      where r.id = req_id and r.user_id = auth.uid()
    )
    or exists (
      select 1 from public.request_assignments a
      where a.request_id = req_id and a.developer_id = auth.uid()
    )
    or public.is_admin();
$$;

alter table public.request_assignments enable row level security;
alter table public.project_messages enable row level security;

create policy "Participants can view assignments"
  on public.request_assignments for select
  using (public.is_request_participant(request_id));

create policy "Admins can manage assignments"
  on public.request_assignments for all
  using (public.is_admin());

create policy "Participants can view project messages"
  on public.project_messages for select
  using (public.is_request_participant(request_id));

create policy "Participants can send project messages"
  on public.project_messages for insert
  with check (auth.uid() = sender_id and public.is_request_participant(request_id));

-- Developers can see requests they are assigned to
create policy "Developers can view assigned requests"
  on public.project_requests for select
  using (
    exists (
      select 1 from public.request_assignments a
      where a.request_id = id and a.developer_id = auth.uid()
    )
  );

-- Realtime for live chat
alter publication supabase_realtime add table public.project_messages;
