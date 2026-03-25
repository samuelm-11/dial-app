import { AlertTable } from '@/features/alerts/components/alert-table';
import type { Alert } from '@/types/alert';

export function ClientAlertsTab({ alerts }: { alerts: Alert[] }) {
  const openAlerts = alerts.filter((alert) => alert.status === 'open');
  const doneAlerts = alerts.filter((alert) => alert.status !== 'open');

  return (
    <div className="space-y-4">
      <AlertTable title="Alertes ouvertes" alerts={openAlerts} />
      <AlertTable title="Historique" alerts={doneAlerts} />
    </div>
  );
}
