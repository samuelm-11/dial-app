import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { getClientsWithoutContractPdf, getContractsEndingSoon } from '@/features/contracts/queries';
import { getOpportunities } from '@/features/opportunities/queries';

export default async function DashboardPage() {
  const [endingSoonContracts, contractsWithoutPdf, openOpportunities, recentOpportunities] = await Promise.all([
    getContractsEndingSoon(90),
    getClientsWithoutContractPdf(),
    getOpportunities({ statuses: ['open', 'qualified', 'proposal'] }),
    getOpportunities({})
  ]);

  const potentialAmount = openOpportunities.reduce((sum, item) => sum + (item.estimatedValue ?? 0), 0);

  return (
    <PageContainer title="Dashboard">
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Contrats finissant bientôt</p>
            <p className="text-2xl font-semibold text-slate-900">{endingSoonContracts.length}</p>
            <p className="text-xs text-slate-600">Source privilégiée: vue v_contracts_ending_soon.</p>
          </div>

          <div className="rounded border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Opportunités ouvertes</p>
            <p className="text-2xl font-semibold text-slate-900">{openOpportunities.length}</p>
            <p className="text-xs text-slate-600">Statuts open / qualified / proposal.</p>
          </div>
          <div className="rounded border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Potentiel estimé</p>
            <p className="text-2xl font-semibold text-slate-900">{Math.round(potentialAmount).toLocaleString('fr-FR')} €</p>
            <p className="text-xs text-slate-600">Somme des opportunités ouvertes.</p>
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

        <div className="rounded border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900">Opportunités récentes</h2>
          {recentOpportunities.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">Aucune opportunité récente.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {recentOpportunities.slice(0, 6).map((opportunity) => (
                <li key={opportunity.id}>
                  <Link href={`/clients/${opportunity.clientId}`} className="hover:underline">
                    {opportunity.clientName}
                  </Link>{' '}
                  · {opportunity.title} · {opportunity.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
