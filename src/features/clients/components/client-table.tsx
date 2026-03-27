import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { StatePanel } from '@/components/ui/state-panel';
import { TableShell } from '@/components/ui/table-shell';
import { clientCategoryLabels, clientFlagLabels } from '@/features/clients/helpers';
import type { Client } from '@/types/client';

export function ClientTable({ clients }: { clients: Client[] }) {
  if (clients.length === 0) {
    return <StatePanel message="Aucun client trouvé avec ces filtres." variant="empty" />;
  }

  return (
    <TableShell>
      <table className="min-w-[760px] border-collapse text-sm md:min-w-full">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-600">
            <th className="whitespace-nowrap px-3 py-2">Client</th>
            <th className="whitespace-nowrap px-3 py-2">Ville</th>
            <th className="whitespace-nowrap px-3 py-2">Catégorie</th>
            <th className="whitespace-nowrap px-3 py-2">Flag</th>
            <th className="whitespace-nowrap px-3 py-2">Contrat</th>
            <th className="whitespace-nowrap px-3 py-2">Opportunités</th>
            <th className="whitespace-nowrap px-3 py-2">Alertes</th>
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
              <td className="whitespace-nowrap px-3 py-2 text-slate-700">{client.city}</td>
              <td className="whitespace-nowrap px-3 py-2 text-slate-700">{clientCategoryLabels[client.category]}</td>
              <td className="whitespace-nowrap px-3 py-2">
                <Badge label={clientFlagLabels[client.flag]} tone={client.flag === 'risk' ? 'danger' : client.flag === 'watch' ? 'warning' : client.flag === 'vip' ? 'success' : 'neutral'} />
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-slate-700">{client.hasContract ? 'Oui' : 'Non'}</td>
              <td className="whitespace-nowrap px-3 py-2 text-slate-700">{client.openOpportunities}</td>
              <td className="whitespace-nowrap px-3 py-2 text-slate-700">{client.openAlerts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}
