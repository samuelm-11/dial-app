'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { clientFlagLabels } from '@/features/clients/helpers';
import { opportunityPriorityValues, opportunityStatusValues } from '@/features/opportunities/schemas';
import type { ClientFlagCode } from '@/types/client';
import type { OpportunityPriority, OpportunityStatus } from '@/types/opportunity';

const priorityLabels: Record<OpportunityPriority, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute'
};

const statusLabels: Record<OpportunityStatus, string> = {
  open: 'Ouverte',
  qualified: 'Qualifiée',
  proposal: 'Proposition',
  won: 'Gagnée',
  lost: 'Perdue'
};

export function OpportunityFilters({
  clients,
  machineCategories
}: {
  clients: Array<{ id: string; name: string }>;
  machineCategories: Array<{ id: string; label: string }>;
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
    router.push(`/opportunities?${params.toString()}`);
  };

  return (
    <div className="space-y-4 rounded border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 md:grid-cols-4">
        <select className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue={searchParams.get('status') ?? ''} onChange={(event) => setParam('status', event.target.value)}>
          <option value="">Tous statuts</option>
          {opportunityStatusValues.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>

        <select className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue={searchParams.get('priority') ?? ''} onChange={(event) => setParam('priority', event.target.value)}>
          <option value="">Toutes priorités</option>
          {opportunityPriorityValues.map((priority) => (
            <option key={priority} value={priority}>
              {priorityLabels[priority]}
            </option>
          ))}
        </select>

        <select className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue={searchParams.get('machineCategoryId') ?? ''} onChange={(event) => setParam('machineCategoryId', event.target.value)}>
          <option value="">Toutes catégories liées</option>
          {machineCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>

        <select className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue={searchParams.get('clientId') ?? ''} onChange={(event) => setParam('clientId', event.target.value)}>
          <option value="">Tous clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Code postal" defaultValue={searchParams.get('postalCode') ?? ''} onBlur={(event) => setParam('postalCode', event.target.value)} />

        <select className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue={searchParams.get('flag') ?? ''} onChange={(event) => setParam('flag', event.target.value)}>
          <option value="">Tous flags client</option>
          {(Object.keys(clientFlagLabels) as ClientFlagCode[]).map((flag) => (
            <option key={flag} value={flag}>
              {clientFlagLabels[flag]}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={0}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="Valeur min (€)"
          defaultValue={searchParams.get('valueMin') ?? ''}
          onBlur={(event) => setParam('valueMin', event.target.value)}
        />

        <input
          type="number"
          min={0}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="Valeur max (€)"
          defaultValue={searchParams.get('valueMax') ?? ''}
          onBlur={(event) => setParam('valueMax', event.target.value)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <input
          type="number"
          min={0}
          max={100}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="Probabilité min (%)"
          defaultValue={searchParams.get('probabilityMin') ?? ''}
          onBlur={(event) => setParam('probabilityMin', event.target.value)}
        />

        <input
          type="number"
          min={0}
          max={100}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="Probabilité max (%)"
          defaultValue={searchParams.get('probabilityMax') ?? ''}
          onBlur={(event) => setParam('probabilityMax', event.target.value)}
        />

        <button className="w-full rounded border border-slate-300 px-3 py-2 text-sm sm:w-auto" onClick={() => router.push('/opportunities')}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
