import Link from 'next/link';
import { clientCategoryLabels, clientFlagBadgeClass, clientFlagLabels } from '@/features/clients/helpers';
import type { ClientWithRelations } from '@/types/client';

export function ClientHeader({ client }: { client: ClientWithRelations }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{client.name}</h2>
        <p className="text-sm text-slate-600">
          {client.address}, {client.postalCode} {client.city}, {client.country}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">{clientCategoryLabels[client.category]}</span>
        <span className={`rounded px-2 py-1 text-xs ${clientFlagBadgeClass[client.flag]}`}>{clientFlagLabels[client.flag]}</span>
        <Link href={`/clients/${client.id}/edit`} className="rounded bg-slate-900 px-3 py-2 text-xs text-white">
          Modifier
        </Link>
      </div>
    </div>
  );
}
