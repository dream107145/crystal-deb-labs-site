-- Crystal Dev Labs — initial schema

create type public.user_role as enum ('customer', 'developer', 'admin');

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role public.user_role not null default 'customer',
  telegram text,
  discord_id text,
  avatar_url text,
  email_verified boolean not null default false,
  is_approved boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_email_idx on public.profiles (email);
create index profiles_role_idx on public.profiles (role);

-- Email verification tokens (Resend flow)
create table public.email_verification_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index email_verification_tokens_token_idx on public.email_verification_tokens (token);

-- Inbox / messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  subject text not null,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index messages_recipient_idx on public.messages (recipient_id, created_at desc);
create index messages_sender_idx on public.messages (sender_id, created_at desc);

-- Portfolio projects
create table public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  image text not null,
  description text not null,
  tech_stack text[] not null default '{}',
  client text not null,
  outcomes text not null,
  screenshots text[] not null default '{}',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index portfolio_projects_published_idx on public.portfolio_projects (published, sort_order);

-- Site contact information (singleton row)
create table public.contact_info (
  id int primary key default 1 check (id = 1),
  email text not null,
  discord text not null,
  discord_ticket text not null,
  telegram text not null,
  telegram_handle text not null,
  updated_at timestamptz not null default now()
);

-- Auto-create profile on auth.users insert
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, is_approved)
  values (
    new.id,
    new.email,
    'customer',
    true
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger portfolio_projects_updated_at
  before update on public.portfolio_projects
  for each row execute function public.set_updated_at();

create trigger contact_info_updated_at
  before update on public.contact_info
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.email_verification_tokens enable row level security;
alter table public.messages enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.contact_info enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can update all profiles"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Messages policies
create policy "Users can view own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Recipients can mark messages read"
  on public.messages for update
  using (auth.uid() = recipient_id);

create policy "Admins can send messages"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Portfolio: public read for published, admin write
create policy "Anyone can view published projects"
  on public.portfolio_projects for select
  using (published = true);

create policy "Admins can view all projects"
  on public.portfolio_projects for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can manage projects"
  on public.portfolio_projects for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Contact info: public read, admin write
create policy "Anyone can view contact info"
  on public.contact_info for select
  using (true);

create policy "Admins can manage contact info"
  on public.contact_info for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Seed default contact info
insert into public.contact_info (id, email, discord, discord_ticket, telegram, telegram_handle)
values (
  1,
  'jackson97107@gmail.com',
  'https://discord.gg/jqQutYMAn',
  'https://discord.gg/jqQutYMAn',
  'https://t.me/eu00823',
  '@eu00823'
)
on conflict (id) do nothing;
