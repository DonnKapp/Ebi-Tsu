-- Trigger functions do not need to be exposed as REST-callable RPCs.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Customers may create/update only their own non-authorization profile fields.
revoke insert on table public.profiles from authenticated;
grant insert (
  id,
  full_name,
  phone,
  marketing_opt_in,
  address_line_1,
  address_line_2,
  city,
  state_region,
  postal_code,
  country,
  updated_at
) on table public.profiles to authenticated;

drop policy if exists "customers can create own profiles" on public.profiles;
create policy "customers can create own profiles"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

-- Avoid evaluating auth.uid() once per inventory row.
drop policy if exists inventory_admin_insert on public.inventory_items;
create policy inventory_admin_insert
on public.inventory_items
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

drop policy if exists inventory_admin_update on public.inventory_items;
create policy inventory_admin_update
on public.inventory_items
for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

drop policy if exists inventory_admin_delete on public.inventory_items;
create policy inventory_admin_delete
on public.inventory_items
for delete
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

-- One SELECT policy per table keeps customer and admin access clear and efficient.
drop policy if exists "admins can view all inquiries" on public.inquiries;
drop policy if exists "customers can view own inquiries" on public.inquiries;
create policy "authenticated can view permitted inquiries"
on public.inquiries
for select
to authenticated
using (
  (select auth.uid()) = user_id
  or exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

drop policy if exists "admins can view all livestock requests" on public.livestock_requests;
drop policy if exists "customers can view own livestock requests" on public.livestock_requests;
create policy "authenticated can view permitted livestock requests"
on public.livestock_requests
for select
to authenticated
using (
  (select auth.uid()) = user_id
  or exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

create index if not exists livestock_requests_inventory_item_id_idx
  on public.livestock_requests (inventory_item_id);
