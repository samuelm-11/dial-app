import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { ClientHeader } from '@/features/clients/components/client-header';
import { ClientTabs } from '@/features/clients/components/client-tabs';
import { getClientById } from '@/features/clients/queries';
import { getClientContracts } from '@/features/contracts/queries';
import { getClientMachines, getMachineCategories, getMachineTypes } from '@/features/machines/queries';
import { getClientOpportunities } from '@/features/opportunities/queries';

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [client, clientMachines, machineTypes, contracts, opportunities, machineCategories] = await Promise.all([
    getClientById(id),
    getClientMachines(id),
    getMachineTypes(),
    getClientContracts(id),
    getClientOpportunities(id),
    getMachineCategories()
  ]);

  if (!client) {
    notFound();
  }

  return (
    <PageContainer title="Fiche client">
      <div className="space-y-4">
        <ClientHeader client={client} />
        <ClientTabs
          client={client}
          clientMachines={clientMachines}
          machineTypes={machineTypes}
          contracts={contracts}
          opportunities={opportunities}
          machineCategoryOptions={machineCategories.map((category) => ({ id: category.id, label: category.label }))}
        />
      </div>
    </PageContainer>
  );
}
