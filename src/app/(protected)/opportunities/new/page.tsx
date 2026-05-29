import { PageContainer } from '@/components/layout/page-container';
import { getMachineCategories } from '@/features/machines/queries';
import { OpportunityForm } from '@/features/opportunities/components/opportunity-form';

export default async function NewOpportunityPage() {
  const machineCategories = await getMachineCategories();
  const safeMachineCategories = Array.isArray(machineCategories) ? machineCategories : [];

  return (
    <PageContainer title="Nouvelle prospection">
      <OpportunityForm
        machineCategoryOptions={safeMachineCategories.map((category) => ({ id: category.id, label: category.label }))}
      />
    </PageContainer>
  );
}
