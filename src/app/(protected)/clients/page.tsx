import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { ClientFilters, getFiltersFromSearchParams } from '@/features/clients/components/client-filters';
import { ClientTable } from '@/features/clients/components/client-table';
import { ClientTreeView } from '@/features/clients/components/client-tree-view';
import { getClientHierarchy, getClients } from '@/features/clients/queries';

export default async function ClientsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = getFiltersFromSearchParams(resolvedSearchParams);
  const view = Array.isArray(resolvedSearchParams.view) ? resolvedSearchParams.view[0] : resolvedSearchParams.view;

  const clients = await getClients(filters);
  const hierarchy = await getClientHierarchy(filters);

  return (
    <PageContainer title="Clients">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <Link href="/clients/new" className="rounded bg-slate-900 px-3 py-2 text-sm text-white">
              Nouveau client
            </Link>
            <button className="rounded border border-slate-300 px-3 py-2 text-sm">Export (placeholder)</button>
          </div>
          <div className="flex gap-2 text-sm">
            <Link href="/clients?view=table" className={`rounded px-3 py-2 ${view !== 'tree' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>
              Vue tableau
            </Link>
            <Link href="/clients?view=tree" className={`rounded px-3 py-2 ${view === 'tree' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>
              Vue arborescente
            </Link>
          </div>
        </div>

        <ClientFilters />
        {view === 'tree' ? <ClientTreeView nodes={hierarchy} /> : <ClientTable clients={clients} />}
      </div>
    </PageContainer>
  );
}
