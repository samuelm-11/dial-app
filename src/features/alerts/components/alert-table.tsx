'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { dismissAlert, markAlertDone } from '@/features/alerts/actions';
import { AlertStatusBadge } from '@/features/alerts/components/alert-status-badge';
import type { Alert } from '@/types/alert';

function dueLabel(daysRemaining: number) {
  if (daysRemaining < 0) {
    return `En retard de ${Math.abs(daysRemaining)}j`;
  }

  if (daysRemaining === 0) {
    return 'Aujourd’hui';
  }

  return `J-${daysRemaining}`;
}

export function AlertTable({ alerts, title }: { alerts: Alert[]; title?: string }) {
  const [isPending, startTransition] = useTransition();

  const onMarkDone = (alertId: string) => {
    startTransition(async () => {
      await markAlertDone(alertId);
    });
  };

  const onDismiss = (alertId: string) => {
    startTransition(async () => {
      await dismissAlert(alertId);
    });
  };

  if (!alerts.length) {
    return <p className="rounded border border-dashed p-4 text-sm text-slate-500">Aucune alerte dans cette section.</p>;
  }

  return (
    <div className="space-y-2">
      {title ? <h3 className="text-sm font-semibold text-slate-900">{title}</h3> : null}
      <div className="overflow-x-auto rounded border border-slate-200">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-slate-600">
              <th className="px-3 py-2">Alerte</th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Type machine</th>
              <th className="px-3 py-2">Échéance</th>
              <th className="px-3 py-2">Statut</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-b border-slate-100 align-top">
                <td className="px-3 py-2">
                  <p className="font-medium text-slate-900">{alert.title}</p>
                  <p className="text-xs text-slate-600">{alert.description}</p>
                </td>
                <td className="px-3 py-2 text-slate-700">
                  <Link href={`/clients/${alert.clientId}`} className="font-medium hover:underline">
                    {alert.clientName}
                  </Link>
                  {alert.clientPostalCode ? <p className="text-xs text-slate-500">CP {alert.clientPostalCode}</p> : null}
                </td>
                <td className="px-3 py-2 text-slate-700">{alert.machineTypeLabel ?? '—'}</td>
                <td className="px-3 py-2 text-slate-700">
                  <p>{alert.dueDate}</p>
                  <p className="text-xs text-slate-500">{dueLabel(alert.daysRemaining)}</p>
                </td>
                <td className="px-3 py-2">
                  <AlertStatusBadge status={alert.status} />
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    {alert.status === 'open' ? (
                      <>
                        <button disabled={isPending} onClick={() => onMarkDone(alert.id)} className="rounded border border-emerald-300 px-2 py-1 text-xs text-emerald-700">
                          {isPending ? '...' : 'Marquer traité'}
                        </button>
                        <button disabled={isPending} onClick={() => onDismiss(alert.id)} className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700">
                          {isPending ? '...' : 'Ignorer'}
                        </button>
                      </>
                    ) : null}
                    <Link href={`/clients/${alert.clientId}`} className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700">
                      Ouvrir client
                    </Link>
                    {alert.machineId ? (
                      <Link href={`/clients/${alert.clientId}?focus=machines&machineId=${alert.machineId}`} className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700">
                        Ouvrir machine
                      </Link>
                    ) : null}
                    {alert.contractId ? (
                      <Link href={`/clients/${alert.clientId}?focus=contracts&contractId=${alert.contractId}`} className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700">
                        Ouvrir contrat
                      </Link>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
