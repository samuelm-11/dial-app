import { PageContainer } from '@/components/layout/page-container';
import { logoutAction } from '@/features/auth/actions/auth-actions';
import { UserRoleBadge } from '@/features/users/components/user-role-badge';
import { getMyAccountSummary } from '@/features/users/queries';
import { requireAuth } from '@/lib/auth/guards';

export default async function AccountPage() {
  await requireAuth();
  const account = await getMyAccountSummary();

  if (!account) {
    return (
      <PageContainer title="Mon compte">
        <p className="rounded border border-dashed p-6 text-sm text-slate-500">Impossible de charger le compte utilisateur.</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Mon compte">
      <div className="max-w-2xl space-y-4">
        <div className="rounded border border-slate-200 bg-white p-4">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-slate-500">Nom</dt>
              <dd className="font-medium text-slate-900">{account.fullName ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium text-slate-900">{account.email}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Rôle</dt>
              <dd className="pt-1">
                <UserRoleBadge role={account.role} />
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Statut</dt>
              <dd>
                <span className={`rounded px-2 py-1 text-xs ${account.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                  {account.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-wrap gap-2">
          <form action={logoutAction}>
            <button type="submit" className="rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100">
              Se déconnecter
            </button>
          </form>
          <button type="button" disabled className="rounded border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500">
            Changer le mot de passe (bientôt)
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
