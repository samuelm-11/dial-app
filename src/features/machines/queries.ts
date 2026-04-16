import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isFilterDueSoon, machineTypeLooksLike } from '@/features/machines/helpers';
import type { ClientMachine, MachineCategory, MachineFilterInput, MachineType } from '@/types/machine';

const fallbackCategories: MachineCategory[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    code: 'boisson_chaude',
    label: 'Boisson chaude',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    code: 'confiserie',
    label: 'Confiserie',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const fallbackTypes: MachineType[] = [
  {
    id: '00000000-0000-0000-0000-000000000101',
    machineCategoryId: fallbackCategories[0].id,
    code: 'cafe_grain',
    label: 'Café grain',
    requiresFilterChange: true,
    filterLifespanDays: 90,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const fallbackClientMachines: ClientMachine[] = [];

export const getMachineCategories = cache(async (): Promise<MachineCategory[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('machine_categories').select('*').order('label', { ascending: true });

  if (error || !data) {
    return fallbackCategories;
  }

  return data.map((item) => ({
    id: item.id,
    code: item.code,
    label: item.label,
    isActive: item.is_active ?? true,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }));
});

export const getMachineTypes = cache(async (): Promise<MachineType[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('machine_types').select('*').order('label', { ascending: true });

  if (error || !data) {
    return fallbackTypes;
  }

  return data.map((item) => ({
    id: item.id,
    machineCategoryId: item.machine_category_id,
    code: item.code,
    label: item.label,
    requiresFilterChange: item.requires_filter_change ?? !!item.recommended_filter_interval_days,
    filterLifespanDays: item.filter_lifespan_days ?? item.recommended_filter_interval_days ?? null,
    isActive: item.is_active ?? true,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }));
});

export const getClientMachines = cache(async (clientId: string): Promise<ClientMachine[]> => {
  const supabase = await createSupabaseServerClient();


  const { data, error } = await supabase
    .from('client_machines')
    .select('*, machine_types!inner(*, machine_categories!inner(*))')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return fallbackClientMachines;
  }

  return data.map((item) => {
    const machineType = Array.isArray(item.machine_types) ? item.machine_types[0] : item.machine_types;
    const machineCategory = machineType && Array.isArray(machineType.machine_categories)
      ? machineType.machine_categories[0]
      : machineType?.machine_categories;

    return {
      id: item.id,
      clientId: item.client_id,
      machineTypeId: item.machine_type_id,
      machineTypeLabel: machineType?.label ?? 'Type inconnu',
      machineCategoryId: machineType?.machine_category_id ?? '',
      machineCategoryLabel: machineCategory?.label ?? 'Catégorie inconnue',
      quantity: item.quantity ?? 1,
      installationDate: item.installation_date,
      status: (item.status ?? 'active') as ClientMachine['status'],
      lastFilterChangeDate: item.last_filter_change_date,
      nextFilterChangeDate: item.next_filter_change_date,
      notes: item.notes ?? null,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    };
  });
});

export async function getClientIdsMatchingMachineFilters(filters: MachineFilterInput): Promise<Set<string> | null> {
  if (
    !filters.machineCategoryIds?.length &&
    !filters.machineTypeIds?.length &&
    !filters.hasHotDrinks &&
    !filters.hasCandy &&
    !filters.withoutWaterFountain &&
    !filters.withFiltersDueSoon
  ) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  let dueSoonClientIds: Set<string> | null = null;
  if (filters.withFiltersDueSoon) {
    const { data: dueRows, error: dueError } = await supabase.from('v_machines_filter_alerts').select('client_id');
    if (!dueError && dueRows) {
      dueSoonClientIds = new Set(dueRows.map((row) => row.client_id as string));
      if (!dueSoonClientIds.size) {
        return new Set<string>();
      }
    }
  }

  const { data, error } = await supabase
    .from('client_machines')
    .select('client_id, machine_type_id, next_filter_change_date, machine_types!inner(code, machine_category_id)');

  if (error || !data) {
    return new Set<string>();
  }

  const allRows = data.map((item) => {
    const machineType = Array.isArray(item.machine_types) ? item.machine_types[0] : item.machine_types;

    return {
      clientId: item.client_id,
      machineCategoryId: machineType?.machine_category_id,
      machineTypeCode: machineType?.code ?? '',
      machineTypeId: item.machine_type_id,
      nextFilterChangeDate: item.next_filter_change_date as string | null
    };
  });

  const byClient = new Map<string, typeof allRows>();
  for (const row of allRows) {
    byClient.set(row.clientId, [...(byClient.get(row.clientId) ?? []), row]);
  }

  const matches = new Set<string>();
  for (const [clientId, rows] of byClient.entries()) {
    const hasCategory = !filters.machineCategoryIds?.length || rows.some((r) => filters.machineCategoryIds?.includes(r.machineCategoryId));
    const hasType = !filters.machineTypeIds?.length || rows.some((r) => filters.machineTypeIds?.includes(r.machineTypeId));
    const hasHotDrinks = !filters.hasHotDrinks || rows.some((r) => machineTypeLooksLike(r.machineTypeCode, ['cafe', 'boisson_chaude', 'coffee']));
    const hasCandy = !filters.hasCandy || rows.some((r) => machineTypeLooksLike(r.machineTypeCode, ['confiserie', 'snack', 'candy']));
    const noWaterFountain =
      !filters.withoutWaterFountain || !rows.some((r) => machineTypeLooksLike(r.machineTypeCode, ['fontaine', 'water', 'eau']));
    const filterDueSoon =
      !filters.withFiltersDueSoon ||
      (dueSoonClientIds ? dueSoonClientIds.has(clientId) : rows.some((r) => isFilterDueSoon(r.nextFilterChangeDate)));

    if (hasCategory && hasType && hasHotDrinks && hasCandy && noWaterFountain && filterDueSoon) {
      matches.add(clientId);
    }
  }

  return matches;
}
