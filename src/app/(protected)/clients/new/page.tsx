import { PageContainer } from '@/components/layout/page-container';
import { ClientForm } from '@/features/clients/components/client-form';

export default async function NewClientPage() {
  return (
    <PageContainer title="Nouveau client">
      <ClientForm mode="create" />
    </PageContainer>
  );
}
