import { PageContainer } from '@/components/layout/page-container';
import { ContractFilters, getContractFiltersFromSearchParams } from '@/features/contracts/components/contract-filters';
import { ContractTable } from '@/features/contracts/components/contract-table';
import { getContracts } from '@/features/contracts/queries';

export default async function ContractsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = getContractFiltersFromSearchParams(resolvedSearchParams);
  const contracts = await getContracts(filters);
  const safeContracts = Array.isArray(contracts) ? contracts : [];

  return (
    <PageContainer title="Contrats">
      <div className="space-y-4">
        <ContractFilters />
        <ContractTable contracts={safeContracts} />
      </div>
    </PageContainer>
  );
}
