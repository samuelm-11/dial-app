import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { requireRole } from '@/lib/auth/guards';

const settingsLinks = [
  {
    href: '/settings/client-categories',
    title: 'Catégories client',
    description: 'Structure des segments client (parents / sous-clients).'
  },
  {
    href: '/settings/flags',
    title: 'Flags client',
    description: 'Définitions des flags métiers et couleurs de statut.'
  },
  {
    href: '/settings/machine-categories',
    title: 'Catégories machine',
    description: 'Regroupements métiers des familles de machines.'
  },
  {
    href: '/settings/machine-types',
    title: 'Types de machines',
    description: 'Catalogue détaillé des machines et cycles filtres.'
  },
  {
    href: '/settings/notification-rules',
    title: 'Règles de notification',
    description: 'Paramétrage des alertes contractuelles et filtres.'
  }
];

export default async function SettingsPage() {
  await requireRole('manager');

  return (
    <PageContainer title="Paramètres">
      <div className="grid gap-3 md:grid-cols-2">
        {settingsLinks.map((item) => (
          <Link key={item.href} href={item.href} className="rounded border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-1 text-xs text-slate-600">{item.description}</p>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
