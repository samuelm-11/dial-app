import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { alertFilterSchema } from '@/features/alerts/schemas';
import { getContractsEndingSoon } from '@/features/contracts/queries';
import type { Alert, AlertDueBucket, AlertFilterInput, AlertStatus } from '@/types/alert';

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
  const dueDate = row.due_date;
  const daysRemaining = Number(row.days_remaining ?? toDaysRemaining(dueDate));
  const dueBucket = (row.due_bucket as AlertDueBucket | null) ?? toDueBucket(daysRemaining);

  return {
    id: row.id,
    type: row.type,
    status: (row.status ?? 'open') as AlertStatus,
    title: row.title,
    description: row.description ?? '',
    clientId: row.client_id,
    clientName: row.client_name ?? row.clients?.name ?? 'Client',
    clientPostalCode: row.client_postal_code ?? row.clients?.postal_code ?? null,
    machineId: row.machine_id ?? null,
    machineTypeLabel: row.machine_type_label ?? null,
    machineTypeCode: row.machine_type_code ?? null,
    contractId: row.contract_id ?? null,
    contractTitle: row.contract_title ?? null,
    dueDate,
    daysRemaining,
    dueBucket,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function getFallbackAlerts(): Promise<Alert[]> {
  const [contractsEndingSoon, supabase] = await Promise.all([getContractsEndingSoon(90), createSupabaseServerClient()]);

  const todayIso = now().toISOString();
  const contractAlerts: Alert[] = contractsEndingSoon.map((contract) => ({
    id: `aaaaaaaa-aaaa-4aaa-8aaa-${contract.id.replace(/-/g, '').slice(0, 12)}`,
    type: 'contract_end',
    status: 'open',
    title: `Contrat proche de fin: ${contract.title}`,
    description: `Contrat ${contract.title} en fin de validité pour ${contract.clientName}.`,
    clientId: contract.clientId,
    clientName: contract.clientName,
    clientPostalCode: null,
    machineId: null,
    machineTypeLabel: null,
    machineTypeCode: null,
    contractId: contract.id,
    contractTitle: contract.title,
    dueDate: contract.endDate,
    daysRemaining: contract.daysRemaining,
    dueBucket: toDueBucket(contract.daysRemaining),
    createdAt: todayIso,
    updatedAt: todayIso
  }));

  const { data: filterRows, error } = await supabase
    .from('v_filters_due')
    .select('client_id, client_name, machine_id, machine_type_label, machine_type_code, next_filter_change_date, postal_code')
    .lte('days_remaining', 90)
    .order('days_remaining', { ascending: true });

  const filterAlerts: Alert[] = (error || !filterRows
    ? []
    : filterRows.map((row: any, index: number) => {
        const daysRemaining = toDaysRemaining(row.next_filter_change_date);
        return {
          id: `bbbbbbbb-bbbb-4bbb-8bbb-${`${index + 1}`.padStart(12, '0')}`,
          type: 'filter_change',
          status: 'open',
          title: `Filtre à changer: ${row.machine_type_label ?? 'Machine'}`,
          description: `Intervention filtre recommandée pour ${row.client_name ?? 'client'}.`,
          clientId: row.client_id,
          clientName: row.client_name ?? 'Client',
          clientPostalCode: row.postal_code ?? null,
          machineId: row.machine_id ?? null,
          machineTypeLabel: row.machine_type_label ?? null,
          machineTypeCode: row.machine_type_code ?? null,
          contractId: null,
          contractTitle: null,
          dueDate: row.next_filter_change_date,
          daysRemaining,
          dueBucket: toDueBucket(daysRemaining),
          createdAt: todayIso,
          updatedAt: todayIso
        };
      })) satisfies Alert[];

  return [...contractAlerts, ...filterAlerts].sort((a, b) => a.daysRemaining - b.daysRemaining);
}

export const getAlerts = cache(async (filters: AlertFilterInput = {}): Promise<Alert[]> => {
  const payload = alertFilterSchema.parse(filters);
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('alerts')
    .select('*, clients(name, postal_code)')
    .order('due_date', { ascending: true });

  const source = error || !data ? await getFallbackAlerts() : data.map(mapAlertRow);
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
