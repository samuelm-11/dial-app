export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/* import { AppShell } from '@/components/layout/app-shell';
import { requireAuth } from '@/lib/auth/guards';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAuth();

  return <AppShell profile={profile}>{children}</AppShell>;
}
*/
