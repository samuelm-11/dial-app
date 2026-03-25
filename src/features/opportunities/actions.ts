'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { opportunityFormSchema, opportunityUpdateSchema } from '@/features/opportunities/schemas';
import type { CreateOpportunityInput, OpportunityStatus, UpdateOpportunityInput } from '@/types/opportunity';

export async function createOpportunity(input: CreateOpportunityInput) {
  const payload = opportunityFormSchema.parse(input);
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('opportunities').insert({
    client_id: payload.clientId,
    title: payload.title,
    description: payload.description ?? null,
    linked_machine_category_id: payload.linkedMachineCategoryId ?? null,
    priority: payload.priority,
    status: payload.status,
    estimated_value: payload.estimatedValue ?? null,
    probability: payload.probability ?? null
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
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('opportunities')
    .update({
      title: payload.title,
      description: payload.description,
      linked_machine_category_id: payload.linkedMachineCategoryId,
      priority: payload.priority,
      status: payload.status,
      estimated_value: payload.estimatedValue,
      probability: payload.probability
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
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('opportunities').delete().eq('id', opportunityId).eq('client_id', clientId);

  if (error) {
    throw new Error(`Erreur suppression opportunité: ${error.message}`);
  }

  revalidatePath('/opportunities');
  revalidatePath(`/clients/${clientId}`);
  revalidatePath('/dashboard');
}

export async function updateOpportunityStatus(clientId: string, opportunityId: string, status: OpportunityStatus) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('opportunities')
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
