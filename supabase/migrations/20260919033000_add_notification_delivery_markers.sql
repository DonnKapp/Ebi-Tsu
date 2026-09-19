alter table public.inquiries
  add column if not exists owner_notified_at timestamptz,
  add column if not exists customer_notified_at timestamptz;

alter table public.livestock_requests
  add column if not exists owner_notified_at timestamptz,
  add column if not exists customer_notified_at timestamptz;
