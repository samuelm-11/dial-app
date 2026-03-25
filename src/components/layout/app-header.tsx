import { logoutAction } from '@/features/auth/actions/auth-actions';
import type { UserProfile } from '@/types/auth';

export function AppHeader({ profile }: { profile: UserProfile }) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-3">
      <div>
        <p className="text-sm text-slate-500">Connecté en tant que</p>
        <p className="font-medium">{profile.fullName ?? profile.email}</p>
      </div>
      <form action={logoutAction}>
        <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-slate-100">
          Se déconnecter
        </button>
      </form>
    </header>
  );
}
