create or replace view public.v_contracts_ending_soon as
select
  c.id,
  c.client_id,
  cl.name as client_name,
  c.title,
  c.end_date,
  (c.end_date - current_date) as days_remaining
from public.contracts c
join public.clients cl on cl.id = c.client_id
where c.end_date >= current_date;

create or replace view public.v_machines_filter_alerts as
select
  cm.id,
  cm.client_id,
  cl.name as client_name,
  cm.next_filter_change_date,
  (cm.next_filter_change_date - current_date) as days_remaining
from public.client_machines cm
join public.clients cl on cl.id = cm.client_id
where cm.next_filter_change_date is not null;
