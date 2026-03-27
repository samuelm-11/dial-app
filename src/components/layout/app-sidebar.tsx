'use client';

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

export function AppSidebar({
  isMobileMenuOpen,
  onCloseMobileMenu
}: {
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r bg-white p-4 md:block">
        <p className="mb-4 text-lg font-semibold">Dial App</p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded px-3 py-2 text-sm hover:bg-slate-100">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/45 transition-opacity duration-200 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onCloseMobileMenu}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r bg-white p-4 shadow-xl transition-transform duration-200 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-lg font-semibold">Dial App</p>
          <button
            type="button"
            className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
            onClick={onCloseMobileMenu}
          >
            Fermer
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobileMenu}
              className="block rounded px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
