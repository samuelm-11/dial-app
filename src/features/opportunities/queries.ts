import { cache } from 'react';
import { createSupabaseServerComponentClient } from '@/lib/supabase/server';
import { opportunityFilterSchema } from '@/features/opportunities/schemas';
import type { CompetitorCategory, Opportunity, OpportunityFilterInput } from '@/types/opportunity';

function toClientFlagCode(value: string | null | undefined): Opportunity['clientFlag'] {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'vip' || normalized === 'risk' || normalized === 'watch' || normalized === 'none') {
    return normalized;
  }
  return null;
}

function toCompetitorCategory(value: string | null | undefined): CompetitorCategory | null {
  if (value === 'hot_drinks' || value === 'snacking' || value === 'sandwich_catering' || value === 'cold_drinks' || value === 'water_fountain' || value === 'other') {
    return value;
  }
  return null;
}

function toMachineCountsByCategory(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce<Record<string, number>>((accumulator, [key, rawValue]) => {
    const normalizedKey = key.trim();
    const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue);

    if (!normalizedKey || Number.isNaN(numericValue) || numericValue < 0) {
      return accumulator;
    }

    accumulator[normalizedKey] = Math.round(numericValue);
    return accumulator;
  }, {});
}

function mapOpportunityRow(row: Record<string, any>): Opportunity {
  const client = Array.isArray(row.clients) ? row.clients[0] : row.clients;
  const machineCategory = Array.isArray(row.machine_categories) ? row.machine_categories[0] : row.machine_categories;

  return {
    id: row.id,
    clientId: row.client_id ?? null,
    clientName: client?.name ?? null,
    prospectName: row.prospect_name ?? client?.name ?? row.title ?? 'Prospect',
    prospectContactName: row.prospect_contact_name ?? null,
    prospectEmail: row.prospect_email ?? null,
    prospectPhone: row.prospect_phone ?? null,
    prospectAddress: row.prospect_address ?? null,
    prospectPostalCode: row.prospect_postal_code ?? null,
    prospectCity: row.prospect_city ?? null,
    prospectCountry: row.prospect_country ?? null,
    title: row.title,
    description: row.description ?? null,
    linkedMachineCategoryId: row.linked_machine_category_id ?? null,
    linkedMachineCategoryLabel: machineCategory?.label ?? null,
    priority: row.priority,
    status: row.status,
    estimatedValue: row.estimated_value ?? null,
    probability: row.probability ?? null,
    yearlyRevenue: row.yearly_revenue ?? null,
    employeeCount: row.employee_count ?? null,
    totalMachineCount: row.total_machine_count ?? null,
    machineCountsByCategory: toMachineCountsByCategory(row.machine_counts_by_category),
    incumbentCompetitorName: row.incumbent_competitor_name ?? null,
    incumbentCompetitorCategory: toCompetitorCategory(row.incumbent_competitor_category),
    competitorContractEndDate: row.competitor_contract_end_date ?? null,
    notes: row.notes ?? null,
    clientPostalCode: row.prospect_postal_code ?? client?.postal_code ?? null,
    clientFlag: toClientFlagCode(client?.flag),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function filterOpportunities(opportunities: Opportunity[], filters: OpportunityFilterInput): Opportunity[] {
  return opportunities.filter((opportunity) => {
    const query = filters.query?.trim().toLowerCase();

    if (query) {
      const haystack = [
        opportunity.prospectName,
        opportunity.clientName,
        opportunity.prospectContactName,
        opportunity.prospectEmail,
        opportunity.prospectPhone,
        opportunity.title,
        opportunity.description,
        opportunity.prospectCity
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(query)) {
        return false;
      }
    }

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
  const supabase = await createSupabaseServerComponentClient();

  const { data, error } = await supabase
    .from('client_opportunities')
    .select('*, clients(name, postal_code, flag), machine_categories(label)')
    .order('updated_at', { ascending: false });

  const source = error || !Array.isArray(data) ? [] : data.map((row) => mapOpportunityRow(row as Record<string, any>));
  return filterOpportunities(source, payload);
});

export const getClientOpportunities = cache(async (clientId: string): Promise<Opportunity[]> => {
  const opportunities = await getOpportunities({ clientId });
  return opportunities;
});
