'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import type { UserProfile } from '@/types/auth';

export function AppShell({ profile, children }: { profile: UserProfile; children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background">
      <AppSidebar isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={() => setIsMobileMenuOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader profile={profile} onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="min-w-0 flex-1 px-2 pb-6 pt-3 sm:px-4 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
