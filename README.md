# Dial App — Technical Overview & Project Documentation

> This document is intended for both:
> - a **product/business owner** who needs a clear understanding of what exists today,
> - a **developer/technical reviewer** who needs architecture and implementation context.

---

## 1) Project overview

### What the app does
Dial App is a web back-office for managing a beverage/snack machine business (clients, contracts, machines, alerts, and prospecting/opportunities). It centralizes operational and commercial workflows in one internal platform.

### Who it is for
- Internal teams (sales, operations, account management, admins)
- Managers who need visibility on contracts, machine maintenance, and commercial pipeline

### Main business purpose
- Keep structured customer data (including parent/sub-client relationships)
- Track installed machine base and filter maintenance cadence
- Track contract lifecycle and renewal risk
- Track prospecting opportunities (including richer commercial context)
- Provide alerting views for urgent operational/commercial follow-up
- Support bulk onboarding/import of data

---

## 2) Tech stack

### Frontend
- **Next.js 15 (App Router)**
- **React 19**
- Server Components + Client Components mixed by feature needs

### Backend / Data
- **Supabase**
  - PostgreSQL database
  - Supabase Auth
  - Supabase SSR client integration

### Authentication / Authorization
- Supabase email/password login
- Role-based authorization in app (`admin`, `manager`, `viewer`)

### Styling
- **Tailwind CSS** with custom semantic color tokens

### Validation / forms
- **React Hook Form**
- **Zod** for schema validation

### Important libraries
- `@supabase/supabase-js`
- `@supabase/ssr`
- `react-hook-form`
- `@hookform/resolvers`
- `zod`

### Build / scripts
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run typecheck` — TypeScript checks

---

## 3) App architecture

## High-level structure

```text
src/
  app/
    (auth)/              # login + forgot password
    (protected)/         # authenticated app pages
  components/
    layout/              # shell, sidebar, header, page container
    ui/                  # shared primitives (button, card, badge, table...)
  features/
    alerts/
    auth/
    clients/
    contacts/
    contracts/
    imports/
    machines/
    opportunities/
    settings/
    users/
  lib/
    auth/                # guards, role checks, session profile loading
    supabase/            # server/browser client factories
  types/                 # domain-level TS types
