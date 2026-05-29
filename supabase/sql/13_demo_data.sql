insert into public.client_categories (id, code, label, is_active)
values
  ('12000000-0000-0000-0000-000000000001', 'enterprise', 'Grand compte', true),
  ('12000000-0000-0000-0000-000000000002', 'sme', 'PME', true),
  ('12000000-0000-0000-0000-000000000003', 'public', 'Secteur public', true),
  ('12000000-0000-0000-0000-000000000004', 'franchise', 'Franchise', true),
  ('12000000-0000-0000-0000-000000000005', 'other', 'Autre', true)
on conflict (code) do update set label = excluded.label, is_active = excluded.is_active;

insert into public.flag_definitions (id, code, label, color_hex, is_active)
values
  ('12100000-0000-0000-0000-000000000001', 'vip', 'VIP', '#0ea5e9', true),
  ('12100000-0000-0000-0000-000000000002', 'risk', 'Risque', '#ef4444', true),
  ('12100000-0000-0000-0000-000000000003', 'watch', 'Surveillance', '#f59e0b', true),
  ('12100000-0000-0000-0000-000000000004', 'none', 'Aucun', '#64748b', true)
on conflict (code) do update set label = excluded.label, color_hex = excluded.color_hex, is_active = excluded.is_active;

insert into public.machine_categories (id, code, label, is_active)
values
  ('12200000-0000-0000-0000-000000000001', 'coffee', 'Machines à café', true),
  ('12200000-0000-0000-0000-000000000002', 'snack', 'Distributeurs snacks', true),
  ('12200000-0000-0000-0000-000000000003', 'cold_drinks', 'Boissons froides', true),
  ('12200000-0000-0000-0000-000000000004', 'water', 'Fontaines à eau', true)
on conflict (code) do update set label = excluded.label, is_active = excluded.is_active;

insert into public.machine_types (id, machine_category_id, code, label, requires_filter_change, filter_lifespan_days, recommended_filter_interval_days, is_active)
select '12300000-0000-0000-0000-000000000001', id, 'coffee_beans', 'Café grains compact', true, 90, 90, true
from public.machine_categories where code = 'coffee'
on conflict (code) do update set label = excluded.label, requires_filter_change = excluded.requires_filter_change, filter_lifespan_days = excluded.filter_lifespan_days, recommended_filter_interval_days = excluded.recommended_filter_interval_days, is_active = excluded.is_active;

insert into public.machine_types (id, machine_category_id, code, label, requires_filter_change, filter_lifespan_days, recommended_filter_interval_days, is_active)
select '12300000-0000-0000-0000-000000000002', id, 'snack_standard', 'Snack spiral 32 sélections', false, null, null, true
from public.machine_categories where code = 'snack'
on conflict (code) do update set label = excluded.label, requires_filter_change = excluded.requires_filter_change, filter_lifespan_days = excluded.filter_lifespan_days, recommended_filter_interval_days = excluded.recommended_filter_interval_days, is_active = excluded.is_active;

insert into public.machine_types (id, machine_category_id, code, label, requires_filter_change, filter_lifespan_days, recommended_filter_interval_days, is_active)
select '12300000-0000-0000-0000-000000000003', id, 'cold_bottle', 'Armoire boissons froides', false, null, null, true
from public.machine_categories where code = 'cold_drinks'
on conflict (code) do update set label = excluded.label, requires_filter_change = excluded.requires_filter_change, filter_lifespan_days = excluded.filter_lifespan_days, recommended_filter_interval_days = excluded.recommended_filter_interval_days, is_active = excluded.is_active;

insert into public.machine_types (id, machine_category_id, code, label, requires_filter_change, filter_lifespan_days, recommended_filter_interval_days, is_active)
select '12300000-0000-0000-0000-000000000004', id, 'water_fountain_filter', 'Fontaine réseau filtrante', true, 180, 180, true
from public.machine_categories where code = 'water'
on conflict (code) do update set label = excluded.label, requires_filter_change = excluded.requires_filter_change, filter_lifespan_days = excluded.filter_lifespan_days, recommended_filter_interval_days = excluded.recommended_filter_interval_days, is_active = excluded.is_active;

insert into public.notification_rules (id, code, label, days_before_due, is_active)
values
  ('12400000-0000-0000-0000-000000000001', 'contract_end_90d', 'Fin de contrat à 90 jours', 90, true),
  ('12400000-0000-0000-0000-000000000002', 'contract_end_30d', 'Fin de contrat à 30 jours', 30, true),
  ('12400000-0000-0000-0000-000000000003', 'filter_change_30d', 'Changement filtre à 30 jours', 30, true)
