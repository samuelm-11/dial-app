create table if not exists public.client_categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.flag_definitions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  color_hex text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.machine_categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.machine_types (
  id uuid primary key default gen_random_uuid(),
  machine_category_id uuid not null references public.machine_categories(id),
  code text not null unique,
  label text not null,
  requires_filter_change boolean not null default false,
  filter_lifespan_days int,
  recommended_filter_interval_days int,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notification_rules (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  days_before_due int not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
