create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function public.compute_next_filter_change_date()
returns trigger as $$
begin
  if new.last_filter_change_date is not null and new.filter_interval_days is not null then
    new.next_filter_change_date = new.last_filter_change_date + (new.filter_interval_days || ' days')::interval;
  end if;
  return new;
end;
$$ language plpgsql;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_clients_set_updated_at') then
    create trigger trg_clients_set_updated_at before update on public.clients
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_client_machines_set_updated_at') then
    create trigger trg_client_machines_set_updated_at before update on public.client_machines
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_contracts_set_updated_at') then
    create trigger trg_contracts_set_updated_at before update on public.contracts
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_client_opportunities_set_updated_at') then
    create trigger trg_client_opportunities_set_updated_at before update on public.client_opportunities
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_notifications_set_updated_at') then
    create trigger trg_notifications_set_updated_at before update on public.notifications
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_client_machines_next_filter_date') then
    create trigger trg_client_machines_next_filter_date before insert or update on public.client_machines
    for each row execute function public.compute_next_filter_change_date();
  end if;
end $$;
