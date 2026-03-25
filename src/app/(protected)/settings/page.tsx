import { PageContainer } from '@/components/layout/page-container';
import { PlaceholderState } from '@/components/ui/placeholder-state';

export default function SettingsPage() {
  return (
    <PageContainer title="Paramètres">
      <PlaceholderState message="Configuration référentiels et règles de notifications à implémenter." />
    </PageContainer>
  );
}
