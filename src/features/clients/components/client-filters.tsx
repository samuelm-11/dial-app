'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { clientCategoryLabels, clientFlagLabels } from '@/features/clients/helpers';
import { MachineFiltersPanel } from '@/features/machines/components/machine-filters-panel';
import type { MachineCategory, MachineType } from '@/types/machine';
import type { ClientCategoryCode, ClientFlagCode } from '@/types/client';

export function ClientFilters({
  machineCategories,
  machineTypes
}: {
  machineCategories: MachineCategory[];
  machineTypes: MachineType[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParam = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    router.push(`/clients?${params.toString()}`);
  };

  const setBoolean = (name: string, checked: boolean) => {
    setParam(name, checked ? '1' : '');
  };

  const resetFilters = () => router.push('/clients');

  return (
    <div className="space-y-4 rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 md:grid-cols-3">
        <input
          placeholder="Nom client"
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          defaultValue={searchParams.get('name') ?? ''}
          onBlur={(event) => setParam('name', event.target.value)}
        />
        <input
          placeholder="Code postal"
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          defaultValue={searchParams.get('postalCode') ?? ''}
          onBlur={(event) => setParam('postalCode', event.target.value)}
        />
        <input
          placeholder="Ville"
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          defaultValue={searchParams.get('city') ?? ''}
          onBlur={(event) => setParam('city', event.target.value)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <select
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          defaultValue={searchParams.get('category') ?? ''}
          onChange={(event) => setParam('category', event.target.value)}
        >
          <option value="">Toutes catégories</option>
          {Object.entries(clientCategoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          defaultValue={searchParams.get('flag') ?? ''}
          onChange={(event) => setParam('flag', event.target.value)}
        >
          <option value="">Tous flags</option>
          {Object.entries(clientFlagLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            defaultChecked={searchParams.get('onlyParents') === '1'}
            onChange={(event) => setBoolean('onlyParents', event.target.checked)}
          />
          Parents uniquement
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            defaultChecked={searchParams.get('onlySubClients') === '1'}
            onChange={(event) => setBoolean('onlySubClients', event.target.checked)}
          />
          Sous-clients uniquement
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            defaultChecked={searchParams.get('hasParent') === '1'}
            onChange={(event) => setBoolean('hasParent', event.target.checked)}
          />
          A un parent
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            defaultChecked={searchParams.get('hasContract') === '1'}
            onChange={(event) => setBoolean('hasContract', event.target.checked)}
          />
          Contrat actif
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            defaultChecked={searchParams.get('hasOpenOpportunities') === '1'}
            onChange={(event) => setBoolean('hasOpenOpportunities', event.target.checked)}
          />
          Opportunités ouvertes
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            defaultChecked={searchParams.get('hasOpenAlerts') === '1'}
            onChange={(event) => setBoolean('hasOpenAlerts', event.target.checked)}
          />
          Alertes ouvertes
        </label>
      </div>

      <MachineFiltersPanel categories={machineCategories} types={machineTypes} />

      <div className="flex justify-end">
        <button className="rounded border border-slate-300 px-3 py-2 text-sm" onClick={resetFilters}>
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
}

export function getFiltersFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): {
  name?: string;
  postalCode?: string;
  city?: string;
  categories?: ClientCategoryCode[];
  flags?: ClientFlagCode[];
  onlyParents?: boolean;
  onlySubClients?: boolean;
  hasParent?: boolean;
  hasContract?: boolean;
  hasOpenOpportunities?: boolean;
  hasOpenAlerts?: boolean;
  machineFilters?: {
    machineCategoryIds?: string[];
    machineTypeIds?: string[];
    hasHotDrinks?: boolean;
    hasCandy?: boolean;
    withoutWaterFountain?: boolean;
    withFiltersDueSoon?: boolean;
  };
} {
  const asString = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

  const category = asString(searchParams.category);
  const flag = asString(searchParams.flag);

  const toBoolean = (value: string | undefined) => (value === undefined ? undefined : value === '1');

  const machineCategoryId = asString(searchParams.machineCategoryId);
  const machineTypeId = asString(searchParams.machineTypeId);

  return {
    name: asString(searchParams.name),
    postalCode: asString(searchParams.postalCode),
    city: asString(searchParams.city),
    categories: category ? [category as ClientCategoryCode] : undefined,
    flags: flag ? [flag as ClientFlagCode] : undefined,
    onlyParents: toBoolean(asString(searchParams.onlyParents)),
    onlySubClients: toBoolean(asString(searchParams.onlySubClients)),
    hasParent: toBoolean(asString(searchParams.hasParent)),
    hasContract: toBoolean(asString(searchParams.hasContract)),
    hasOpenOpportunities: toBoolean(asString(searchParams.hasOpenOpportunities)),
    hasOpenAlerts: toBoolean(asString(searchParams.hasOpenAlerts)),
    machineFilters: {
      machineCategoryIds: machineCategoryId ? [machineCategoryId] : undefined,
      machineTypeIds: machineTypeId ? [machineTypeId] : undefined,
      hasHotDrinks: toBoolean(asString(searchParams.hasHotDrinks)),
      hasCandy: toBoolean(asString(searchParams.hasCandy)),
      withoutWaterFountain: toBoolean(asString(searchParams.withoutWaterFountain)),
      withFiltersDueSoon: toBoolean(asString(searchParams.withFiltersDueSoon))
    }
  };
}
