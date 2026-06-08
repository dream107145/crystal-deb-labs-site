-- Add project link URL to portfolio items

alter table public.portfolio_projects
  add column if not exists link text not null default '';
