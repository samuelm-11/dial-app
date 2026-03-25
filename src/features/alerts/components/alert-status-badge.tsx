import { Badge } from '@/components/ui/badge';
import type { AlertStatus } from '@/types/alert';

const statusLabels: Record<AlertStatus, string> = {
  open: 'Ouverte',
  done: 'Traitée',
  dismissed: 'Ignorée'
};

const statusTones: Record<AlertStatus, 'warning' | 'success' | 'neutral'> = {
  open: 'warning',
  done: 'success',
  dismissed: 'neutral'
};

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  return <Badge label={statusLabels[status]} tone={statusTones[status]} />;
}

export const alertStatusLabelMap = statusLabels;
