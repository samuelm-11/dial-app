import { PageContainer } from '@/components/layout/page-container';
import { PlaceholderState } from '@/components/ui/placeholder-state';
import { requireRole } from '@/lib/auth/guards';

export default async function UsersPage() {
  await requireRole('manager');

  return (
    <PageContainer title="Utilisateurs">
      <PlaceholderState message="Administration des utilisateurs et rôles à implémenter." />
    </PageContainer>
  );
}
