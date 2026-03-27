'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { clientCategoryLabels, clientFlagLabels } from '@/features/clients/helpers';
import type { ClientCategoryCode, ClientFlagCode } from '@/types/client';
import type { ContractFilterInput } from '@/types/contract';

export function ContractFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParam = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    router.push(`/contracts?${params.toString()}`);
  };

  const setBoolean = (name: string, checked: boolean) => setParam(name, checked ? '1' : '');

  return (
    <div className="space-y-4 rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 md:grid-cols-4">
        <select className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue={searchParams.get('endingInDays') ?? ''} onChange={(event) => setParam('endingInDays', event.target.value)}>
          <option value="">Toutes échéances</option>
          <option value="30">Fin dans 30 jours</option>
          <option value="90">Fin dans 90 jours</option>
          <option value="180">Fin dans 180 jours</option>
        </select>

        <select className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue={searchParams.get('hasPdf') ?? ''} onChange={(event) => setParam('hasPdf', event.target.value)}>
          <option value="">PDF: tous</option>
          <option value="1">Avec PDF</option>
          <option value="0">Sans PDF</option>
        </select>

        <select className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue={searchParams.get('category') ?? ''} onChange={(event) => setParam('category', event.target.value)}>
          <option value="">Toutes catégories client</option>
          {Object.entries(clientCategoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue={searchParams.get('flag') ?? ''} onChange={(event) => setParam('flag', event.target.value)}>
          <option value="">Tous flags client</option>
          {Object.entries(clientFlagLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <input placeholder="Code postal" className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue={searchParams.get('postalCode') ?? ''} onBlur={(event) => setParam('postalCode', event.target.value)} />

        <input placeholder="Ville" className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue={searchParams.get('city') ?? ''} onBlur={(event) => setParam('city', event.target.value)} />

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" defaultChecked={searchParams.get('autoRenewal') === '1'} onChange={(event) => setBoolean('autoRenewal', event.target.checked)} />
          Auto-renouvellement
        </label>

        <button className="w-full rounded border border-slate-300 px-3 py-2 text-sm sm:w-auto" onClick={() => router.push('/contracts')}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
}

export function getContractFiltersFromSearchParams(searchParams: Record<string, string | string[] | undefined>): ContractFilterInput {
  const asString = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const toBoolean = (value: string | undefined) => (value === undefined ? undefined : value === '1');

  const endingParam = asString(searchParams.endingInDays);
  const endingInDays = endingParam ? (Number(endingParam) as 30 | 90 | 180) : undefined;
  const category = asString(searchParams.category);
  const flag = asString(searchParams.flag);

  return {
    endingInDays: endingInDays === 30 || endingInDays === 90 || endingInDays === 180 ? endingInDays : undefined,
    hasPdf: toBoolean(asString(searchParams.hasPdf)),
    autoRenewal: toBoolean(asString(searchParams.autoRenewal)),
    postalCode: asString(searchParams.postalCode),
    city: asString(searchParams.city),
    categories: category ? [category as ClientCategoryCode] : undefined,
    flags: flag ? [flag as ClientFlagCode] : undefined
  };
}
