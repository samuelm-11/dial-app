import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  const safeAllOpenAlerts = Array.isArray(allOpenAlerts) ? allOpenAlerts : [];
  const safeUrgentAlerts = Array.isArray(urgentAlerts) ? urgentAlerts : [];
  const safeContractsEndingSoon = Array.isArray(contractsEndingSoon) ? contractsEndingSoon : [];
  const safeRedFlagClients = Array.isArray(redFlagClients) ? redFlagClients : [];

  const filterDueSoon = safeAllOpenAlerts.filter(
    (alert) => alert.type === 'filter_change' && (alert.dueBucket === 'urgent' || alert.dueBucket === 'upcoming')
  );

  return (
    <PageContainer title="Dashboard">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="bg-primary text-white">
            <p className="text-xs uppercase tracking-wide text-white/70">Filtres à changer bientôt</p>
            <p className="mt-2 text-3xl font-semibold">{filterDueSoon.length}</p>
            <p className="mt-1 text-xs text-white/70">Alertes filtres urgentes et à venir.</p>
          </Card>

          <Card>
            <p className="text-xs uppercase tracking-wide text-slate-500">Alertes ouvertes</p>
            <p className="mt-2 text-3xl font-semibold text-primary">{safeAllOpenAlerts.length}</p>
            <p className="mt-1 text-xs text-slate-500">Contrats + maintenance filtres.</p>
          </Card>

          <Card>
            <p className="text-xs uppercase tracking-wide text-slate-500">Clients flag rouge</p>
            <p className="mt-2 text-3xl font-semibold text-danger">{safeRedFlagClients.length}</p>
            <p className="mt-1 text-xs text-slate-500">Clients avec niveau risque élevé.</p>
          </Card>

          <Card>
            <p className="text-xs uppercase tracking-wide text-slate-500">Contrats proches de fin</p>
            <p className="mt-2 text-3xl font-semibold text-secondary">{safeContractsEndingSoon.length}</p>
            <p className="mt-1 text-xs text-slate-500">Échéance à 90 jours.</p>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Alertes urgentes</CardTitle>
              <CardDescription>Priorité de traitement sur les 8 prochaines interventions.</CardDescription>
            </div>
            <Badge tone="danger" label={`${safeUrgentAlerts.length} urgentes`} />
          </CardHeader>
          {safeUrgentAlerts.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune alerte urgente.</p>
          ) : (
            <ul className="space-y-2.5 text-sm text-slate-700">
              {safeUrgentAlerts.slice(0, 8).map((alert) => (
                <li key={alert.id} className="rounded-lg border border-muted px-3 py-2">
                  <Link href={`/clients/${alert.clientId}`} className="font-medium text-primary hover:underline">
                    {alert.clientName}
                  </Link>{' '}
                  · {alert.title} · J-{alert.daysRemaining}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Contrats proches de fin</CardTitle>
              <CardDescription>Clients à recontacter avant échéance contractuelle.</CardDescription>
            </div>
            <Badge tone="warning" label={`${safeContractsEndingSoon.length} à suivre`} />
          </CardHeader>
          {safeContractsEndingSoon.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun contrat proche de fin.</p>
          ) : (
            <ul className="space-y-2.5 text-sm text-slate-700">
              {safeContractsEndingSoon.slice(0, 8).map((contract) => (
                <li key={contract.id} className="rounded-lg border border-muted px-3 py-2">
                  <Link href={`/clients/${contract.clientId}`} className="font-medium text-primary hover:underline">
                    {contract.clientName}
                  </Link>{' '}
                  · {contract.title} · J-{contract.daysRemaining}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}
