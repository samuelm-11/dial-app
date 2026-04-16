import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { StatePanel } from '@/components/ui/state-panel';
import { Table } from '@/components/ui/table';
import { TableShell } from '@/components/ui/table-shell';
import { clientCategoryLabels, clientFlagLabels } from '@/features/clients/helpers';
import type { Contract } from '@/types/contract';

export function ContractTable({ contracts }: { contracts: Contract[] }) {
  if (contracts.length === 0) {
    return <StatePanel message="Aucun contrat." variant="empty" />;
  }

  return (
    <TableShell>
      <Table className="text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left">
            <th className="whitespace-nowrap px-4 py-3">Client</th>
            <th className="whitespace-nowrap px-4 py-3">Contrat</th>
            <th className="whitespace-nowrap px-4 py-3">Début</th>
            <th className="whitespace-nowrap px-4 py-3">Fin</th>
            <th className="whitespace-nowrap px-4 py-3">PDF</th>
            <th className="whitespace-nowrap px-4 py-3">Auto-renouvellement</th>
            <th className="whitespace-nowrap px-4 py-3">Ville</th>
            <th className="whitespace-nowrap px-4 py-3">Catégorie</th>
            <th className="whitespace-nowrap px-4 py-3">Flag</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.id} className="border-b border-slate-100 hover:bg-slate-50/70">
              <td className="px-4 py-3 font-medium text-primary">
                <Link href={`/clients/${contract.clientId}`} className="hover:underline">
                  {contract.clientName}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3">{contract.title}</td>
              <td className="whitespace-nowrap px-4 py-3">{contract.startDate}</td>
              <td className="whitespace-nowrap px-4 py-3">{contract.endDate}</td>
              <td className="whitespace-nowrap px-4 py-3">{contract.privatePdfPath ? 'Oui' : 'Non'}</td>
              <td className="whitespace-nowrap px-4 py-3">{contract.autoRenewal ? 'Oui' : 'Non'}</td>
              <td className="whitespace-nowrap px-4 py-3">{contract.clientCity ?? '—'}</td>
              <td className="whitespace-nowrap px-4 py-3">{contract.clientCategory ? clientCategoryLabels[contract.clientCategory] : '—'}</td>
              <td className="whitespace-nowrap px-4 py-3">
                {contract.clientFlag ? (
                  <Badge
                    label={clientFlagLabels[contract.clientFlag]}
                    tone={contract.clientFlag === 'risk' ? 'danger' : contract.clientFlag === 'watch' ? 'warning' : contract.clientFlag === 'vip' ? 'success' : 'neutral'}
                  />
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableShell>
  );
}
