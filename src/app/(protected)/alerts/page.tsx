import { PageContainer } from '@/components/layout/page-container';
import { AlertFilters } from '@/features/alerts/components/alert-filters';
import { AlertTable } from '@/features/alerts/components/alert-table';
import { getAlerts } from '@/features/alerts/queries';
import { getAlertFiltersFromSearchParams } from '@/features/alerts/search-params';
import { getClientOptions } from '@/features/clients/queries';

export default async function AlertsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = getAlertFiltersFromSearchParams(resolvedSearchParams);

  const [alerts, clients] = await Promise.all([getAlerts(filters), getClientOptions()]);
  const safeAlerts = Array.isArray(alerts) ? alerts : [];
  const safeClients = Array.isArray(clients) ? clients : [];

  const urgentAlerts = safeAlerts.filter((alert) => alert.status === 'open' && alert.dueBucket === 'urgent');
  const upcomingAlerts = safeAlerts.filter((alert) => alert.status === 'open' && alert.dueBucket === 'upcoming');
  const doneAlerts = safeAlerts.filter((alert) => alert.status !== 'open');

  return (
    <PageContainer title="Alertes">
      <div className="space-y-4">
        <AlertFilters clients={safeClients} />

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Alertes urgentes</h2>
          <AlertTable alerts={urgentAlerts} />
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Alertes à venir</h2>
          <AlertTable alerts={upcomingAlerts} />
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Alertes traitées</h2>
          <AlertTable alerts={doneAlerts} />
        </section>
      </div>
    </PageContainer>
  );
}
