-- Prevent public and customer sessions from changing authorization-bearing profile fields.
revoke all on table public.profiles from anon;
revoke update on table public.profiles from authenticated;
grant update (
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

-- A publicly in-stock line must have coherent commercial values.
alter table public.inventory_items
  add constraint inventory_available_values_check
  check (
    availability not in ('available', 'limited')
    or (
      price > 0
      and quantity > 0
      and minimum_order > 0
      and minimum_order <= quantity
    )
  );
