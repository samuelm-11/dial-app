'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { MachineCategory, MachineType } from '@/types/machine';

export function MachineFiltersPanel({ categories, types }: { categories: MachineCategory[]; types: MachineType[] }) {
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

  const setBoolean = (name: string, checked: boolean) => setParam(name, checked ? '1' : '');

  return (
    <div className="grid gap-3 rounded border border-slate-200 bg-white p-3 md:grid-cols-3">
      <select
        className="rounded border border-slate-300 px-3 py-2 text-sm"
        defaultValue={searchParams.get('machineCategoryId') ?? ''}
        onChange={(event) => setParam('machineCategoryId', event.target.value)}
      >
        <option value="">Toutes catégories machine</option>
        {categories.filter((item) => item.isActive).map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </select>

      <select
        className="rounded border border-slate-300 px-3 py-2 text-sm"
        defaultValue={searchParams.get('machineTypeId') ?? ''}
        onChange={(event) => setParam('machineTypeId', event.target.value)}
      >
        <option value="">Tous types machine</option>
        {types.filter((item) => item.isActive).map((type) => (
          <option key={type.id} value={type.id}>
            {type.label}
          </option>
        ))}
      </select>

      <div className="grid gap-2 text-sm md:grid-cols-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            defaultChecked={searchParams.get('hasHotDrinks') === '1'}
            onChange={(event) => setBoolean('hasHotDrinks', event.target.checked)}
          />
          Boisson chaude
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked={searchParams.get('hasCandy') === '1'} onChange={(event) => setBoolean('hasCandy', event.target.checked)} />
          Confiserie
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            defaultChecked={searchParams.get('withoutWaterFountain') === '1'}
            onChange={(event) => setBoolean('withoutWaterFountain', event.target.checked)}
          />
          Sans fontaine à eau
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            defaultChecked={searchParams.get('withFiltersDueSoon') === '1'}
            onChange={(event) => setBoolean('withFiltersDueSoon', event.target.checked)}
          />
          Filtre à changer bientôt
        </label>
      </div>
    </div>
  );
}
