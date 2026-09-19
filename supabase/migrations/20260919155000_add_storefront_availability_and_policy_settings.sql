-- Keep each livestock line's public availability context editable by the admin.
alter table public.inventory_items
  add column if not exists availability_note text not null default 'Availability details will be published as this line develops.';

update public.inventory_items
set availability_note = case availability
  when 'out_of_stock' then 'This line is not currently available. You are welcome to submit a non-binding request for future availability.'
  when 'coming_soon' then 'This line is being prepared for future catalog availability. You are welcome to submit a non-binding request.'
  when 'accepting_requests' then 'Requests are welcome while future availability is being assessed. A request does not reserve livestock.'
  when 'limited' then 'Availability is limited and will be confirmed directly before ordering.'
  when 'available' then 'Current availability is managed by Ebi Tsū and will be confirmed directly before ordering.'
  else 'Availability details will be published as this line develops.'
end;

-- One deliberately simple, public-readable source of truth for pre-order guidance.
create table if not exists public.storefront_settings (
  id boolean primary key default true check (id),
  availability_guidance text not null,
  ordering_guidance text not null,
  shipping_guidance text not null,
  live_arrival_guidance text not null,
  payment_guidance text not null,
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.storefront_settings (
  id,
  availability_guidance,
  ordering_guidance,
  shipping_guidance,
  live_arrival_guidance,
  payment_guidance
)
values (
  true,
  'Availability is updated line by line. A line marked In stock or Limited availability is not automatically reserved; final selection and quantity are confirmed directly before ordering.',
  'Catalog information is provided for browsing and planning. Submit a livestock request to describe what you are seeking. Requests are non-binding and do not place or reserve an order.',
  'Shipping service areas, carrier methods, shipping days, and weather-hold procedures are being finalized. Eligible locations and shipping terms will be published before live shipping begins.',
  'Live-arrival and replacement terms are being finalized. A published policy will explain how to document a delivery issue and what may be eligible for review.',
  'Payment methods and checkout timing are being finalized. No payment is collected through a livestock request at this stage.'
)
on conflict (id) do nothing;

alter table public.storefront_settings enable row level security;

revoke all on table public.storefront_settings from anon, authenticated;
grant select on table public.storefront_settings to anon, authenticated;
grant update (
  availability_guidance,
  ordering_guidance,
  shipping_guidance,
  live_arrival_guidance,
  payment_guidance,
  updated_at
) on table public.storefront_settings to authenticated;

drop policy if exists storefront_settings_public_read on public.storefront_settings;
create policy storefront_settings_public_read
on public.storefront_settings
for select
to public
using (true);

drop policy if exists storefront_settings_admin_update on public.storefront_settings;
create policy storefront_settings_admin_update
on public.storefront_settings
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
