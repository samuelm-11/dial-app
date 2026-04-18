# Module Interventions (v1)

## 1) Objectif du module

Le module **Interventions** ajoute un espace opérationnel pour les techniciens terrain (dépannage / maintenance / contrôle).

Cette première version permet de :
- enregistrer une intervention liée à un client,
- lier optionnellement une machine client,
- attribuer un technicien (profil utilisateur) ou un nom libre,
- conserver le diagnostic, l’action réalisée, des commentaires,
- stocker une référence de photo/justificatif,
- conserver un historique exploitable pour l’analyse des pannes récurrentes.

Le module est volontairement simple mais préparé pour une montée en charge (assignation directe via l’app, workflow, reporting).

---

## 2) SQL à exécuter manuellement dans Supabase

> Copiez/collez les blocs ci-dessous dans l’éditeur SQL Supabase.

### 2.1 Création de la table principale `interventions`

```sql
-- Active gen_random_uuid() si nécessaire
create extension if not exists pgcrypto;

create table if not exists public.interventions (
  id uuid primary key default gen_random_uuid(),

  -- Lien métier principal
  client_id uuid not null references public.clients(id) on delete cascade,
  machine_id uuid null references public.client_machines(id) on delete set null,

  -- Attribution technicien (optionnel : profil applicatif)
  technician_user_id uuid null references public.profiles(id) on delete set null,
  technician_name text null,

  -- Datation opérationnelle
  intervention_date date not null,
  start_time time null,
  end_time time null,

  -- Classification
  intervention_type text not null check (intervention_type in ('depannage', 'maintenance', 'controle', 'installation', 'autre')),
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'done', 'cancelled')),

  -- Contenu intervention
  title text not null,
  description text not null,
  diagnosis text null,
  action_taken text null,
  photo_path text null,
  notes text null,

  -- Audit
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

**But du bloc :** créer la structure métier centrale pour la saisie et l’historique des interventions.

---

### 2.2 Index de performance pour listing et analyses

```sql
create index if not exists idx_interventions_client_id
  on public.interventions(client_id);

create index if not exists idx_interventions_machine_id
  on public.interventions(machine_id);

create index if not exists idx_interventions_technician_user_id
  on public.interventions(technician_user_id);

create index if not exists idx_interventions_intervention_date
  on public.interventions(intervention_date desc);

create index if not exists idx_interventions_status
  on public.interventions(status);

create index if not exists idx_interventions_intervention_type
  on public.interventions(intervention_type);
```

**But du bloc :** accélérer l’historique, les filtres par client/machine/technicien, et les futures analyses de récurrence.

---

### 2.3 Trigger automatique pour `updated_at`

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_interventions_updated_at on public.interventions;

create trigger trg_interventions_updated_at
before update on public.interventions
for each row
execute function public.set_updated_at();
```

**But du bloc :** maintenir automatiquement la date de dernière modification.

---

### 2.4 (Optionnel) RLS minimal si votre projet active RLS

```sql
alter table public.interventions enable row level security;

-- Lecture: utilisateurs authentifiés
create policy if not exists "interventions_select_authenticated"
  on public.interventions
  for select
  to authenticated
  using (true);

-- Insertion: utilisateurs authentifiés
create policy if not exists "interventions_insert_authenticated"
  on public.interventions
  for insert
  to authenticated
  with check (true);

-- Update: utilisateurs authentifiés
create policy if not exists "interventions_update_authenticated"
  on public.interventions
  for update
  to authenticated
  using (true)
  with check (true);
```

**But du bloc :** garantir un démarrage simple en environnement authentifié. À durcir plus tard selon rôles (admin, technicien, commercial, etc.).

---

## 3) Rôle des champs de la table

- `client_id` : client concerné par l’intervention (obligatoire).
- `machine_id` : machine concernée, si l’intervention vise un équipement précis.
- `technician_user_id` : technicien connu dans `profiles`.
- `technician_name` : nom libre pour les cas hors annuaire / prestataire externe.
- `intervention_date` : date de passage terrain.
- `start_time`, `end_time` : plage horaire si suivie.
- `intervention_type` : classification métier de l’intervention.
- `status` : statut opérationnel (`planned`, `in_progress`, `done`, `cancelled`).
- `title` : résumé court (visible en liste).
- `description` : détails complets de l’intervention.
- `diagnosis` : cause diagnostiquée.
- `action_taken` : action corrective réalisée.
- `photo_path` : chemin de photo / référence d’attachement (ex: Storage path Supabase).
- `notes` : commentaires libres (retour client, consignes, etc.).
- `created_at`, `updated_at` : audit standard.

---

## 4) Intégration avec les modules existants

Le module **Interventions** s’insère naturellement avec :
- **Clients** via `client_id`,
- **Machines client** via `machine_id`,
- **Utilisateurs / profils** via `technician_user_id`.

Il devient ainsi un journal d’exploitation terrain complémentaire aux contrats, alertes et prospection.

---

## 5) Prochaines améliorations suggérées

1. **Assignation native** : créer des interventions planifiées depuis l’app et assigner à un technicien.
2. **Workflow** : transitions de statut contrôlées (`planned -> in_progress -> done`).
3. **Pièces jointes réelles** : upload photo dans Supabase Storage + URL signée.
4. **Analyse pannes récurrentes** : tableaux de bord par machine/type/client/diagnostic.
5. **SLA & délais** : mesurer temps d’intervention, temps de résolution, taux de récurrence.
6. **Permissions fines** : RLS selon rôle (lecture globale admin, lecture restreinte technicien, etc.).