on conflict (code) do update set label = excluded.label, days_before_due = excluded.days_before_due, is_active = excluded.is_active;

insert into public.clients (id, name, category, flag, address, postal_code, city, country, installation_date, improvement_notes, internal_notes, is_active)
values
  ('13000000-0000-0000-0000-000000000001', 'Atelier Meuse Logistics', 'enterprise', 'vip', 'Rue de l''Industrie 14', '4040', 'Herstal', 'Belgique', current_date - interval '18 months', 'Bon potentiel pour extension boissons froides.', 'Client démo - contrat actif.', true),
  ('13000000-0000-0000-0000-000000000002', 'Campus Saint-Laurent', 'public', 'watch', 'Boulevard d''Avroy 61', '4000', 'Liège', 'Belgique', current_date - interval '30 months', 'Sensible à la qualité du café.', 'Client démo - renouvellement à surveiller.', true),
  ('13000000-0000-0000-0000-000000000003', 'Clinique des Coteaux', 'enterprise', 'risk', 'Rue des Coteaux 8', '4100', 'Seraing', 'Belgique', current_date - interval '12 months', 'Demande SAV récurrente sur snack.', 'Client démo - risque de churn.', true),
  ('13000000-0000-0000-0000-000000000004', 'Bureau Nova Finance', 'sme', 'none', 'Quai de Rome 22', '4000', 'Liège', 'Belgique', current_date - interval '7 months', 'Petit parc mais usage élevé.', 'Client démo.', true)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  flag = excluded.flag,
  address = excluded.address,
  postal_code = excluded.postal_code,
  city = excluded.city,
  country = excluded.country,
  installation_date = excluded.installation_date,
  improvement_notes = excluded.improvement_notes,
  internal_notes = excluded.internal_notes,
  is_active = excluded.is_active;

insert into public.contacts (id, client_id, first_name, last_name, role, email, phone, is_primary)
values
  ('13100000-0000-0000-0000-000000000001', '13000000-0000-0000-0000-000000000001', 'Nadia', 'Lambert', 'manager', 'nadia.lambert@example.test', '+32 470 11 22 33', true),
  ('13100000-0000-0000-0000-000000000002', '13000000-0000-0000-0000-000000000001', 'Olivier', 'Renard', 'technical', 'olivier.renard@example.test', '+32 470 11 22 34', false),
  ('13100000-0000-0000-0000-000000000003', '13000000-0000-0000-0000-000000000002', 'Sarah', 'Dethier', 'billing', 'sarah.dethier@example.test', '+32 470 22 33 44', true),
  ('13100000-0000-0000-0000-000000000004', '13000000-0000-0000-0000-000000000003', 'Karim', 'Mansour', 'manager', 'karim.mansour@example.test', '+32 470 33 44 55', true),
  ('13100000-0000-0000-0000-000000000005', '13000000-0000-0000-0000-000000000004', 'Julie', 'Piron', 'manager', 'julie.piron@example.test', '+32 470 44 55 66', true)
on conflict (id) do update set
  client_id = excluded.client_id,
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  role = excluded.role,
  email = excluded.email,
  phone = excluded.phone,
  is_primary = excluded.is_primary;

insert into public.client_machines (id, client_id, machine_type_id, quantity, installation_date, status, last_filter_change_date, notes)
select '13200000-0000-0000-0000-000000000001', '13000000-0000-0000-0000-000000000001', id, 4, current_date - interval '18 months', 'active', current_date - interval '72 days', 'Hall principal et quai logistique.'
from public.machine_types where code = 'coffee_beans'
on conflict (id) do update set quantity = excluded.quantity, status = excluded.status, last_filter_change_date = excluded.last_filter_change_date, notes = excluded.notes;

insert into public.client_machines (id, client_id, machine_type_id, quantity, installation_date, status, last_filter_change_date, notes)
select '13200000-0000-0000-0000-000000000002', '13000000-0000-0000-0000-000000000001', id, 2, current_date - interval '16 months', 'active', null, 'Zone pause.'
from public.machine_types where code = 'snack_standard'
on conflict (id) do update set quantity = excluded.quantity, status = excluded.status, last_filter_change_date = excluded.last_filter_change_date, notes = excluded.notes;

