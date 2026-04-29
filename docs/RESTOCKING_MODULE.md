# Module Réassort / Tournées

## 1) Objectif du module
Le module **Réassort** permet d'organiser et suivre les tournées de réapprovisionnement des machines (boissons, snacks, sandwiches, eaux).

Le module couvre deux besoins principaux :
- **Vue employé** : afficher uniquement la tournée assignée, l'ordre des arrêts, les machines et catégories à réassortir.
- **Vue manager** : superviser toutes les tournées, filtrer par employé/statut, suivre la progression et préparer l'affichage cartographique.

## 2) Structure de base de données proposée
Tables proposées :
- `restocking_rounds`
- `restocking_stops`
- `restocking_stop_machines`
- `restocking_items`

Ces tables sont compatibles avec un modèle Supabase PostgreSQL classique :
- clés primaires en UUID
- timestamps `created_at` / `updated_at`
- contraintes de statut sécurisées
- liens FK vers `clients` et `client_machines` quand disponibles

## 3) SQL à copier/coller dans Supabase
```sql
-- Extensions UUID (si déjà activée, cette commande est sans effet)
create extension if not exists "pgcrypto";

create table if not exists public.restocking_rounds (
  id uuid primary key default gen_random_uuid(),
  round_date date not null default current_date,
  assigned_employee_id uuid null,
  assigned_employee_name text not null,
  status text not null default 'a_faire'
    check (status in ('a_faire', 'en_cours', 'termine')),
  notes text null,
  started_at timestamptz null,
  completed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restocking_stops (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.restocking_rounds(id) on delete cascade,
  stop_order integer not null,
  client_id uuid null references public.clients(id) on delete set null,
  client_name_snapshot text not null,
  site_name text null,
  address text null,
  status text not null default 'a_faire'
    check (status in ('a_faire', 'en_cours', 'termine')),
  notes text null,
  photo_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (round_id, stop_order)
);

create table if not exists public.restocking_stop_machines (
  id uuid primary key default gen_random_uuid(),
  stop_id uuid not null references public.restocking_stops(id) on delete cascade,
  client_machine_id uuid null references public.client_machines(id) on delete set null,
  machine_name_snapshot text not null,
  machine_code text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restocking_items (
  id uuid primary key default gen_random_uuid(),
  stop_id uuid not null references public.restocking_stops(id) on delete cascade,
  product_name text null,
  category text not null,
  quantity_expected integer null check (quantity_expected is null or quantity_expected >= 0),
  quantity_loaded integer null check (quantity_loaded is null or quantity_loaded >= 0),
  status text not null default 'a_faire'
    check (status in ('a_faire', 'en_cours', 'termine')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger fonction générique updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Triggers updated_at

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_restocking_rounds_updated_at') then
    create trigger trg_restocking_rounds_updated_at
      before update on public.restocking_rounds
      for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_restocking_stops_updated_at') then
    create trigger trg_restocking_stops_updated_at
      before update on public.restocking_stops
      for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_restocking_stop_machines_updated_at') then
    create trigger trg_restocking_stop_machines_updated_at
      before update on public.restocking_stop_machines
      for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_restocking_items_updated_at') then
    create trigger trg_restocking_items_updated_at
      before update on public.restocking_items
      for each row execute function public.set_updated_at();
  end if;
end $$;
```

## 4) Explication des tables
- **`restocking_rounds`** : entête d'une tournée (date, employé assigné, statut global, timestamps de début/fin).
- **`restocking_stops`** : arrêts d'une tournée, ordonnés (`stop_order`), avec client/site/adresse/statut.
- **`restocking_stop_machines`** : machines concernées par arrêt, avec FK optionnelle vers `client_machines`.
- **`restocking_items`** : produits/catégories à réassortir, quantités prévues/chargées, statut par item.

## 5) Améliorations futures
- Intégration carte (Google Maps ou Mapbox) + affichage des arrêts.
- Géolocalisation employé en temps réel et ETA.
- Optimisation de tournée automatique selon trafic/priorité.
- Historique complet des réassorts par machine.
- Analytics : machines souvent en rupture et recommandations de fréquence/quantité.
