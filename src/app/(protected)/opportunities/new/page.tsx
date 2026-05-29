import { PageContainer } from '@/components/layout/page-container';
import { getClientOptions } from '@/features/clients/queries';
import { getMachineCategories } from '@/features/machines/queries';
import { OpportunityForm } from '@/features/opportunities/components/opportunity-form';

export default async function NewOpportunityPage() {
  const [clients, machineCategories] = await Promise.all([getClientOptions(), getMachineCategories()]);
  const safeClients = Array.isArray(clients) ? clients : [];
  const safeMachineCategories = Array.isArray(machineCategories) ? machineCategories : [];

  return (
    <PageContainer title="Nouvelle prospection">
      <OpportunityForm
        clientOptions={safeClients.map((client) => ({ id: client.id, label: client.name }))}
        machineCategoryOptions={safeMachineCategories.map((category) => ({ id: category.id, label: category.label }))}
      />
    </PageContainer>
  );
}
