drop view if exists
  public.v_clients_with_parent,
  public.v_clients_hierarchy,
  public.v_client_machine_summary
cascade;

drop index if exists public.idx_clients_parent_client_id;

alter table if exists public.clients
  drop column if exists parent_client_id;
