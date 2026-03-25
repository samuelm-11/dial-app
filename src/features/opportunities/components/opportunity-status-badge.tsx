import { Badge } from '@/components/ui/badge';
import type { OpportunityStatus } from '@/types/opportunity';

const statusLabelMap: Record<OpportunityStatus, string> = {
  open: 'Ouverte',
  qualified: 'Qualifiée',
  proposal: 'Proposition',
  won: 'Gagnée',
  lost: 'Perdue'
};

const statusToneMap: Record<OpportunityStatus, 'info' | 'accent' | 'warning' | 'success' | 'neutral'> = {
  open: 'info',
  qualified: 'accent',
  proposal: 'warning',
  won: 'success',
  lost: 'neutral'
};

export function OpportunityStatusBadge({ status }: { status: OpportunityStatus }) {
  return <Badge label={statusLabelMap[status]} tone={statusToneMap[status]} />;
}

export const opportunityStatusLabels = statusLabelMap;
