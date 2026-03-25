import type { AlertStatus } from '@/types/alert';

const statusLabels: Record<AlertStatus, string> = {
  open: 'Ouverte',
  done: 'Traitée',
  dismissed: 'Ignorée'
};

const statusClassNames: Record<AlertStatus, string> = {
  open: 'bg-amber-100 text-amber-800',
  done: 'bg-emerald-100 text-emerald-800',
  dismissed: 'bg-slate-200 text-slate-700'
};

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClassNames[status]}`}>{statusLabels[status]}</span>;
}

export const alertStatusLabelMap = statusLabels;
