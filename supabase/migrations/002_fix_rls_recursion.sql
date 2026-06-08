-- Fix infinite RLS recursion on profiles table.
-- Admin policies were self-referencing profiles, blocking all reads.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Profiles
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.is_admin());

-- Messages
drop policy if exists "Admins can send messages" on public.messages;

create policy "Admins can send messages"
  on public.messages for insert
  with check (public.is_admin());

-- Portfolio
drop policy if exists "Admins can view all projects" on public.portfolio_projects;
drop policy if exists "Admins can manage projects" on public.portfolio_projects;

create policy "Admins can view all projects"
  on public.portfolio_projects for select
  using (public.is_admin());

create policy "Admins can manage projects"
  on public.portfolio_projects for all
  using (public.is_admin());

-- Contact info
drop policy if exists "Admins can manage contact info" on public.contact_info;

create policy "Admins can manage contact info"
  on public.contact_info for all
  using (public.is_admin());
