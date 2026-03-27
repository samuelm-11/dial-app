import { PageContainer } from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
        <p className="rounded-2xl border border-dashed p-6 text-sm text-slate-500">Impossible de charger le compte utilisateur.</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Mon compte">
      <div className="mx-auto w-full max-w-3xl space-y-5">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Profil utilisateur</CardTitle>
              <CardDescription>Informations liées à votre accès à la plateforme Dial Services.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <UserRoleBadge role={account.role} />
              <Badge label={account.status === 'active' ? 'Actif' : 'Inactif'} tone={account.status === 'active' ? 'success' : 'neutral'} />
            </div>
          </CardHeader>

          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-muted bg-slate-50 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Nom</dt>
              <dd className="mt-1 break-words text-base font-semibold text-primary">{account.fullName ?? '—'}</dd>
            </div>
            <div className="rounded-xl border border-muted bg-slate-50 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Email</dt>
              <dd className="mt-1 break-all text-base font-semibold text-primary">{account.email}</dd>
            </div>
          </dl>
        </Card>

        <div className="flex flex-col gap-2 sm:flex-row">
          <form action={logoutAction} className="w-full sm:w-auto">
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              Se déconnecter
            </Button>
          </form>
          <Button type="button" disabled variant="ghost" className="w-full border border-dashed border-muted text-slate-500 sm:w-auto">
            Changer le mot de passe (bientôt)
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
