import { PageContainer } from '@/components/layout/page-container';
import { PlaceholderState } from '@/components/ui/placeholder-state';
import { ensureDefaultNotificationRules, toggleNotificationRule } from '@/features/settings/actions';
import { NotificationRuleForm } from '@/features/settings/components/notification-rule-form';
import { getNotificationRules } from '@/features/settings/queries';
import { requireRole } from '@/lib/auth/guards';

export default async function NotificationRulesPage() {
  await requireRole('manager');
  await ensureDefaultNotificationRules();
  const rules = await getNotificationRules();

  return (
    <PageContainer title="Règles de notification">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Règles attendues: fin de contrat (6 mois, 3 mois, 1 mois) et changement filtre (à échéance, dans 30 jours).
        </p>
        <NotificationRuleForm />
        {rules.length === 0 ? (
          <PlaceholderState message="Aucune règle de notification configurée." />
        ) : (
          <div className="space-y-2">
            {rules.map((rule) => (
              <div key={rule.id} className="space-y-2 rounded border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{rule.label}</p>
                    <p className="text-xs text-slate-500">
                      Code: {rule.code} · Type: {rule.notificationType === 'contract_end' ? 'Fin de contrat' : 'Changement filtre'} · J-{rule.daysBeforeDue}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-2 py-1 text-xs ${rule.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <form action={toggleNotificationRule.bind(null, rule)}>
                      <button className="rounded border border-slate-300 px-3 py-2 text-xs">{rule.isActive ? 'Désactiver' : 'Activer'}</button>
                    </form>
                  </div>
                </div>
                <NotificationRuleForm rule={rule} />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
