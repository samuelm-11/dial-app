'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DialLogo } from '@/components/branding/dial-logo';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '▦' },
  { href: '/clients', label: 'Clients', icon: '◻' },
  { href: '/opportunities', label: 'Prospection', icon: '◬' },
  { href: '/alerts', label: 'Alertes', icon: '◉' },
  { href: '/interventions', label: 'Interventions', icon: '⚒' },
  { href: '/reassort', label: 'Réassort', icon: '◷' },
  { href: '/imports', label: 'Imports', icon: '↥' },
  { href: '/settings', label: 'Paramètres', icon: '⚙' },
  { href: '/users', label: 'Utilisateurs', icon: '☰' },
  { href: '/account', label: 'Compte', icon: '◌' }
];

function NavLink({ href, label, icon, onClick }: { href: string; label: string; icon: string; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        isActive ? 'bg-white text-primary shadow-sm' : 'text-slate-300 hover:bg-white/10 hover:text-white'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs ${isActive ? 'bg-primary/10 text-primary' : 'bg-white/10 text-slate-300'}`}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}

export function AppSidebar({
  isMobileMenuOpen,
  onCloseMobileMenu
}: {
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}) {
  return (
    <>
      <aside className="hidden w-72 shrink-0 bg-primary p-4 md:block">
        <div className="mb-5 border-b border-white/15 pb-4">
          <DialLogo />
        </div>
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ))}
        </nav>
      </aside>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-200 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onCloseMobileMenu}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-primary p-4 shadow-2xl transition-transform duration-200 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-4">
          <DialLogo compact />
          <button
            type="button"
            className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-slate-100 hover:bg-white/10"
            onClick={onCloseMobileMenu}
          >
            Fermer
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} onClick={onCloseMobileMenu} />
          ))}
        </nav>
      </aside>
    </>
  );
}
