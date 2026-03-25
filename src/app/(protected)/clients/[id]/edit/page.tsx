import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { ClientForm } from '@/features/clients/components/client-form';
import { getClientById, getClientParentOptions } from '@/features/clients/queries';

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [client, parentOptions] = await Promise.all([getClientById(id), getClientParentOptions()]);

  if (!client) {
    notFound();
  }

  return (
    <PageContainer title={`Modifier ${client.name}`}>
      <ClientForm
        mode="edit"
        clientId={client.id}
        parentOptions={parentOptions.filter((option) => option.id !== client.id)}
        defaultValues={{
          name: client.name,
          parentClientId: client.parentClientId,
          category: client.category,
          flag: client.flag,
          address: client.address,
          postalCode: client.postalCode,
          city: client.city,
          country: client.country,
          installationDate: client.installationDate,
          improvementNotes: client.improvementNotes,
          internalNotes: client.internalNotes
        }}
      />
    </PageContainer>
  );
}
