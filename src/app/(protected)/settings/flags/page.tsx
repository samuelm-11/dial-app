import { PageContainer } from '@/components/layout/page-container';
import { PlaceholderState } from '@/components/ui/placeholder-state';
import { toggleFlag } from '@/features/settings/actions';
import { FlagForm } from '@/features/settings/components/flag-form';
import { getFlags } from '@/features/settings/queries';
import { requireRole } from '@/lib/auth/guards';

export default async function FlagsPage() {
  await requireRole('manager');
  const flags = await getFlags();

  return (
    <PageContainer title="Flags">
      <div className="space-y-4">
        <FlagForm />
        {flags.length === 0 ? (
          <PlaceholderState message="Aucun flag configuré." />
        ) : (
          <div className="space-y-2">
            {flags.map((flag) => (
              <div key={flag.id} className="space-y-2 rounded border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{flag.label}</p>
                    <p className="text-xs text-slate-500">Code: {flag.code}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded border border-slate-200" style={{ backgroundColor: flag.colorHex }} aria-label={`Couleur ${flag.colorHex}`} />
                    <span className={`rounded px-2 py-1 text-xs ${flag.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                      {flag.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <form action={toggleFlag.bind(null, flag)}>
                      <button className="rounded border border-slate-300 px-3 py-2 text-xs">{flag.isActive ? 'Désactiver' : 'Activer'}</button>
                    </form>
                  </div>
                </div>
                <FlagForm flag={flag} />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
