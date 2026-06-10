-- Password reset, project requests, quotes, notifications, testimonials

-- Password reset tokens (Resend flow, service-role only)
create table public.password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index password_reset_tokens_token_idx on public.password_reset_tokens (token);

-- Project requests (saved contact form submissions, trackable by customers)
create type public.request_status as enum (
  'pending', 'quoted', 'in_progress', 'review', 'delivered', 'cancelled'
);

create table public.project_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  name text not null,
  email text not null,
  service text not null,
  details text not null,
  budget text not null,
  status public.request_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index project_requests_user_idx on public.project_requests (user_id, created_at desc);
create index project_requests_status_idx on public.project_requests (status);

create trigger project_requests_updated_at
  before update on public.project_requests
  for each row execute function public.set_updated_at();

-- Quotes against project requests
create type public.quote_status as enum ('pending', 'accepted', 'declined');

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.project_requests (id) on delete cascade,
  amount numeric(12,2) not null,
  currency text not null default 'USD',
  description text not null default '',
  status public.quote_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index quotes_request_idx on public.quotes (request_id, created_at desc);

create trigger quotes_updated_at
  before update on public.quotes
  for each row execute function public.set_updated_at();

-- In-app notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text not null default '',
  link text not null default '',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications (user_id, is_read, created_at desc);

-- Testimonials
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  company text not null default '',
  quote text not null,
  rating int not null check (rating between 1 and 5),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index testimonials_approved_idx on public.testimonials (approved, created_at desc);

-- RLS
alter table public.password_reset_tokens enable row level security;
alter table public.project_requests enable row level security;
alter table public.quotes enable row level security;
alter table public.notifications enable row level security;
alter table public.testimonials enable row level security;

-- Project requests
create policy "Users can view own requests"
  on public.project_requests for select
  using (auth.uid() = user_id);

create policy "Admins can manage requests"
  on public.project_requests for all
  using (public.is_admin());

-- Quotes
create policy "Users can view quotes on own requests"
  on public.quotes for select
  using (
    exists (
      select 1 from public.project_requests r
      where r.id = request_id and r.user_id = auth.uid()
    )
  );

create policy "Users can respond to quotes on own requests"
  on public.quotes for update
  using (
    exists (
      select 1 from public.project_requests r
      where r.id = request_id and r.user_id = auth.uid()
    )
  );

create policy "Admins can manage quotes"
  on public.quotes for all
  using (public.is_admin());

-- Notifications
create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Testimonials
create policy "Anyone can view approved testimonials"
  on public.testimonials for select
  using (approved = true);

create policy "Users can view own testimonials"
  on public.testimonials for select
  using (auth.uid() = user_id);

create policy "Users can submit testimonials"
  on public.testimonials for insert
  with check (auth.uid() = user_id);

create policy "Admins can manage testimonials"
  on public.testimonials for all
  using (public.is_admin());

-- Realtime for notifications
alter publication supabase_realtime add table public.notifications;
