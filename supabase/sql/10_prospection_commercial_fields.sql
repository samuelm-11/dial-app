alter table if exists public.client_opportunities
  add column if not exists description text,
  add column if not exists linked_machine_category_id uuid references public.machine_categories(id),
  add column if not exists priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  add column if not exists estimated_value numeric(12,2),
  add column if not exists probability numeric(5,2) check (probability >= 0 and probability <= 100),
  add column if not exists yearly_revenue numeric(14,2),
  add column if not exists employee_count integer,
  add column if not exists total_machine_count integer,
  add column if not exists machine_counts_by_category jsonb not null default '{}'::jsonb,
  add column if not exists incumbent_competitor_name text,
  add column if not exists incumbent_competitor_category text check (
    incumbent_competitor_category is null
    or incumbent_competitor_category in ('hot_drinks', 'snacking', 'sandwich_catering', 'cold_drinks', 'water_fountain', 'other')
  ),
  add column if not exists competitor_contract_end_date date,
  add column if not exists notes text;

alter table if exists public.client_opportunities
  drop constraint if exists client_opportunities_status_check;

alter table if exists public.client_opportunities
  add constraint client_opportunities_status_check
  check (status in ('open', 'qualified', 'proposal', 'won', 'lost'));

alter table if exists public.client_opportunities
  add constraint client_opportunities_employee_count_check check (employee_count is null or employee_count >= 0),
  add constraint client_opportunities_total_machine_count_check check (total_machine_count is null or total_machine_count >= 0),
  add constraint client_opportunities_machine_counts_is_object_check check (jsonb_typeof(machine_counts_by_category) = 'object');

create index if not exists idx_client_opportunities_linked_machine_category_id on public.client_opportunities(linked_machine_category_id);
create index if not exists idx_client_opportunities_competitor_contract_end_date on public.client_opportunities(competitor_contract_end_date);
