insert into public.client_categories (code, label)
values
  ('enterprise', 'Entreprise'),
  ('franchise', 'Franchise')
on conflict (code) do nothing;

insert into public.flag_definitions (code, label, color_hex)
values
  ('vip', 'VIP', '#0ea5e9'),
  ('risk', 'Risque', '#ef4444')
on conflict (code) do nothing;

insert into public.machine_categories (code, label)
values
  ('coffee', 'Machines à café'),
  ('snack', 'Distributeurs snacks')
on conflict (code) do nothing;

insert into public.notification_rules (code, label, days_before_due)
values
  ('contract_30', 'Contrat J-30', 30),
  ('filter_7', 'Filtre J-7', 7)
on conflict (code) do nothing;
