'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { alertStatusLabelMap } from '@/features/alerts/components/alert-status-badge';
import { alertDueBucketValues, alertStatusValues, alertTypeValues } from '@/features/alerts/schemas';
import type { AlertDueBucket, AlertType } from '@/types/alert';

const typeLabelMap: Record<AlertType, string> = {
  contract_end: 'Contrat',
  filter_change: 'Filtre machine'
};

const dueBucketLabelMap: Record<AlertDueBucket, string> = {
  urgent: 'Urgent (<= 7j)',
  upcoming: 'À venir (<= 30j)',
  later: 'Plus tard'
};

export function AlertFilters({ clients }: { clients: Array<{ id: string; name: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParam = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    router.push(`/alerts?${params.toString()}`);
  };

  return (
    <div className="space-y-3 rounded border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <select className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue={searchParams.get('type') ?? ''} onChange={(event) => setParam('type', event.target.value)}>
          <option value="">Tous types</option>
          {alertTypeValues.map((type) => (
            <option key={type} value={type}>
              {typeLabelMap[type]}
            </option>
          ))}
        </select>

        <select className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue={searchParams.get('status') ?? ''} onChange={(event) => setParam('status', event.target.value)}>
          <option value="">Tous statuts</option>
          {alertStatusValues.map((status) => (
            <option key={status} value={status}>
              {alertStatusLabelMap[status]}
            </option>
          ))}
        </select>

        <select className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue={searchParams.get('dueBucket') ?? ''} onChange={(event) => setParam('dueBucket', event.target.value)}>
          <option value="">Toutes échéances</option>
          {alertDueBucketValues.map((bucket) => (
            <option key={bucket} value={bucket}>
              {dueBucketLabelMap[bucket]}
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

        <input
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          defaultValue={searchParams.get('postalCode') ?? ''}
          placeholder="Code postal"
          onBlur={(event) => setParam('postalCode', event.target.value)}
        />

        <input
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          defaultValue={searchParams.get('machineType') ?? ''}
          placeholder="Type machine"
          onBlur={(event) => setParam('machineType', event.target.value)}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <select className="rounded border border-slate-300 px-3 py-2 text-sm" defaultValue={searchParams.get('dueWithinDays') ?? ''} onChange={(event) => setParam('dueWithinDays', event.target.value)}>
          <option value="">Échéance: toutes</option>
          <option value="7">Dans 7 jours</option>
          <option value="30">Dans 30 jours</option>
          <option value="90">Dans 90 jours</option>
        </select>

        <button className="w-full rounded border border-slate-300 px-3 py-2 text-sm sm:w-auto" onClick={() => router.push('/alerts')}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
