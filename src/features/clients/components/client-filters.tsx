'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { clientCategoryLabels, clientFlagLabels } from '@/features/clients/helpers';
import { MachineFiltersPanel } from '@/features/machines/components/machine-filters-panel';
import type { MachineCategory, MachineType } from '@/types/machine';

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
          Prospections ouvertes
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

      <div className="flex justify-stretch sm:justify-end">
        <button className="w-full rounded border border-slate-300 px-3 py-2 text-sm sm:w-auto" onClick={resetFilters}>
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
}
