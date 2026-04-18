'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerActionClient } from '@/lib/supabase/server';
import { opportunityFormSchema, opportunityUpdateSchema } from '@/features/opportunities/schemas';
import type { CreateOpportunityInput, OpportunityStatus, UpdateOpportunityInput } from '@/types/opportunity';

export async function createOpportunity(input: CreateOpportunityInput) {
  const payload = opportunityFormSchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  const { error } = await supabase.from('client_opportunities').insert({
    client_id: payload.clientId,
    title: payload.title,
    description: payload.description ?? null,
    linked_machine_category_id: payload.linkedMachineCategoryId ?? null,
    priority: payload.priority,
    status: payload.status,
    estimated_value: payload.estimatedValue ?? null,
    probability: payload.probability ?? null,
    yearly_revenue: payload.yearlyRevenue ?? null,
    employee_count: payload.employeeCount ?? null,
    total_machine_count: payload.totalMachineCount ?? null,
    machine_counts_by_category: payload.machineCountsByCategory ?? {},
    incumbent_competitor_name: payload.incumbentCompetitorName ?? null,
    incumbent_competitor_category: payload.incumbentCompetitorCategory ?? null,
    competitor_contract_end_date: payload.competitorContractEndDate ?? null,
    notes: payload.notes ?? null
  } as never);

  if (error) {
    throw new Error(`Erreur création opportunité: ${error.message}`);
  }

  revalidatePath('/opportunities');
  revalidatePath(`/clients/${payload.clientId}`);
  revalidatePath('/dashboard');
}

export async function updateOpportunity(clientId: string, opportunityId: string, input: UpdateOpportunityInput) {
  const payload = opportunityUpdateSchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  const { error } = await supabase
    .from('client_opportunities')
    .update({
      title: payload.title,
      description: payload.description,
      linked_machine_category_id: payload.linkedMachineCategoryId,
      priority: payload.priority,
      status: payload.status,
      estimated_value: payload.estimatedValue,
      probability: payload.probability,
      yearly_revenue: payload.yearlyRevenue,
      employee_count: payload.employeeCount,
      total_machine_count: payload.totalMachineCount,
      machine_counts_by_category: payload.machineCountsByCategory,
      incumbent_competitor_name: payload.incumbentCompetitorName,
      incumbent_competitor_category: payload.incumbentCompetitorCategory,
      competitor_contract_end_date: payload.competitorContractEndDate,
      notes: payload.notes
    } as never)
    .eq('id', opportunityId)
    .eq('client_id', clientId);

  if (error) {
    throw new Error(`Erreur mise à jour opportunité: ${error.message}`);
  }

  revalidatePath('/opportunities');
  revalidatePath(`/clients/${clientId}`);
  revalidatePath('/dashboard');
}

export async function deleteOpportunity(clientId: string, opportunityId: string) {
  const supabase = await createSupabaseServerActionClient();

  const { error } = await supabase.from('client_opportunities').delete().eq('id', opportunityId).eq('client_id', clientId);

  if (error) {
    throw new Error(`Erreur suppression opportunité: ${error.message}`);
  }

  revalidatePath('/opportunities');
  revalidatePath(`/clients/${clientId}`);
  revalidatePath('/dashboard');
}

export async function updateOpportunityStatus(clientId: string, opportunityId: string, status: OpportunityStatus) {
  const supabase = await createSupabaseServerActionClient();

  const { error } = await supabase
    .from('client_opportunities')
    .update({ status } as never)
    .eq('id', opportunityId)
    .eq('client_id', clientId);

  if (error) {
    throw new Error(`Erreur changement statut opportunité: ${error.message}`);
  }

  revalidatePath('/opportunities');
  revalidatePath(`/clients/${clientId}`);
  revalidatePath('/dashboard');
}
