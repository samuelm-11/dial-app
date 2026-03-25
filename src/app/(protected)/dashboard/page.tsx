import { PageContainer } from '@/components/layout/page-container';
import { PlaceholderState } from '@/components/ui/placeholder-state';

export default function DashboardPage() {
  return (
    <PageContainer title="Dashboard">
      <PlaceholderState message="Vue d'ensemble métier (KPIs, alertes et opportunités) à implémenter à l'étape 2." />
    </PageContainer>
  );
}
