import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import type { UserProfile } from '@/types/auth';

export function AppShell({ profile, children }: { profile: UserProfile; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader profile={profile} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
