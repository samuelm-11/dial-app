import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { StatePanel } from '@/components/ui/state-panel';
import { Table } from '@/components/ui/table';
import { TableShell } from '@/components/ui/table-shell';
import { clientCategoryLabels, clientFlagLabels } from '@/features/clients/helpers';
import type { Client } from '@/types/client';

export function ClientTable({ clients }: { clients: Client[] }) {
  if (clients.length === 0) {
    return <StatePanel message="Aucun client trouvé avec ces filtres." variant="empty" />;
  }

  return (
    <TableShell>
      <Table className="text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left">
            <th className="whitespace-nowrap px-4 py-3">Client</th>
            <th className="whitespace-nowrap px-4 py-3">Ville</th>
            <th className="whitespace-nowrap px-4 py-3">Catégorie</th>
            <th className="whitespace-nowrap px-4 py-3">Flag</th>
            <th className="whitespace-nowrap px-4 py-3">Contrat</th>
            <th className="whitespace-nowrap px-4 py-3">Opportunités</th>
            <th className="whitespace-nowrap px-4 py-3">Alertes</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50/70">
              <td className="px-4 py-3 font-medium text-primary">
                <Link href={`/clients/${client.id}`} className="hover:underline">
                  {client.name}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3">{client.city}</td>
              <td className="whitespace-nowrap px-4 py-3">{clientCategoryLabels[client.category]}</td>
              <td className="whitespace-nowrap px-4 py-3">
                <Badge
                  label={clientFlagLabels[client.flag]}
                  tone={client.flag === 'risk' ? 'danger' : client.flag === 'watch' ? 'warning' : client.flag === 'vip' ? 'success' : 'neutral'}
                />
              </td>
              <td className="whitespace-nowrap px-4 py-3">{client.hasContract ? 'Oui' : 'Non'}</td>
              <td className="whitespace-nowrap px-4 py-3">{client.openOpportunities}</td>
              <td className="whitespace-nowrap px-4 py-3">{client.openAlerts}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableShell>
  );
}
