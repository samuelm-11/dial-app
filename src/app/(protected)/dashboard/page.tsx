import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { getClientsWithoutContractPdf, getContractsEndingSoon } from '@/features/contracts/queries';

export default async function DashboardPage() {
  const [endingSoonContracts, contractsWithoutPdf] = await Promise.all([getContractsEndingSoon(90), getClientsWithoutContractPdf()]);

  return (
    <PageContainer title="Dashboard">
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Contrats finissant bientôt</p>
            <p className="text-2xl font-semibold text-slate-900">{endingSoonContracts.length}</p>
            <p className="text-xs text-slate-600">Source privilégiée: vue v_contracts_ending_soon.</p>
          </div>
          <div className="rounded border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Clients sans PDF contrat</p>
            <p className="text-2xl font-semibold text-slate-900">{contractsWithoutPdf.length}</p>
            <p className="text-xs text-slate-600">Bucket privé contracts requis pour conformité.</p>
          </div>
        </div>

        <div className="rounded border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900">Échéances contrats (90 jours)</h2>
          {endingSoonContracts.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">Aucun contrat en fin proche.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {endingSoonContracts.slice(0, 8).map((contract) => (
                <li key={contract.id}>
                  <Link href={`/clients/${contract.clientId}`} className="hover:underline">
                    {contract.clientName}
                  </Link>{' '}
                  · {contract.title} · J-{contract.daysRemaining}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
