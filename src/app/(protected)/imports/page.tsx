import { PageContainer } from '@/components/layout/page-container';
import { ImportWorkflow } from '@/features/imports/components/import-workflow';

export default function ImportsPage() {
  return (
    <PageContainer title="Imports">
      <ImportWorkflow />
    </PageContainer>
  );
}
