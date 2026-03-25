import Link from 'next/link';
import { clientCategoryLabels, clientFlagBadgeClass, clientFlagLabels } from '@/features/clients/helpers';
import type { Client } from '@/types/client';

export function ClientTable({ clients }: { clients: Client[] }) {
  if (clients.length === 0) {
    return <p className="rounded border border-dashed p-6 text-sm text-slate-500">Aucun client trouvé avec ces filtres.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-600">
            <th className="px-3 py-2">Client</th>
            <th className="px-3 py-2">Ville</th>
            <th className="px-3 py-2">Catégorie</th>
            <th className="px-3 py-2">Flag</th>
            <th className="px-3 py-2">Contrat</th>
            <th className="px-3 py-2">Opportunités</th>
            <th className="px-3 py-2">Alertes</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-slate-100">
              <td className="px-3 py-2 font-medium text-slate-900">
                <Link href={`/clients/${client.id}`} className="hover:underline">
                  {client.name}
                </Link>
              </td>
              <td className="px-3 py-2 text-slate-700">{client.city}</td>
              <td className="px-3 py-2 text-slate-700">{clientCategoryLabels[client.category]}</td>
              <td className="px-3 py-2">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${clientFlagBadgeClass[client.flag]}`}>
                  {clientFlagLabels[client.flag]}
                </span>
              </td>
              <td className="px-3 py-2 text-slate-700">{client.hasContract ? 'Oui' : 'Non'}</td>
              <td className="px-3 py-2 text-slate-700">{client.openOpportunities}</td>
              <td className="px-3 py-2 text-slate-700">{client.openAlerts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
