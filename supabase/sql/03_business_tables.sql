create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  parent_client_id uuid references public.clients(id),
  client_category_id uuid references public.client_categories(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_contacts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_machines (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  machine_type_id uuid not null references public.machine_types(id),
  serial_number text,
  installation_date date,
  filter_interval_days int,
  last_filter_change_date date,
  next_filter_change_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null,
  start_date date not null,
  end_date date not null,
  private_pdf_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_opportunities (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null,
  amount numeric(12,2),
  status text not null check (status in ('open', 'won', 'lost')),
  expected_close_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_flags (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  flag_definition_id uuid not null references public.flag_definitions(id),
  created_at timestamptz not null default now(),
  unique (client_id, flag_definition_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  client_machine_id uuid references public.client_machines(id) on delete set null,
  contract_id uuid references public.contracts(id) on delete set null,
  notification_rule_id uuid references public.notification_rules(id) on delete set null,
  type text not null check (type in ('contract_end', 'filter_change')),
  due_date date not null,
  is_resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
