import type { ClientMachine } from '@/types/machine';

export const machineStatusLabels: Record<ClientMachine['status'], string> = {
  active: 'Actif',
  inactive: 'Inactif',
  maintenance: 'Maintenance'
};

export function formatDate(value: string | null) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('fr-FR').format(new Date(value));
}

export function isFilterDueSoon(date: string | null, days = 14) {
  if (!date) {
    return false;
  }

  const diff = (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return diff <= days;
}

export function machineTypeLooksLike(code: string, patterns: string[]) {
  const normalized = code.toLowerCase();
  return patterns.some((pattern) => normalized.includes(pattern));
}
