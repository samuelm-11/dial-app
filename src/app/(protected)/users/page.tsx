import { PageContainer } from '@/components/layout/page-container';
import { PlaceholderState } from '@/components/ui/placeholder-state';
import { UserInviteForm } from '@/features/users/components/user-invite-form';
import { UserTable } from '@/features/users/components/user-table';
import { getUsers } from '@/features/users/queries';
import { requireRole } from '@/lib/auth/guards';

export default async function UsersPage() {
  const profile = await requireRole('admin');
  const users = await getUsers();

  return (
    <PageContainer title="Utilisateurs">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Gestion des accès internes, des rôles et du statut des comptes.</p>
        <UserInviteForm />
        {users.length === 0 ? (
          <PlaceholderState message="Aucun utilisateur enregistré pour le moment." />
        ) : (
          <UserTable users={users} canManage={profile.role === 'admin'} currentUserId={profile.id} />
        )}
      </div>
    </PageContainer>
  );
}
