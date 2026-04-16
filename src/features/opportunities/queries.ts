import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { opportunityFilterSchema } from '@/features/opportunities/schemas';
import type { Opportunity, OpportunityFilterInput } from '@/types/opportunity';

const mockOpportunities: Opportunity[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    clientId: '3f2d8635-a2d7-40ec-a4a2-25d0f4791fbb',
    clientName: 'Groupe Atlantique Distribution',
    title: 'Renouvellement parc boissons chaudes',
    description: 'Proposition de remplacement de 10 machines T1.',
    linkedMachineCategoryId: '00000000-0000-0000-0000-000000000001',
    linkedMachineCategoryLabel: 'Boisson chaude',
    priority: 'high',
    status: 'proposal',
    estimatedValue: 25000,
    probability: 65,
    clientPostalCode: '44000',
    clientFlag: 'vip',
    createdAt: '2026-01-12T10:00:00.000Z',
    updatedAt: '2026-03-10T09:30:00.000Z'
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    clientId: 'a82f9f13-f2de-47e2-b9c8-7e8f4fef5898',
    clientName: 'Atlantique Distribution - Site Angers',
    title: 'Ajout distributeurs snacks',
    description: null,
    linkedMachineCategoryId: '00000000-0000-0000-0000-000000000002',
    linkedMachineCategoryLabel: 'Confiserie',
    priority: 'medium',
    status: 'open',
    estimatedValue: 8000,
    probability: 45,
    clientPostalCode: '49000',
    clientFlag: 'watch',
    createdAt: '2026-02-18T14:30:00.000Z',
    updatedAt: '2026-02-18T14:30:00.000Z'
  }
];

function mapOpportunityRow(row: Record<string, any>): Opportunity {
  const client = Array.isArray(row.clients) ? row.clients[0] : row.clients;
  const firstClientFlag = Array.isArray(client?.client_flags) ? client.client_flags[0] : null;
  const flagCode = firstClientFlag?.flag_definitions?.code ?? null;

  return {
    id: row.id,
    clientId: row.client_id,
    clientName: client?.name ?? 'Client',
    title: row.title,
    description: row.description ?? null,
    linkedMachineCategoryId: row.linked_machine_category_id ?? null,
    linkedMachineCategoryLabel: row.linked_machine_category_label ?? null,
    priority: row.priority ?? 'medium',
    status: row.status ?? 'open',
    estimatedValue: row.estimated_value ?? row.amount ?? null,
    probability: row.probability ?? null,
    clientPostalCode: client?.postal_code ?? null,
    clientFlag: ['vip', 'risk', 'watch', 'none'].includes(flagCode) ? flagCode : null,
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
    .select('id, client_id, title, amount, status, expected_close_date, created_at, updated_at, clients(name, client_flags(flag_definitions(code)))')
    .order('updated_at', { ascending: false });

  const source = error || !Array.isArray(data) ? mockOpportunities : data.map((row) => mapOpportunityRow(row as Record<string, any>));
  return filterOpportunities(source, payload);
});

export const getClientOpportunities = cache(async (clientId: string): Promise<Opportunity[]> => {
  const opportunities = await getOpportunities({ clientId });
  return opportunities;
});
