import Link from 'next/link';
import { StatePanel } from '@/components/ui/state-panel';
import { TableShell } from '@/components/ui/table-shell';
import { InterventionStatusBadge } from '@/features/interventions/components/intervention-status-badge';
import type { Intervention } from '@/types/intervention';

const interventionTypeLabels: Record<Intervention['type'], string> = {
  depannage: 'Dépannage',
  maintenance: 'Maintenance',
  controle: 'Contrôle',
  installation: 'Installation',
  autre: 'Autre'
};

function formatTime(time: string | null) {
  return time ? time.slice(0, 5) : '—';
}

export function InterventionTable({ interventions }: { interventions: Intervention[] }) {
  if (!interventions.length) {
    return <StatePanel message="Aucune intervention enregistrée pour le moment." variant="empty" />;
  }

  return (
    <TableShell>
      <table className="min-w-[1200px] border-collapse text-sm md:min-w-full">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-600">
            <th className="whitespace-nowrap px-3 py-2">Date</th>
            <th className="whitespace-nowrap px-3 py-2">Intervention</th>
            <th className="whitespace-nowrap px-3 py-2">Client / Machine</th>
            <th className="whitespace-nowrap px-3 py-2">Technicien</th>
            <th className="whitespace-nowrap px-3 py-2">Diagnostic / Action</th>
            <th className="whitespace-nowrap px-3 py-2">Preuves</th>
          </tr>
        </thead>
        <tbody>
          {interventions.map((intervention) => (
            <tr key={intervention.id} className="border-b border-slate-100 align-top">
              <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                <p className="font-medium">{intervention.interventionDate}</p>
                <p className="text-xs text-slate-500">
                  {formatTime(intervention.startTime)} → {formatTime(intervention.endTime)}
                </p>
              </td>
              <td className="px-3 py-2 text-slate-800">
                <p className="font-medium text-slate-900">{intervention.title}</p>
                <p className="mt-1 text-xs text-slate-600">{intervention.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{interventionTypeLabels[intervention.type]}</span>
                  <InterventionStatusBadge status={intervention.status} />
                </div>
              </td>
              <td className="px-3 py-2 text-slate-700">
                <Link href={`/clients/${intervention.clientId}`} className="font-medium hover:underline">
                  {intervention.clientName}
                </Link>
                <p className="text-xs text-slate-500">Machine: {intervention.machineLabel ?? 'Non renseignée'}</p>
              </td>
              <td className="px-3 py-2 text-slate-700">
                <p>{intervention.technicianUserLabel ?? '—'}</p>
                {intervention.technicianName ? <p className="text-xs text-slate-500">Nom saisi: {intervention.technicianName}</p> : null}
              </td>
              <td className="px-3 py-2 text-xs text-slate-700">
                <p>
                  <span className="font-medium text-slate-900">Diagnostic:</span> {intervention.diagnosis ?? '—'}
                </p>
                <p className="mt-1">
                  <span className="font-medium text-slate-900">Action:</span> {intervention.actionTaken ?? '—'}
                </p>
                {intervention.notes ? <p className="mt-1 text-slate-600">Notes: {intervention.notes}</p> : null}
              </td>
              <td className="px-3 py-2 text-xs text-slate-700">{intervention.photoPath ? <span className="break-all">{intervention.photoPath}</span> : 'Aucune photo'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}
