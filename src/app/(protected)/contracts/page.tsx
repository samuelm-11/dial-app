import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { ContractFilters } from '@/features/contracts/components/contract-filters';
import { ContractTable } from '@/features/contracts/components/contract-table';
import { getContracts } from '@/features/contracts/queries';
import { getContractFiltersFromSearchParams } from '@/features/contracts/search-params';

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
        <div className="flex flex-wrap gap-2">
          <Link href="/contracts/modeles" className="inline-flex items-center justify-center rounded-xl border border-muted bg-white px-4 py-2.5 text-sm font-medium text-primary hover:bg-slate-50">
            Modèles de contrat
          </Link>
          <Link href="/clients" className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-secondary">
            Générer depuis une fiche client
          </Link>
        </div>
        <ContractFilters />
        <ContractTable contracts={safeContracts} />
      </div>
    </PageContainer>
  );
}
