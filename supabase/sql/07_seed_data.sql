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

insert into public.contract_templates (name, description, content, is_active)
select
  'Contrat de service vending',
  'Modèle type pour client ou site en région liégeoise.',
  'CONTRAT DE SERVICE

Entre Dial, prestataire de distribution automatique en région liégeoise,
et {{client.nom}}, situé {{client.adresse}}, {{client.code_postal}} {{client.ville}}, {{client.pays}}.

Contact principal: {{contact.nom}}
Email: {{contact.email}}
Téléphone: {{contact.telephone}}

Le présent contrat prend effet le {{contrat.date_debut}} et se termine le {{contrat.date_fin}}.

Fait à Liège, le {{date}}.',
  true
where not exists (
  select 1 from public.contract_templates where name = 'Contrat de service vending'
);
