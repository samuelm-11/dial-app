import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { ClientHeader } from '@/features/clients/components/client-header';
import { ClientTabs } from '@/features/clients/components/client-tabs';
import { getClientById } from '@/features/clients/queries';
import { getClientMachines, getMachineTypes } from '@/features/machines/queries';

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [client, clientMachines, machineTypes] = await Promise.all([
    getClientById(id),
    getClientMachines(id),
    getMachineTypes()
  ]);

  if (!client) {
    notFound();
  }

  return (
    <PageContainer title="Fiche client">
      <div className="space-y-4">
        <ClientHeader client={client} />
        <ClientTabs client={client} clientMachines={clientMachines} machineTypes={machineTypes} />
      </div>
    </PageContainer>
  );
}
