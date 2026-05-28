import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { ClientForm } from '@/features/clients/components/client-form';
import { getClientById } from '@/features/clients/queries';

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  return (
    <PageContainer title={`Modifier ${client.name}`}>
      <ClientForm
        mode="edit"
        clientId={client.id}
        defaultValues={{
          name: client.name,
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
