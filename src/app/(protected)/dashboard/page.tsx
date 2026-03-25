import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { getAlerts, getUrgentAlerts } from '@/features/alerts/queries';
import { getClients } from '@/features/clients/queries';
import { getContractsEndingSoon } from '@/features/contracts/queries';

export default async function DashboardPage() {
  const [allOpenAlerts, urgentAlerts, contractsEndingSoon, redFlagClients] = await Promise.all([
    getAlerts({ status: ['open'] }),
    getUrgentAlerts(),
    getContractsEndingSoon(90),
    getClients({ flags: ['risk'] })
  ]);

  const filterDueSoon = allOpenAlerts.filter((alert) => alert.type === 'filter_change' && (alert.dueBucket === 'urgent' || alert.dueBucket === 'upcoming'));

  return (
    <PageContainer title="Dashboard">
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Filtres à changer bientôt</p>
            <p className="text-2xl font-semibold text-slate-900">{filterDueSoon.length}</p>
            <p className="text-xs text-slate-600">Alertes filtres urgentes et à venir.</p>
          </div>

          <div className="rounded border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Alertes ouvertes</p>
            <p className="text-2xl font-semibold text-slate-900">{allOpenAlerts.length}</p>
            <p className="text-xs text-slate-600">Contrats + maintenance filtres.</p>
          </div>

          <div className="rounded border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Clients flag rouge</p>
            <p className="text-2xl font-semibold text-slate-900">{redFlagClients.length}</p>
            <p className="text-xs text-slate-600">Clients avec niveau risque élevé.</p>
          </div>

          <div className="rounded border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Contrats proches de fin</p>
            <p className="text-2xl font-semibold text-slate-900">{contractsEndingSoon.length}</p>
            <p className="text-xs text-slate-600">Échéance à 90 jours.</p>
          </div>
        </div>

        <div className="rounded border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900">Alertes urgentes</h2>
          {urgentAlerts.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">Aucune alerte urgente.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {urgentAlerts.slice(0, 8).map((alert) => (
                <li key={alert.id}>
                  <Link href={`/clients/${alert.clientId}`} className="hover:underline">
                    {alert.clientName}
                  </Link>{' '}
                  · {alert.title} · J-{alert.daysRemaining}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900">Contrats proches de fin</h2>
          {contractsEndingSoon.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">Aucun contrat proche de fin.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {contractsEndingSoon.slice(0, 8).map((contract) => (
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
