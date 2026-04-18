import type { InterventionStatus } from '@/types/intervention';

export const interventionStatusLabels: Record<InterventionStatus, string> = {
  planned: 'Planifiée',
  in_progress: 'En cours',
  done: 'Terminée',
  cancelled: 'Annulée'
};

const statusClasses: Record<InterventionStatus, string> = {
  planned: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-amber-100 text-amber-700',
  done: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700'
};

export function InterventionStatusBadge({ status }: { status: InterventionStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[status]}`}>{interventionStatusLabels[status]}</span>;
}
