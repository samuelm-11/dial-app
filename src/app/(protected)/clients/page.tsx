import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { ClientFilters, getFiltersFromSearchParams } from '@/features/clients/components/client-filters';
import { ClientTable } from '@/features/clients/components/client-table';
import { ClientTreeView } from '@/features/clients/components/client-tree-view';
import { getClientHierarchy, getClients } from '@/features/clients/queries';
import { getMachineCategories, getMachineTypes } from '@/features/machines/queries';

export default async function ClientsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = getFiltersFromSearchParams(resolvedSearchParams);
  const view = Array.isArray(resolvedSearchParams.view) ? resolvedSearchParams.view[0] : resolvedSearchParams.view;

  const [clients, hierarchy, machineCategories, machineTypes] = await Promise.all([
    getClients(filters),
    getClientHierarchy(filters),
    getMachineCategories(),
    getMachineTypes()
  ]);
  const safeClients = Array.isArray(clients) ? clients : [];
  const safeHierarchy = Array.isArray(hierarchy) ? hierarchy : [];
  const safeMachineCategories = Array.isArray(machineCategories) ? machineCategories : [];
  const safeMachineTypes = Array.isArray(machineTypes) ? machineTypes : [];

  return (
    <PageContainer title="Clients">
      <div className="space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/clients/new" className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-secondary">
              Nouveau client
            </Link>
            <Button className="w-full sm:w-auto">
              Export (placeholder)
              {/* TODO(step-imports): remplacer par export CSV/Excel piloté par les filtres actifs. */}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm sm:flex">
            <Link
              href="/clients?view=table"
              className={`rounded-xl px-4 py-2 text-center font-medium ${
                view !== 'tree' ? 'bg-primary text-white' : 'border border-muted bg-white text-primary'
              }`}
            >
              Vue tableau
            </Link>
            <Link
              href="/clients?view=tree"
              className={`rounded-xl px-4 py-2 text-center font-medium ${
                view === 'tree' ? 'bg-primary text-white' : 'border border-muted bg-white text-primary'
              }`}
            >
              Vue arborescente
            </Link>
          </div>
        </div>

        <ClientFilters machineCategories={safeMachineCategories} machineTypes={safeMachineTypes} />
        {view === 'tree' ? <ClientTreeView nodes={safeHierarchy} /> : <ClientTable clients={safeClients} />}
      </div>
    </PageContainer>
  );
}
