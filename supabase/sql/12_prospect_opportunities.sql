alter table if exists public.clients
  add column if not exists category text not null default 'other',
  add column if not exists flag text not null default 'none',
  add column if not exists address text,
  add column if not exists postal_code text,
  add column if not exists city text,
  add column if not exists country text not null default 'Belgique',
  add column if not exists installation_date date,
  add column if not exists improvement_notes text,
  add column if not exists internal_notes text;

alter table if exists public.client_categories
  add column if not exists is_active boolean not null default true;

alter table if exists public.flag_definitions
  add column if not exists is_active boolean not null default true;

alter table if exists public.machine_categories
  add column if not exists is_active boolean not null default true;

alter table if exists public.machine_types
  add column if not exists requires_filter_change boolean not null default false,
  add column if not exists filter_lifespan_days int,
  add column if not exists is_active boolean not null default true;

alter table if exists public.client_machines
  add column if not exists quantity int not null default 1,
  add column if not exists status text not null default 'active',
  add column if not exists notes text;

alter table if exists public.notifications
  add column if not exists title text,
  add column if not exists message text,
  add column if not exists status text not null default 'open';

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  role text not null default 'other',
  email text,
  phone text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contacts_client_id on public.contacts(client_id);

alter table if exists public.client_opportunities
  add column if not exists prospect_name text,
  add column if not exists prospect_contact_name text,
  add column if not exists prospect_email text,
  add column if not exists prospect_phone text,
  add column if not exists prospect_address text,
  add column if not exists prospect_postal_code text,
  add column if not exists prospect_city text,
  add column if not exists prospect_country text;

update public.client_opportunities opportunity
set
  prospect_name = coalesce(nullif(opportunity.prospect_name, ''), client.name, opportunity.title, 'Prospect sans nom'),
  prospect_postal_code = coalesce(nullif(opportunity.prospect_postal_code, ''), client.postal_code),
  prospect_city = coalesce(nullif(opportunity.prospect_city, ''), client.city),
  prospect_country = coalesce(nullif(opportunity.prospect_country, ''), client.country, 'Belgique')
from public.clients client
where opportunity.client_id = client.id;

update public.client_opportunities
set
  prospect_name = coalesce(nullif(prospect_name, ''), title, 'Prospect sans nom'),
  prospect_country = coalesce(nullif(prospect_country, ''), 'Belgique');

alter table if exists public.client_opportunities
  alter column prospect_name set default 'Prospect sans nom',
  alter column prospect_name set not null,
  alter column client_id drop not null;

do $$
begin
  if to_regclass('public.client_opportunities') is not null then
    if exists (
      select 1
      from pg_constraint
      where conname = 'client_opportunities_client_id_fkey'
        and conrelid = 'public.client_opportunities'::regclass
    ) then
      alter table public.client_opportunities drop constraint client_opportunities_client_id_fkey;
    end if;

    alter table public.client_opportunities
      add constraint client_opportunities_client_id_fkey
      foreign key (client_id) references public.clients(id) on delete set null;
  end if;
end $$;

create index if not exists idx_client_opportunities_prospect_name on public.client_opportunities(prospect_name);
