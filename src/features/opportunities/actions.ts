'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerActionClient } from '@/lib/supabase/server';
import { opportunityFormSchema, opportunityUpdateSchema } from '@/features/opportunities/schemas';
import type { CreateOpportunityInput, OpportunityStatus, UpdateOpportunityInput } from '@/types/opportunity';

export async function createOpportunity(input: CreateOpportunityInput) {
  const payload = opportunityFormSchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  const { error } = await supabase.from('client_opportunities').insert({
    client_id: payload.clientId ?? null,
    prospect_name: payload.prospectName,
    prospect_contact_name: payload.prospectContactName ?? null,
    prospect_email: payload.prospectEmail ?? null,
    prospect_phone: payload.prospectPhone ?? null,
    prospect_address: payload.prospectAddress ?? null,
    prospect_postal_code: payload.prospectPostalCode ?? null,
    prospect_city: payload.prospectCity ?? null,
    prospect_country: payload.prospectCountry ?? 'Belgique',
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
  if (payload.clientId) {
    revalidatePath(`/clients/${payload.clientId}`);
  }
  revalidatePath('/dashboard');
}

export async function updateOpportunity(opportunityId: string, input: UpdateOpportunityInput) {
  const payload = opportunityUpdateSchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  const { data, error } = await supabase
    .from('client_opportunities')
    .update({
      prospect_name: payload.prospectName,
      prospect_contact_name: payload.prospectContactName,
      prospect_email: payload.prospectEmail,
      prospect_phone: payload.prospectPhone,
      prospect_address: payload.prospectAddress,
      prospect_postal_code: payload.prospectPostalCode,
      prospect_city: payload.prospectCity,
      prospect_country: payload.prospectCountry,
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
    .select('client_id')
    .maybeSingle();

  if (error) {
    throw new Error(`Erreur mise à jour opportunité: ${error.message}`);
  }

  revalidatePath('/opportunities');
  if (data?.client_id) {
    revalidatePath(`/clients/${data.client_id}`);
  }
  revalidatePath('/dashboard');
}

export async function deleteOpportunity(opportunityId: string) {
  const supabase = await createSupabaseServerActionClient();

  const { data: current } = await supabase.from('client_opportunities').select('client_id').eq('id', opportunityId).maybeSingle();
  const { error } = await supabase.from('client_opportunities').delete().eq('id', opportunityId);

  if (error) {
    throw new Error(`Erreur suppression opportunité: ${error.message}`);
  }

  revalidatePath('/opportunities');
  if (current?.client_id) {
    revalidatePath(`/clients/${current.client_id}`);
  }
  revalidatePath('/dashboard');
}

export async function updateOpportunityStatus(opportunityId: string, status: OpportunityStatus) {
  const supabase = await createSupabaseServerActionClient();

  const { data, error } = await supabase
    .from('client_opportunities')
    .update({ status } as never)
    .eq('id', opportunityId)
    .select('client_id')
    .maybeSingle();

  if (error) {
    throw new Error(`Erreur changement statut opportunité: ${error.message}`);
  }

  revalidatePath('/opportunities');
  if (data?.client_id) {
    revalidatePath(`/clients/${data.client_id}`);
  }
  revalidatePath('/dashboard');
}

export async function convertOpportunityToClient(opportunityId: string) {
  const supabase = await createSupabaseServerActionClient();

  const { data: opportunity, error: opportunityError } = await supabase
    .from('client_opportunities')
    .select(
      'id, client_id, prospect_name, prospect_address, prospect_postal_code, prospect_city, prospect_country, description, notes, title'
    )
    .eq('id', opportunityId)
    .maybeSingle();

  if (opportunityError || !opportunity) {
    throw new Error(`Prospection introuvable${opportunityError ? `: ${opportunityError.message}` : '.'}`);
  }

  if (opportunity.client_id) {
    revalidatePath(`/clients/${opportunity.client_id}`);
    return opportunity.client_id as string;
  }

  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert({
      name: opportunity.prospect_name ?? opportunity.title ?? 'Nouveau client',
      category: 'sme',
      flag: 'none',
      address: opportunity.prospect_address ?? '-',
      postal_code: opportunity.prospect_postal_code ?? '0000',
      city: opportunity.prospect_city ?? '-',
      country: opportunity.prospect_country ?? 'Belgique',
      improvement_notes: opportunity.description ?? null,
      internal_notes: opportunity.notes ? `Créé depuis la prospection. ${opportunity.notes}` : 'Créé depuis la prospection.'
    } as never)
    .select('id')
    .single();

  if (clientError || !client?.id) {
    throw new Error(`Erreur création client depuis prospection: ${clientError?.message ?? 'client non créé'}`);
  }

  const { error: updateError } = await supabase
    .from('client_opportunities')
    .update({ client_id: client.id, status: 'won' } as never)
    .eq('id', opportunityId);

  if (updateError) {
    throw new Error(`Client créé, mais rattachement prospection échoué: ${updateError.message}`);
  }

  revalidatePath('/clients');
  revalidatePath(`/clients/${client.id}`);
  revalidatePath('/opportunities');
  revalidatePath('/dashboard');

  return client.id as string;
}
