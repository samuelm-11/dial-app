import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { opportunityFilterSchema } from '@/features/opportunities/schemas';
import type { Opportunity, OpportunityFilterInput } from '@/types/opportunity';

function toClientFlagCode(value: string | null | undefined): Opportunity['clientFlag'] {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'vip' || normalized === 'risk' || normalized === 'watch' || normalized === 'none') {
    return normalized;
  }
  return null;
}

function mapOpportunityRow(row: Record<string, any>): Opportunity {
  const client = Array.isArray(row.clients) ? row.clients[0] : row.clients;
  const flag = Array.isArray(client?.flag_definitions) ? client.flag_definitions[0] : client?.flag_definitions;
  const machineCategory = Array.isArray(row.machine_categories) ? row.machine_categories[0] : row.machine_categories;

  return {
    id: row.id,
    clientId: row.client_id,
    clientName: client?.name ?? 'Client',
    title: row.title,
    description: row.description ?? null,
    linkedMachineCategoryId: row.related_machine_category_id ?? null,
    linkedMachineCategoryLabel: machineCategory?.name ?? null,
    priority: row.priority,
    status: row.status,
    estimatedValue: row.estimated_value ?? null,
    probability: row.probability ?? null,
    clientPostalCode: client?.postal_code ?? null,
    clientFlag: toClientFlagCode(flag?.code),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function filterOpportunities(opportunities: Opportunity[], filters: OpportunityFilterInput): Opportunity[] {
  return opportunities.filter((opportunity) => {
    if (filters.statuses?.length && !filters.statuses.includes(opportunity.status)) {
      return false;
    }

    if (filters.priorities?.length && !filters.priorities.includes(opportunity.priority)) {
      return false;
    }

    if (filters.linkedMachineCategoryIds?.length) {
      if (!opportunity.linkedMachineCategoryId || !filters.linkedMachineCategoryIds.includes(opportunity.linkedMachineCategoryId)) {
        return false;
      }
    }

    if (filters.clientId && opportunity.clientId !== filters.clientId) {
      return false;
    }

    if (filters.postalCode && !(opportunity.clientPostalCode ?? '').includes(filters.postalCode)) {
      return false;
    }

    if (filters.clientFlags?.length && (!opportunity.clientFlag || !filters.clientFlags.includes(opportunity.clientFlag))) {
      return false;
    }

    if (filters.estimatedValueMin !== undefined && (opportunity.estimatedValue ?? 0) < filters.estimatedValueMin) {
      return false;
    }

    if (filters.estimatedValueMax !== undefined && (opportunity.estimatedValue ?? Number.MAX_SAFE_INTEGER) > filters.estimatedValueMax) {
      return false;
    }

    if (filters.probabilityMin !== undefined && (opportunity.probability ?? 0) < filters.probabilityMin) {
      return false;
    }

    if (filters.probabilityMax !== undefined && (opportunity.probability ?? 100) > filters.probabilityMax) {
      return false;
    }

    return true;
  });
}

export const getOpportunities = cache(async (filters: OpportunityFilterInput = {}): Promise<Opportunity[]> => {
  const parsedFilters = opportunityFilterSchema.safeParse(filters);
  const payload = parsedFilters.success ? parsedFilters.data : {};
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('client_opportunities')
    .select('*, clients(name, postal_code, flag_definitions(code)), machine_categories(name)')
    .order('updated_at', { ascending: false });

  const source = error || !Array.isArray(data) ? [] : data.map((row) => mapOpportunityRow(row as Record<string, any>));
  return filterOpportunities(source, payload);
});

export const getClientOpportunities = cache(async (clientId: string): Promise<Opportunity[]> => {
  const opportunities = await getOpportunities({ clientId });
  return opportunities;
});
