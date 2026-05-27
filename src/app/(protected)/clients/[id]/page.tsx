import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { ClientHeader } from '@/features/clients/components/client-header';
import { ClientTabs } from '@/features/clients/components/client-tabs';
import { getClientById } from '@/features/clients/queries';
import { getClientContracts, getContractTemplates } from '@/features/contracts/queries';
import { getClientMachines, getMachineCategories, getMachineTypes } from '@/features/machines/queries';
import { getClientOpportunities } from '@/features/opportunities/queries';
import { getClientAlerts } from '@/features/alerts/queries';

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [client, clientMachines, machineTypes, contracts, contractTemplates, opportunities, machineCategories, alerts] = await Promise.all([
    getClientById(id),
    getClientMachines(id),
    getMachineTypes(),
    getClientContracts(id),
    getContractTemplates(),
    getClientOpportunities(id),
    getMachineCategories(),
    getClientAlerts(id)
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
          contractTemplates={contractTemplates}
          opportunities={opportunities}
          machineCategoryOptions={machineCategories.map((category) => ({ id: category.id, label: category.label }))}
          alerts={alerts}
        />
      </div>
    </PageContainer>
  );
}
