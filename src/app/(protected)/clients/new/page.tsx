import { PageContainer } from '@/components/layout/page-container';
import { ClientForm } from '@/features/clients/components/client-form';
import { getClientParentOptions } from '@/features/clients/queries';

export default async function NewClientPage() {
  const parentOptions = await getClientParentOptions();

  return (
    <PageContainer title="Nouveau client">
      <ClientForm mode="create" parentOptions={parentOptions} />
    </PageContainer>
  );
}
