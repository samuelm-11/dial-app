import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  ClientCategorySetting,
  FlagSetting,
  MachineCategorySetting,
  MachineTypeSetting,
  NotificationRuleSetting
} from '@/types/settings';

const nowIso = new Date().toISOString();

const fallbackClientCategories: ClientCategorySetting[] = [
  { id: '00000000-0000-0000-0000-000000000011', code: 'enterprise', label: 'Entreprise', isActive: true, createdAt: nowIso, updatedAt: nowIso },
  { id: '00000000-0000-0000-0000-000000000012', code: 'franchise', label: 'Franchise', isActive: true, createdAt: nowIso, updatedAt: nowIso }
];

const fallbackFlags: FlagSetting[] = [
  { id: '00000000-0000-0000-0000-000000000021', code: 'vip', label: 'VIP', colorHex: '#0ea5e9', isActive: true, createdAt: nowIso, updatedAt: nowIso }
];

const fallbackMachineCategories: MachineCategorySetting[] = [
  { id: '00000000-0000-0000-0000-000000000031', code: 'coffee', label: 'Machines à café', isActive: true, createdAt: nowIso, updatedAt: nowIso }
];

const fallbackMachineTypes: MachineTypeSetting[] = [
  {
    id: '00000000-0000-0000-0000-000000000041',
    machineCategoryId: fallbackMachineCategories[0].id,
    code: 'coffee_beans',
    label: 'Café grains',
    requiresFilterChange: true,
    filterLifespanDays: 90,
    isActive: true,
    createdAt: nowIso,
    updatedAt: nowIso
  }
];

const fallbackNotificationRules: NotificationRuleSetting[] = [
  { id: '00000000-0000-0000-0000-000000000051', code: 'contract_end_6m', label: 'Fin de contrat à 6 mois', daysBeforeDue: 180, notificationType: 'contract_end', isActive: true, createdAt: nowIso, updatedAt: nowIso },
  { id: '00000000-0000-0000-0000-000000000052', code: 'contract_end_3m', label: 'Fin de contrat à 3 mois', daysBeforeDue: 90, notificationType: 'contract_end', isActive: true, createdAt: nowIso, updatedAt: nowIso },
  { id: '00000000-0000-0000-0000-000000000053', code: 'contract_end_1m', label: 'Fin de contrat à 1 mois', daysBeforeDue: 30, notificationType: 'contract_end', isActive: true, createdAt: nowIso, updatedAt: nowIso },
  { id: '00000000-0000-0000-0000-000000000054', code: 'filter_change_due', label: 'Changement filtre à échéance', daysBeforeDue: 0, notificationType: 'filter_change', isActive: true, createdAt: nowIso, updatedAt: nowIso },
  { id: '00000000-0000-0000-0000-000000000055', code: 'filter_change_30d', label: 'Changement filtre dans 30 jours', daysBeforeDue: 30, notificationType: 'filter_change', isActive: true, createdAt: nowIso, updatedAt: nowIso }
];

export const requiredNotificationRules = fallbackNotificationRules.map((rule) => ({
  code: rule.code,
  label: rule.label,
  daysBeforeDue: rule.daysBeforeDue,
  notificationType: rule.notificationType
}));

export const getClientCategories = cache(async (): Promise<ClientCategorySetting[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('client_categories').select('*').order('label', { ascending: true });

  if (error || !data) {
    return fallbackClientCategories;
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

export const getFlags = cache(async (): Promise<FlagSetting[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('flag_definitions').select('*').order('label', { ascending: true });

  if (error || !data) {
    return fallbackFlags;
  }

  return data.map((item) => ({
    id: item.id,
    code: item.code,
    label: item.label,
    colorHex: item.color_hex,
    isActive: item.is_active ?? true,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }));
});

export const getMachineCategories = cache(async (): Promise<MachineCategorySetting[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('machine_categories').select('*').order('label', { ascending: true });

  if (error || !data) {
    return fallbackMachineCategories;
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

export const getMachineTypes = cache(async (): Promise<MachineTypeSetting[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('machine_types').select('*').order('label', { ascending: true });

  if (error || !data) {
    return fallbackMachineTypes;
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

export const getNotificationRules = cache(async (): Promise<NotificationRuleSetting[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('notification_rules').select('*').order('days_before_due', { ascending: false });

  if (error || !data) {
    return fallbackNotificationRules;
  }

  return data.map((item) => ({
    id: item.id,
    code: item.code,
    label: item.label,
    daysBeforeDue: item.days_before_due,
    notificationType: item.code.startsWith('contract_end') ? 'contract_end' : 'filter_change',
    isActive: item.is_active ?? true,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  } as NotificationRuleSetting));
});
