'use client';

import { logoutAction } from '@/features/auth/actions/auth-actions';
import type { UserProfile } from '@/types/auth';

export function AppHeader({ profile, onOpenMobileMenu }: { profile: UserProfile; onOpenMobileMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b bg-white px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Ouvrir le menu"
        >
          Menu
        </button>

        <div className="min-w-0">
          <p className="hidden text-sm text-slate-500 sm:block">Connecté en tant que</p>
          <p className="truncate text-sm font-medium sm:text-base">{profile.fullName ?? profile.email}</p>
        </div>
      </div>

      <form action={logoutAction} className="shrink-0">
        <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-slate-100">
          Se déconnecter
        </button>
      </form>
    </header>
  );
}
