import { PageContainer } from '@/components/layout/page-container';
import { PlaceholderState } from '@/components/ui/placeholder-state';

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PageContainer title={`Client ${id}`}>
      <PlaceholderState message="Détail client avec contrats, machines et contacts à implémenter." />
    </PageContainer>
  );
}
