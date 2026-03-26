import { cache } from 'react';
import type { User } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { UserProfile } from '@/types/auth';

function buildFallbackProfile(user: User): UserProfile {
  const now = new Date().toISOString();

  return {
    id: user.id,
    email: user.email ?? '',
    fullName: (user.user_metadata?.full_name as string | undefined) ?? null,
    role: 'viewer',
    isActive: true,
    createdAt: user.created_at ?? now,
    updatedAt: now
  };
}

export const getSessionUser = cache(async (): Promise<User | null> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  return data.user ?? null;
});

export const getCurrentUserProfile = cache(async (): Promise<UserProfile | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, is_active, created_at, updated_at')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  if (!profile) {
    return buildFallbackProfile(user);
  }

  return {
    id: profile.id,
    email: user.email ?? '',
    fullName: profile.full_name,
    role: profile.role,
    isActive: profile.is_active,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at
  };
});
