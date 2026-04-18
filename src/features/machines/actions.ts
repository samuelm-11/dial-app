'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerActionClient } from '@/lib/supabase/server';
import { createClientMachineSchema, machineCategorySchema, machineTypeSchema, updateClientMachineSchema } from '@/features/machines/schemas';
import type { CreateClientMachineInput, MachineCategory, MachineType, UpdateClientMachineInput } from '@/types/machine';

export async function createClientMachine(clientId: string, input: CreateClientMachineInput) {
  const payload = createClientMachineSchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  const { data: machineType } = await supabase
    .from('machine_types')
    .select('filter_lifespan_days, recommended_filter_interval_days')
    .eq('id', payload.machineTypeId)
    .maybeSingle();

  const { error } = await supabase.from('client_machines').insert({
    client_id: clientId,
    machine_type_id: payload.machineTypeId,
    quantity: payload.quantity,
    installation_date: payload.installationDate,
    status: payload.status ?? 'active',
    last_filter_change_date: payload.lastFilterChangeDate,
    filter_interval_days: machineType?.filter_lifespan_days ?? machineType?.recommended_filter_interval_days ?? null,
    notes: payload.notes
  });

  if (error) {
    throw new Error(`Erreur création machine: ${error.message}`);
  }

  revalidatePath(`/clients/${clientId}`);
}

export async function updateClientMachine(clientId: string, machineId: string, input: UpdateClientMachineInput) {
  const payload = updateClientMachineSchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  const { error } = await supabase
    .from('client_machines')
    .update({
      machine_type_id: payload.machineTypeId,
      quantity: payload.quantity,
      installation_date: payload.installationDate,
      status: payload.status,
      last_filter_change_date: payload.lastFilterChangeDate,
      notes: payload.notes
    })
    .eq('id', machineId)
    .eq('client_id', clientId);

  if (error) {
    throw new Error(`Erreur mise à jour machine: ${error.message}`);
  }

  revalidatePath(`/clients/${clientId}`);
}

export async function markFilterChanged(clientId: string, machineId: string) {
  const supabase = await createSupabaseServerActionClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('client_machines')
    .update({ last_filter_change_date: today })
    .eq('id', machineId)
    .eq('client_id', clientId)
    .select('id, last_filter_change_date, next_filter_change_date')
    .single();

  if (error) {
    throw new Error(`Erreur changement filtre: ${error.message}`);
  }

  revalidatePath(`/clients/${clientId}`);

  return {
    id: data.id,
    lastFilterChangeDate: data.last_filter_change_date as string | null,
    nextFilterChangeDate: data.next_filter_change_date as string | null
  };
}

export async function removeClientMachine(clientId: string, machineId: string) {
  const supabase = await createSupabaseServerActionClient();
  const { error } = await supabase.from('client_machines').delete().eq('id', machineId).eq('client_id', clientId);

  if (error) {
    throw new Error(`Erreur suppression machine: ${error.message}`);
  }

  revalidatePath(`/clients/${clientId}`);
}

export async function upsertMachineCategory(categoryId: string | null, input: { code: string; label: string; isActive?: boolean }) {
  const payload = machineCategorySchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  if (categoryId) {
    const { error } = await supabase
      .from('machine_categories')
      .update({ code: payload.code, label: payload.label, is_active: payload.isActive ?? true })
      .eq('id', categoryId);

    if (error) {
      throw new Error(`Erreur mise à jour catégorie machine: ${error.message}`);
    }
  } else {
    const { error } = await supabase.from('machine_categories').insert({
      code: payload.code,
      label: payload.label,
      is_active: payload.isActive ?? true
    });

    if (error) {
      throw new Error(`Erreur création catégorie machine: ${error.message}`);
    }
  }

  revalidatePath('/settings/machine-categories');
}

export async function toggleMachineCategory(category: MachineCategory) {
  await upsertMachineCategory(category.id, { code: category.code, label: category.label, isActive: !category.isActive });
}

export async function upsertMachineType(
  typeId: string | null,
  input: {
    machineCategoryId: string;
    code: string;
    label: string;
    requiresFilterChange: boolean;
    filterLifespanDays?: number | null;
    isActive?: boolean;
  }
) {
  const payload = machineTypeSchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  const updatePayload = {
    machine_category_id: payload.machineCategoryId,
    code: payload.code,
    label: payload.label,
    requires_filter_change: payload.requiresFilterChange,
    filter_lifespan_days: payload.requiresFilterChange ? payload.filterLifespanDays ?? null : null,
    recommended_filter_interval_days: payload.requiresFilterChange ? payload.filterLifespanDays ?? null : null,
    is_active: payload.isActive ?? true
  };

  if (typeId) {
    const { error } = await supabase.from('machine_types').update(updatePayload).eq('id', typeId);
    if (error) {
      throw new Error(`Erreur mise à jour type machine: ${error.message}`);
    }
  } else {
    const { error } = await supabase.from('machine_types').insert(updatePayload);
    if (error) {
      throw new Error(`Erreur création type machine: ${error.message}`);
    }
  }

  revalidatePath('/settings/machine-types');
}

export async function toggleMachineType(machineType: MachineType) {
  await upsertMachineType(machineType.id, {
    machineCategoryId: machineType.machineCategoryId,
    code: machineType.code,
    label: machineType.label,
    requiresFilterChange: machineType.requiresFilterChange,
    filterLifespanDays: machineType.filterLifespanDays,
    isActive: !machineType.isActive
  });
}
