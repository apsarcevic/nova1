create table if not exists public.licenses (
  license_key text primary key,
  customer_email text not null,
  plan text not null default 'premium',
  status text not null default 'active',
  expires_at timestamptz null,
  provider text not null default 'paddle',
  provider_customer_id text null,
  provider_transaction_id text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists licenses_customer_email_idx on public.licenses (customer_email);
create index if not exists licenses_provider_transaction_id_idx on public.licenses (provider_transaction_id);
