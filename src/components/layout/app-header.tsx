'use client';

import { logoutAction } from '@/features/auth/actions/auth-actions';
import type { UserProfile } from '@/types/auth';

export function AppHeader({ profile, onOpenMobileMenu }: { profile: UserProfile; onOpenMobileMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-muted bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-xl border border-muted bg-white px-3 py-2 text-sm font-medium text-primary hover:bg-slate-50 md:hidden"
          aria-label="Ouvrir le menu"
        >
          Menu
        </button>

        <div className="min-w-0">
          <p className="hidden text-xs font-medium uppercase tracking-wide text-slate-500 sm:block">Compte connecté</p>
          <p className="truncate text-sm font-semibold text-primary sm:text-base">{profile.fullName ?? profile.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden rounded-xl border border-muted bg-slate-50 px-3 py-2 text-xs text-slate-600 sm:block">Dial Services Platform</div>
        <form action={logoutAction} className="shrink-0">
          <button type="submit" className="rounded-xl border border-muted px-3 py-2 text-sm font-medium text-primary hover:bg-slate-50">
            Se déconnecter
          </button>
        </form>
      </div>
    </header>
  );
}
