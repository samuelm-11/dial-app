import { PageContainer } from '@/components/layout/page-container';
import { StatePanel } from '@/components/ui/state-panel';

export default function ProtectedLoading() {
  return (
    <PageContainer title="Chargement">
      <StatePanel message="Chargement des données en cours..." variant="loading" />
    </PageContainer>
  );
}
