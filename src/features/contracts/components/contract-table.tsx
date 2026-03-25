import Link from 'next/link';
import { clientCategoryLabels, clientFlagLabels } from '@/features/clients/helpers';
import type { Contract } from '@/types/contract';

export function ContractTable({ contracts }: { contracts: Contract[] }) {
  if (contracts.length === 0) {
    return <p className="rounded border border-dashed p-6 text-sm text-slate-500">Aucun contrat trouvé avec ces filtres.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-600">
            <th className="px-3 py-2">Client</th>
            <th className="px-3 py-2">Contrat</th>
            <th className="px-3 py-2">Début</th>
            <th className="px-3 py-2">Fin</th>
            <th className="px-3 py-2">PDF</th>
            <th className="px-3 py-2">Auto-renouvellement</th>
            <th className="px-3 py-2">Ville</th>
            <th className="px-3 py-2">Catégorie</th>
            <th className="px-3 py-2">Flag</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.id} className="border-b border-slate-100">
              <td className="px-3 py-2 font-medium text-slate-900">
                <Link href={`/clients/${contract.clientId}`} className="hover:underline">
                  {contract.clientName}
                </Link>
              </td>
              <td className="px-3 py-2 text-slate-700">{contract.title}</td>
              <td className="px-3 py-2 text-slate-700">{contract.startDate}</td>
              <td className="px-3 py-2 text-slate-700">{contract.endDate}</td>
              <td className="px-3 py-2 text-slate-700">{contract.privatePdfPath ? 'Oui' : 'Non'}</td>
              <td className="px-3 py-2 text-slate-700">{contract.autoRenewal ? 'Oui' : 'Non'}</td>
              <td className="px-3 py-2 text-slate-700">{contract.clientCity ?? '—'}</td>
              <td className="px-3 py-2 text-slate-700">{contract.clientCategory ? clientCategoryLabels[contract.clientCategory] : '—'}</td>
              <td className="px-3 py-2 text-slate-700">{contract.clientFlag ? clientFlagLabels[contract.clientFlag] : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