insert into public.client_machines (id, client_id, machine_type_id, quantity, installation_date, status, last_filter_change_date, notes)
select '13200000-0000-0000-0000-000000000003', '13000000-0000-0000-0000-000000000002', id, 3, current_date - interval '30 months', 'maintenance', current_date - interval '171 days', 'Filtres à contrôler.'
from public.machine_types where code = 'water_fountain_filter'
on conflict (id) do update set quantity = excluded.quantity, status = excluded.status, last_filter_change_date = excluded.last_filter_change_date, notes = excluded.notes;

insert into public.client_machines (id, client_id, machine_type_id, quantity, installation_date, status, last_filter_change_date, notes)
select '13200000-0000-0000-0000-000000000004', '13000000-0000-0000-0000-000000000003', id, 2, current_date - interval '11 months', 'active', current_date - interval '55 days', 'Salle personnel.'
from public.machine_types where code = 'coffee_beans'
on conflict (id) do update set quantity = excluded.quantity, status = excluded.status, last_filter_change_date = excluded.last_filter_change_date, notes = excluded.notes;

insert into public.contracts (id, client_id, title, start_date, end_date, auto_renewal, notes)
values
  ('13300000-0000-0000-0000-000000000001', '13000000-0000-0000-0000-000000000001', 'Contrat vending multi-sites', current_date - interval '18 months', current_date + interval '8 months', true, 'Contrat de démonstration.'),
  ('13300000-0000-0000-0000-000000000002', '13000000-0000-0000-0000-000000000002', 'Contrat fontaines campus', current_date - interval '30 months', current_date + interval '24 days', false, 'Alerte de renouvellement proche.'),
  ('13300000-0000-0000-0000-000000000003', '13000000-0000-0000-0000-000000000003', 'Contrat clinique pause personnel', current_date - interval '12 months', current_date + interval '75 days', true, 'À renégocier avec service achats.')
on conflict (id) do update set
  title = excluded.title,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  auto_renewal = excluded.auto_renewal,
  notes = excluded.notes;

insert into public.client_opportunities (
  id, client_id, prospect_name, prospect_contact_name, prospect_email, prospect_phone, prospect_address, prospect_postal_code,
  prospect_city, prospect_country, title, description, linked_machine_category_id, priority, status, estimated_value, probability,
  yearly_revenue, employee_count, total_machine_count, machine_counts_by_category, incumbent_competitor_name,
  incumbent_competitor_category, competitor_contract_end_date, notes
)
select
  '13400000-0000-0000-0000-000000000001', null, 'TechPark Ans', 'Marine Delcour', 'marine.delcour@example.test',
  '+32 471 10 20 30', 'Rue des Artisans 3', '4430', 'Ans', 'Belgique', 'Implanter café et snack nouveau site',
  'Prospect en ouverture de site. Besoin estimé pour 160 collaborateurs.', id, 'high', 'qualified', 42000, 65,
  9500000, 160, 6, '{"Café": 3, "Snack": 2, "Boissons froides": 1}'::jsonb, 'Selecta', 'hot_drinks',
  current_date + interval '4 months', 'Relancer après validation budget.'
from public.machine_categories where code = 'coffee'
on conflict (id) do update set status = excluded.status, probability = excluded.probability, notes = excluded.notes;

insert into public.client_opportunities (
  id, client_id, prospect_name, prospect_contact_name, prospect_email, prospect_phone, prospect_address, prospect_postal_code,
  prospect_city, prospect_country, title, description, linked_machine_category_id, priority, status, estimated_value, probability,
  yearly_revenue, employee_count, total_machine_count, machine_counts_by_category, incumbent_competitor_name,
  incumbent_competitor_category, competitor_contract_end_date, notes
)
select
  '13400000-0000-0000-0000-000000000002', null, 'Maison Médicale Ourthe', 'Thomas Bovy', 'thomas.bovy@example.test',
  '+32 471 20 30 40', 'Avenue de l''Ourthe 91', '4032', 'Chênée', 'Belgique', 'Remplacement café salle attente',
  'Prospect non client. Machine café actuelle vieillissante.', id, 'medium', 'open', 12000, 35,
  1800000, 38, 2, '{"Café": 1, "Eau": 1}'::jsonb, 'Maas', 'hot_drinks',
  current_date + interval '9 months', 'Décision après test dégustation.'
from public.machine_categories where code = 'coffee'
on conflict (id) do update set status = excluded.status, probability = excluded.probability, notes = excluded.notes;

