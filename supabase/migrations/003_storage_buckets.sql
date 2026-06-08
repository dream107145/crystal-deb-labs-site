-- Storage buckets for portfolio images and email assets

insert into storage.buckets (id, name, public)
values
  ('portfolio', 'portfolio', true),
  ('email-assets', 'email-assets', true)
on conflict (id) do nothing;

create policy "Portfolio images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'portfolio');

create policy "Email assets are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'email-assets');

create policy "Admins can upload portfolio images"
  on storage.objects for insert
  with check (bucket_id = 'portfolio' and public.is_admin());

create policy "Admins can update portfolio images"
  on storage.objects for update
  using (bucket_id = 'portfolio' and public.is_admin());

create policy "Admins can delete portfolio images"
  on storage.objects for delete
  using (bucket_id = 'portfolio' and public.is_admin());

create policy "Admins can upload email assets"
  on storage.objects for insert
  with check (bucket_id = 'email-assets' and public.is_admin());

create policy "Admins can update email assets"
  on storage.objects for update
  using (bucket_id = 'email-assets' and public.is_admin());

create policy "Admins can delete email assets"
  on storage.objects for delete
  using (bucket_id = 'email-assets' and public.is_admin());
