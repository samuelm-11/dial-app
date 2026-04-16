import { PageContainer } from '@/components/layout/page-container';
import { getClientParentOptions } from '@/features/clients/queries';
import { getMachineCategories } from '@/features/machines/queries';
import { OpportunityFilters, getOpportunityFiltersFromSearchParams } from '@/features/opportunities/components/opportunity-filters';
import { OpportunityTable } from '@/features/opportunities/components/opportunity-table';
import { getOpportunities } from '@/features/opportunities/queries';

export default async function OpportunitiesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = getOpportunityFiltersFromSearchParams(resolvedSearchParams);
  const [opportunities, clients, machineCategories] = await Promise.all([getOpportunities(filters), getClientParentOptions(), getMachineCategories()]);
  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
  const safeClients = Array.isArray(clients) ? clients : [];
  const safeMachineCategories = Array.isArray(machineCategories) ? machineCategories : [];

  return (
    <PageContainer title="Prospection">
      <div className="space-y-4">
        <OpportunityFilters clients={safeClients} machineCategories={safeMachineCategories.map((item) => ({ id: item.id, label: item.label }))} />
        <OpportunityTable opportunities={safeOpportunities} />
      </div>
    </PageContainer>
  );
}
