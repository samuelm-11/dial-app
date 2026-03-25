import { PageContainer } from '@/components/layout/page-container';
import { PlaceholderState } from '@/components/ui/placeholder-state';

export default function ClientsPage() {
  return (
    <PageContainer title="Clients">
      <PlaceholderState message="Liste des clients (parents / sous-clients) à implémenter à l'étape suivante." />
    </PageContainer>
  );
}
