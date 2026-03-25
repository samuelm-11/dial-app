import { PageContainer } from '@/components/layout/page-container';
import { PlaceholderState } from '@/components/ui/placeholder-state';

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PageContainer title={`Modifier client ${id}`}>
      <PlaceholderState message="Édition client à implémenter avec validation Zod." />
    </PageContainer>
  );
}