insert into public.client_opportunities (
  id, client_id, prospect_name, prospect_contact_name, prospect_email, prospect_phone, prospect_address, prospect_postal_code,
  prospect_city, prospect_country, title, description, linked_machine_category_id, priority, status, estimated_value, probability,
  yearly_revenue, employee_count, total_machine_count, machine_counts_by_category, incumbent_competitor_name,
  incumbent_competitor_category, competitor_contract_end_date, notes
)
select
  '13400000-0000-0000-0000-000000000003', null, 'Hôtel Rive Gauche', 'Élodie Gérard', 'elodie.gerard@example.test',
  '+32 471 30 40 50', 'Quai Godefroid Kurth 7', '4020', 'Liège', 'Belgique', 'Corner snack lounge hôtel',
  'Opportunité gagnée à convertir en client.', id, 'high', 'won', 28000, 100,
  6200000, 72, 4, '{"Snack": 2, "Boissons froides": 2}'::jsonb, 'Aucun', 'snacking',
  null, 'Prêt à créer le client depuis la prospection.'
from public.machine_categories where code = 'snack'
on conflict (id) do update set status = excluded.status, probability = excluded.probability, notes = excluded.notes;

insert into public.client_opportunities (
  id, client_id, prospect_name, prospect_contact_name, prospect_email, prospect_phone, prospect_address, prospect_postal_code,
  prospect_city, prospect_country, title, description, linked_machine_category_id, priority, status, estimated_value, probability,
  yearly_revenue, employee_count, total_machine_count, machine_counts_by_category, incumbent_competitor_name,
  incumbent_competitor_category, competitor_contract_end_date, notes
)
select
  '13400000-0000-0000-0000-000000000004', '13000000-0000-0000-0000-000000000001', 'Atelier Meuse Logistics', 'Nadia Lambert',
  'nadia.lambert@example.test', '+32 470 11 22 33', 'Rue de l''Industrie 14', '4040', 'Herstal', 'Belgique',
  'Extension boissons froides quai B', 'Prospection sur client existant.', id, 'medium', 'proposal', 18000, 75,
  12000000, 240, 2, '{"Boissons froides": 2}'::jsonb, null, null, null, 'Proposition envoyée.'
from public.machine_categories where code = 'cold_drinks'
on conflict (id) do update set status = excluded.status, probability = excluded.probability, notes = excluded.notes;

insert into public.client_opportunities (
  id, client_id, prospect_name, prospect_contact_name, prospect_email, prospect_phone, prospect_address, prospect_postal_code,
  prospect_city, prospect_country, title, description, linked_machine_category_id, priority, status, estimated_value, probability,
  yearly_revenue, employee_count, total_machine_count, machine_counts_by_category, incumbent_competitor_name,
  incumbent_competitor_category, competitor_contract_end_date, notes
)
select
  '13400000-0000-0000-0000-000000000005', '13000000-0000-0000-0000-000000000003', 'Clinique des Coteaux', 'Karim Mansour',
  'karim.mansour@example.test', '+32 470 33 44 55', 'Rue des Coteaux 8', '4100', 'Seraing', 'Belgique',
  'Fontaines supplémentaires', 'Opportunité client existant perdue.', id, 'low', 'lost', 9000, 0,
  21000000, 380, 3, '{"Eau": 3}'::jsonb, 'Culligan', 'water_fountain', null, 'Budget reporté.'
from public.machine_categories where code = 'water'
on conflict (id) do update set status = excluded.status, probability = excluded.probability, notes = excluded.notes;

insert into public.notifications (id, client_id, client_machine_id, contract_id, type, title, message, status, due_date, is_resolved)
values
  ('13500000-0000-0000-0000-000000000001', '13000000-0000-0000-0000-000000000002', null, '13300000-0000-0000-0000-000000000002', 'contract_end', 'Contrat campus à renouveler', 'Échéance contractuelle dans moins de 30 jours.', 'open', current_date + interval '24 days', false),
  ('13500000-0000-0000-0000-000000000002', '13000000-0000-0000-0000-000000000001', '13200000-0000-0000-0000-000000000001', null, 'filter_change', 'Filtres café à planifier', 'Le parc café approche de son cycle de filtre.', 'open', current_date + interval '18 days', false),
  ('13500000-0000-0000-0000-000000000003', '13000000-0000-0000-0000-000000000003', '13200000-0000-0000-0000-000000000004', null, 'filter_change', 'Contrôle filtre clinique', 'Intervention préventive à caler avec l''accueil.', 'done', current_date - interval '3 days', true)
on conflict (id) do update set
  title = excluded.title,
  message = excluded.message,
  status = excluded.status,
  due_date = excluded.due_date,
  is_resolved = excluded.is_resolved;
