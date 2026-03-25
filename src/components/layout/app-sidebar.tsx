import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/clients', label: 'Clients' },
  { href: '/contracts', label: 'Contrats' },
  { href: '/opportunities', label: 'Opportunités' },
  { href: '/alerts', label: 'Alertes' },
  { href: '/imports', label: 'Imports' },
  { href: '/settings', label: 'Paramètres' },
  { href: '/users', label: 'Utilisateurs' },
  { href: '/account', label: 'Compte' }
];

export function AppSidebar() {
  return (
    <aside className="w-64 border-r bg-white p-4">
      <p className="mb-4 text-lg font-semibold">Dial App</p>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded px-3 py-2 text-sm hover:bg-slate-100">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