supabase/sql/            # schema, triggers, indexes, policies, seed/view scripts
```

## Organization principles
- **By business feature** under `src/features/*`
  - Each feature typically contains `queries.ts`, `actions.ts`, `schemas.ts`, and `components/*`
- **App pages** are thin orchestrators in `src/app/(protected)`
  - parse search params
  - call feature queries
  - pass data to components
- **Data access pattern**
  - reads mostly in `queries.ts` (server-side + cached)
  - writes in `actions.ts` (server actions)

## Data flow pattern (common path)
1. Page loads in server context.
2. Filters parsed from URL params (`search-params.ts` files).
3. Query functions fetch from Supabase.
4. Query layer maps raw rows to domain types (normalization + fallbacks).
5. UI renders table/forms.
6. Mutations run through server actions.
7. `revalidatePath(...)` refreshes relevant pages.

---

## 4) Authentication flow

## Login
- User submits email/password from `/login`.
- `loginAction` uses Supabase `signInWithPassword`.
- On success, client router redirects to `/dashboard` and refreshes.

## Protected pages
- `middleware.ts` checks whether route is protected.
- If user is not authenticated, request is redirected to `/login`.
- Root `/` redirects to `/dashboard` (authenticated) or `/login`.

## Role checks
- `requireAuth()` enforces login + active profile.
- `requireRole(role)` enforces minimum role for sensitive areas.
- Examples:
  - Settings root requires `manager`
  - Users page requires `admin`

## Profile handling
- `getCurrentUserProfile()` loads profile from `public.profiles`.
- If missing, app attempts to upsert a default profile from auth user metadata.

---

## 5) Database overview

The SQL files in `supabase/sql/` define a layered schema:

1. **Extensions** (`01_extensions.sql`)
2. **Reference tables** (`02_reference_tables.sql`) 
3. **Business tables** (`03_business_tables.sql`)
4. **Triggers/functions** (`04_functions_triggers.sql`)
5. **Indexes** (`05_indexes.sql`)
6. **Views** (`06_views.sql`)
7. **Profiles + RLS policies** (`08_profiles.sql`, `09_profiles_policies.sql`)

## Key tables and purpose

### Reference/configuration
- `client_categories` — segmentation taxonomy
- `flag_definitions` — business flags
- `machine_categories` — machine families
- `machine_types` — concrete machine types linked to category
- `notification_rules` — generic alert rule definitions

### Core business
- `clients` — account master data, including parent relationship
- `client_contacts` — people linked to clients
- `client_machines` — installed machines for each client
- `contracts` — contracts and dates
- `client_opportunities` — prospection/commercial opportunities
- `client_flags` — join between clients and flag definitions
- `notifications` — generated/managed alerts

### Auth / user management
- `profiles` — app-level role and active status, linked to `auth.users`

## Important relationships
- `clients` 1→N `client_contacts`
- `clients` 1→N `client_machines`
- `clients` 1→N `contracts`
- `clients` 1→N `client_opportunities`
- `clients` self-reference via `parent_client_id`
- `machine_types` N→1 `machine_categories`
- `profiles.id` = `auth.users.id`

---

## 6) Main modules / pages

## Dashboard
- KPI cards for alerts/contracts/risk clients
- urgent alerts list
- contracts ending soon list
- Designed as an operational cockpit

## Clients
- Table and tree (hierarchical) views
- Filters + machine-based filtering
- Client detail page with tabs:
  - overview
  - contacts
  - machines
  - contracts
  - prospection
  - alerts
  - notes

## Contrats
- List + filters
- Contract status and end-date tracking
- New contract page currently still placeholder for full PDF flow

## Prospection
- Dedicated list page with filters
- New record page (`/opportunities/new`)
- Client detail tab includes creation + editing context
- Supports richer commercial context:
  - estimated value/probability
  - yearly revenue
  - employee count
  - machine counts
  - incumbent competitor details
  - competitor contract end date
  - notes

## Alertes
- Split presentation by urgency/status:
  - urgent
  - upcoming
  - treated
- Filter panel (client, due bucket, type, etc.)

## Imports
- Guided workflow:
  1. Upload
  2. Column mapping
  3. Preview
  4. Validation
  5. Final import
- Supports mixed import modes (clients/contacts/machines/contracts)

## Paramètres
- Settings index page with links to taxonomy/config modules
- Access restricted to manager+
- Some settings sub-pages are still placeholders

## Utilisateurs / Compte
- Users page for invite + role/status management (admin only)
- Account page for current user profile and logout

---

## 7) Current UI behavior

## Empty-state handling
The app consistently guards against empty or failed queries and renders explicit empty/fallback states (e.g., “Aucune …”).

## Navigation
- Persistent sidebar on desktop
- Slide-in sidebar on mobile
- Header shows user identity + logout

## Responsive behavior
- Tailwind breakpoints are used extensively (`sm`, `md`, `lg`, `xl`)
- Most major pages are mobile-friendly with stacked layouts and scrollable tables where needed

---

## 8) Important implementation notes

## Pattern consistency
- Most features follow a predictable pattern:
  - `schemas.ts` (Zod validation)
  - `queries.ts` (read model mapping/filtering)
  - `actions.ts` (server mutations)
  - `components/*` (forms/tables)

## Server/client split
- Data-heavy page composition is server-rendered.
- Interactions/forms/tables with state are client components.

## Defensive mapping
- Query layers often normalize values and map unknown codes to safe defaults.
- Several modules include fallbacks to avoid crashes on empty or partially configured DB states.

## Cache + invalidation
- Reads use `cache(...)` wrapper.
- Writes trigger `revalidatePath(...)` for coherence across list/detail/dashboard screens.

---

## 9) Known issues / technical debt

This section highlights important technical realities visible in the current codebase.

1. **Schema drift risk between SQL scripts and app expectations**
   - Some frontend/backend queries reference columns/tables that are richer than the baseline SQL scripts in `supabase/sql/03_business_tables.sql`.
   - Example areas: imports and certain field names in clients/contracts/alerts.
   - Recommendation: maintain a canonical migration chain aligned with actual production schema.

2. **Placeholder areas still present**
   - Contract creation with private PDF flow (`/contracts/new`) is not fully implemented.
   - Several settings pages are placeholders.
   - Some actions (e.g., password change in account) marked as “bientôt”.

3. **Auth action contains debug logging**
   - `loginAction` currently logs cookies/session details, which is useful for debugging but not ideal for production verbosity/security posture.

4. **Lint setup can block CI/onboarding if not finalized**
   - Repository currently relies on `next lint`; migration to dedicated ESLint CLI may still be pending.

5. **Cross-feature coupling through direct table assumptions**
   - Imports and feature modules assume specific DB fields and naming conventions; changes in schema can have broad impact.

---

## 10) Suggested next steps

## High-priority technical steps
1. **Stabilize database contract**
   - Reconcile SQL scripts with actual application queries/actions.
   - Add explicit migration files for every schema evolution.

2. **Finalize placeholders**
   - Complete contract creation + secure PDF workflow.
   - Complete settings sub-pages and ensure role-gated administration is fully functional.

3. **Harden auth/login path**
   - Remove or reduce sensitive debug logs in production.

4. **Strengthen automated quality checks**
   - Finalize ESLint config.
   - Add targeted integration tests for critical flows (auth, clients, contracts, opportunities).

## Product/business natural next steps
1. **Prospection progression logic**
   - Add richer reporting and pipeline views (conversion funnel, expected revenue).
2. **Alert automation maturity**
   - Add smarter SLA/escalation workflows.
3. **Data governance**
   - Introduce audit logs and stricter consistency checks for critical entities.
4. **Exports & reporting**
   - Implement filtered exports and dashboard drill-downs.

---

## Quick start (developer)

1. Copy env vars:

```bash
cp .env.example .env.local
```

2. Fill Supabase values:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Install and run:

```bash
npm install
npm run dev
```

4. Open:
- `http://localhost:3000`

---

## Notes for presentation to a technical reviewer

If you need to present this project quickly:
- position Dial App as a **modular Next.js + Supabase internal operations platform**,
- highlight the **feature-based architecture** and **server-action pattern**,
- explain current strengths (functional coverage + defensive UI/data mapping),
- and transparently call out current technical debt (schema alignment, placeholders, and lint/auth cleanup).
