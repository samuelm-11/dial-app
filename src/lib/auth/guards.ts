import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/auth/session';
import { hasRequiredRole } from '@/lib/auth/roles';
import type { UserProfile, UserRole } from '@/types/auth';

export async function requireAuth(): Promise<UserProfile> {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect('/login');
  }

  if (!profile.isActive) {
    redirect('/login?error=inactive');
  }

  return profile;
}

export async function requireRole(requiredRole: UserRole): Promise<UserProfile> {
  const profile = await requireAuth();

  if (!hasRequiredRole(profile.role, requiredRole)) {
    redirect('/dashboard?error=forbidden');
  }

  return profile;
}
