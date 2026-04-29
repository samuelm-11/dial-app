import { cache } from 'react';
import { createSupabaseServerComponentClient } from '@/lib/supabase/server';
import { alertFilterSchema } from '@/features/alerts/schemas';
import type { Alert, AlertDueBucket, AlertFilterInput, AlertStatus } from '@/types/alert';
import { seedFakeData } from '@/lib/fake-data';

const now = () => new Date();

function toDaysRemaining(date: string) {
  const diff = (new Date(date).getTime() - now().getTime()) / (1000 * 60 * 60 * 24);
  return Math.ceil(diff);
}

function toDueBucket(daysRemaining: number): AlertDueBucket {
  if (daysRemaining <= 7) {
    return 'urgent';
  }

  if (daysRemaining <= 30) {
    return 'upcoming';
  }

  return 'later';
}

function filterAlerts(items: Alert[], filters: AlertFilterInput): Alert[] {
  const payload = alertFilterSchema.parse(filters);

  return items.filter((item) => {
    const typeOk = !payload.type?.length || payload.type.includes(item.type);
    const statusOk = !payload.status?.length || payload.status.includes(item.status);
    const dueBucketOk = !payload.dueBucket?.length || payload.dueBucket.includes(item.dueBucket);
    const dueDaysOk = payload.dueWithinDays === undefined || item.daysRemaining <= payload.dueWithinDays;
    const clientOk = !payload.clientId || item.clientId === payload.clientId;
    const postalOk = !payload.postalCode || item.clientPostalCode?.startsWith(payload.postalCode) === true;
    const machineTypeOk =
      !payload.machineType ||
      (item.machineTypeLabel?.toLowerCase().includes(payload.machineType.toLowerCase()) ?? false) ||
      (item.machineTypeCode?.toLowerCase().includes(payload.machineType.toLowerCase()) ?? false);

    return typeOk && statusOk && dueBucketOk && dueDaysOk && clientOk && postalOk && machineTypeOk;
  });
}

function mapAlertRow(row: any): Alert {
  const client = Array.isArray(row.clients) ? row.clients[0] : row.clients;
  const machine = Array.isArray(row.client_machines) ? row.client_machines[0] : row.client_machines;
  const machineType = Array.isArray(machine?.machine_types) ? machine.machine_types[0] : machine?.machine_types;
  const dueDate = row.due_date ?? new Date().toISOString().slice(0, 10);
  const daysRemaining = Number(row.days_remaining ?? toDaysRemaining(dueDate));
  const dueBucket = (row.due_bucket as AlertDueBucket | null) ?? toDueBucket(daysRemaining);
  const status = row.status === 'done' || row.status === 'dismissed' ? row.status : 'open';
  const type = row.contract_id ? 'contract_end' : 'filter_change';

  return {
    id: row.id,
    type,
    status: status as AlertStatus,
    title: row.title,
    description: row.message ?? '',
    clientId: row.client_id,
    clientName: row.client_name ?? client?.name ?? 'Client',
    clientPostalCode: row.client_postal_code ?? client?.postal_code ?? null,
    machineId: row.client_machine_id ?? null,
    machineTypeLabel: machineType?.name ?? null,
    machineTypeCode: null,
    contractId: row.contract_id ?? null,
    contractTitle: row.contract_title ?? null,
    dueDate,
    daysRemaining,
    dueBucket,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export const getAlerts = cache(async (filters: AlertFilterInput = {}): Promise<Alert[]> => {
  const parsedFilters = alertFilterSchema.safeParse(filters);
  const payload = parsedFilters.success ? parsedFilters.data : {};
  const supabase = await createSupabaseServerComponentClient();

  const { data, error } = await supabase
    .from('notifications')
    .select('*, clients(name, postal_code), client_machines(machine_types(name))')
    .order('due_date', { ascending: true });

  const source = error || !Array.isArray(data) || data.length === 0 ? seedFakeData().alerts : data.map(mapAlertRow);
  return filterAlerts(source, payload);
});

export const getClientAlerts = cache(async (clientId: string): Promise<Alert[]> => {
  return getAlerts({ clientId });
});

export const getUrgentAlerts = cache(async (): Promise<Alert[]> => {
  return getAlerts({ status: ['open'], dueBucket: ['urgent'] });
});

export const getUpcomingAlerts = cache(async (): Promise<Alert[]> => {
  return getAlerts({ status: ['open'], dueBucket: ['upcoming'] });
});
