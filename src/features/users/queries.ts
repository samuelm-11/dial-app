import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUserProfile } from '@/lib/auth/session';
import type { UserAccountSummary, UserListItem } from '@/types/user';

const nowIso = new Date().toISOString();

const fallbackUsers: UserListItem[] = [
  {
    id: '00000000-0000-0000-0000-000000001001',
    fullName: 'Administrateur Demo',
    email: 'admin@dial-app.local',
    role: 'admin',
    isActive: true,
    createdAt: nowIso,
    updatedAt: nowIso
  }
];

export const getUsers = cache(async (): Promise<UserListItem[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, is_active, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error || !data) {
    return fallbackUsers;
  }

  return data.map((user) => ({
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    role: user.role,
    isActive: user.is_active,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  }));
});

export const getMyAccountSummary = cache(async (): Promise<UserAccountSummary | null> => {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    role: profile.role,
    status: profile.isActive ? 'active' : 'inactive'
  };
});
