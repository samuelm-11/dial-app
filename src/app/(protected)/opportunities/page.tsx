import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { getMachineCategories } from '@/features/machines/queries';
import { OpportunityFilters } from '@/features/opportunities/components/opportunity-filters';
import { OpportunityTable } from '@/features/opportunities/components/opportunity-table';
import { getOpportunities } from '@/features/opportunities/queries';
import { getOpportunityFiltersFromSearchParams } from '@/features/opportunities/search-params';

export default async function OpportunitiesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = getOpportunityFiltersFromSearchParams(resolvedSearchParams);
  const [opportunities, machineCategories] = await Promise.all([getOpportunities(filters), getMachineCategories()]);
  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
  const safeMachineCategories = Array.isArray(machineCategories) ? machineCategories : [];

  return (
    <PageContainer title="Prospection">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Link href="/opportunities/new" className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white">
            Nouvelle prospection
          </Link>
        </div>
        <OpportunityFilters machineCategories={safeMachineCategories.map((item) => ({ id: item.id, label: item.label }))} />
        <OpportunityTable opportunities={safeOpportunities} />
      </div>
    </PageContainer>
  );
}
