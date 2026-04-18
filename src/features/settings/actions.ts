'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth/guards';
import { createSupabaseServerActionClient } from '@/lib/supabase/server';
import {
  clientCategorySchema,
  flagSchema,
  machineCategorySchema,
  machineTypeSchema,
  notificationRuleSchema,
  type ClientCategoryValues,
  type FlagValues,
  type MachineCategoryValues,
  type MachineTypeValues,
  type NotificationRuleValues
} from '@/features/settings/schemas';
import { requiredNotificationRules } from '@/features/settings/queries';
import type {
  ClientCategorySetting,
  FlagSetting,
  MachineCategorySetting,
  MachineTypeSetting,
  NotificationRuleSetting
} from '@/types/settings';

async function assertSettingsAccess() {
  await requireRole('manager');
}

export async function upsertClientCategory(categoryId: string | null, input: ClientCategoryValues) {
  await assertSettingsAccess();
  const payload = clientCategorySchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  const updatePayload = { code: payload.code, label: payload.label, is_active: payload.isActive };

  const query = categoryId
    ? supabase.from('client_categories').update(updatePayload).eq('id', categoryId)
    : supabase.from('client_categories').insert(updatePayload);

  const { error } = await query;
  if (error) {
    throw new Error(`Erreur sauvegarde catégorie client: ${error.message}`);
  }

  revalidatePath('/settings/client-categories');
}

export async function toggleClientCategory(category: ClientCategorySetting) {
  await upsertClientCategory(category.id, { code: category.code, label: category.label, isActive: !category.isActive });
}

export async function upsertFlag(flagId: string | null, input: FlagValues) {
  await assertSettingsAccess();
  const payload = flagSchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  const updatePayload = {
    code: payload.code,
    label: payload.label,
    color_hex: payload.colorHex,
    is_active: payload.isActive
  };

  const query = flagId ? supabase.from('flag_definitions').update(updatePayload).eq('id', flagId) : supabase.from('flag_definitions').insert(updatePayload);

  const { error } = await query;
  if (error) {
    throw new Error(`Erreur sauvegarde flag: ${error.message}`);
  }

  revalidatePath('/settings/flags');
}

export async function toggleFlag(flag: FlagSetting) {
  await upsertFlag(flag.id, { code: flag.code, label: flag.label, colorHex: flag.colorHex, isActive: !flag.isActive });
}

export async function upsertMachineCategory(categoryId: string | null, input: MachineCategoryValues) {
  await assertSettingsAccess();
  const payload = machineCategorySchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  const updatePayload = { code: payload.code, label: payload.label, is_active: payload.isActive };

  const query = categoryId
    ? supabase.from('machine_categories').update(updatePayload).eq('id', categoryId)
    : supabase.from('machine_categories').insert(updatePayload);

  const { error } = await query;
  if (error) {
    throw new Error(`Erreur sauvegarde catégorie machine: ${error.message}`);
  }

  revalidatePath('/settings/machine-categories');
  revalidatePath('/settings/machine-types');
}

export async function toggleMachineCategory(category: MachineCategorySetting) {
  await upsertMachineCategory(category.id, { code: category.code, label: category.label, isActive: !category.isActive });
}

export async function upsertMachineType(typeId: string | null, input: MachineTypeValues) {
  await assertSettingsAccess();
  const payload = machineTypeSchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  const updatePayload = {
    machine_category_id: payload.machineCategoryId,
    code: payload.code,
    label: payload.label,
    requires_filter_change: payload.requiresFilterChange,
    filter_lifespan_days: payload.requiresFilterChange ? payload.filterLifespanDays ?? null : null,
    recommended_filter_interval_days: payload.requiresFilterChange ? payload.filterLifespanDays ?? null : null,
    is_active: payload.isActive
  };

  const query = typeId ? supabase.from('machine_types').update(updatePayload).eq('id', typeId) : supabase.from('machine_types').insert(updatePayload);

  const { error } = await query;
  if (error) {
    throw new Error(`Erreur sauvegarde type machine: ${error.message}`);
  }

  revalidatePath('/settings/machine-types');
}

export async function toggleMachineType(machineType: MachineTypeSetting) {
  await upsertMachineType(machineType.id, {
    machineCategoryId: machineType.machineCategoryId,
    code: machineType.code,
    label: machineType.label,
    requiresFilterChange: machineType.requiresFilterChange,
    filterLifespanDays: machineType.filterLifespanDays,
    isActive: !machineType.isActive
  });
}

export async function ensureDefaultNotificationRules() {
  await assertSettingsAccess();
  const supabase = await createSupabaseServerActionClient();

  const { error } = await supabase.from('notification_rules').upsert(
    requiredNotificationRules.map((rule) => ({
      code: rule.code,
      label: rule.label,
      days_before_due: rule.daysBeforeDue,
      is_active: true
    })),
    { onConflict: 'code' }
  );

  if (error) {
    throw new Error(`Erreur initialisation règles de notification: ${error.message}`);
  }

  revalidatePath('/settings/notification-rules');
}

export async function upsertNotificationRule(ruleId: string | null, input: NotificationRuleValues) {
  await assertSettingsAccess();
  const payload = notificationRuleSchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  const updatePayload = {
    code: payload.code,
    label: payload.label,
    days_before_due: payload.daysBeforeDue,
    is_active: payload.isActive
  };

  const query = ruleId
    ? supabase.from('notification_rules').update(updatePayload).eq('id', ruleId)
    : supabase.from('notification_rules').insert(updatePayload);

  const { error } = await query;
  if (error) {
    throw new Error(`Erreur sauvegarde règle de notification: ${error.message}`);
  }

  revalidatePath('/settings/notification-rules');
}

export async function toggleNotificationRule(rule: NotificationRuleSetting) {
  await upsertNotificationRule(rule.id, {
    code: rule.code,
    label: rule.label,
    daysBeforeDue: rule.daysBeforeDue,
    notificationType: rule.notificationType,
    isActive: !rule.isActive
  });
}
