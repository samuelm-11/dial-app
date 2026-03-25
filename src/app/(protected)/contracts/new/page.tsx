import { PageContainer } from '@/components/layout/page-container';
import { PlaceholderState } from '@/components/ui/placeholder-state';

export default function NewContractPage() {
  return (
    <PageContainer title="Nouveau contrat">
      <PlaceholderState message="Création de contrat avec gestion de PDF privé à implémenter." />
    </PageContainer>
  );
}
