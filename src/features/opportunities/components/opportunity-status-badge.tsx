import type { OpportunityStatus } from '@/types/opportunity';

const statusLabelMap: Record<OpportunityStatus, string> = {
  open: 'Ouverte',
  qualified: 'Qualifiée',
  proposal: 'Proposition',
  won: 'Gagnée',
  lost: 'Perdue'
};

const statusClassMap: Record<OpportunityStatus, string> = {
  open: 'bg-sky-100 text-sky-800',
  qualified: 'bg-violet-100 text-violet-800',
  proposal: 'bg-amber-100 text-amber-800',
  won: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-slate-200 text-slate-700'
};

export function OpportunityStatusBadge({ status }: { status: OpportunityStatus }) {
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClassMap[status]}`}>{statusLabelMap[status]}</span>;
}

export const opportunityStatusLabels = statusLabelMap;
