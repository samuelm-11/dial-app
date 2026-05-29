import { cache } from 'react';
import type { User } from '@supabase/auth-js';
import { createSupabaseServerComponentClient } from '@/lib/supabase/server';
import type { UserProfile } from '@/types/auth';

export const getSessionUser = cache(async (): Promise<User | null> => {
  const supabase = await createSupabaseServerComponentClient();
  const { data } = await supabase.auth.getUser();

  return data.user ?? null;
});

export const getCurrentUserProfile = cache(async (): Promise<UserProfile | null> => {
  const supabase = await createSupabaseServerComponentClient();
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
    const { error: upsertError } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        email: user.email ?? '',
        full_name: (user.user_metadata?.full_name as string | undefined) ?? null
      },
      { onConflict: 'id' }
    );

    if (upsertError) {
      console.error('Error creating missing profile:', upsertError);
      return null;
    }

    const { data: createdProfile, error: createdProfileError } = await supabase
      .from('profiles')
      .select('id, full_name, role, is_active, created_at, updated_at')
      .eq('id', user.id)
      .maybeSingle();

    if (createdProfileError || !createdProfile) {
      console.error('Error fetching created profile:', createdProfileError);
      return null;
    }

    return {
      id: createdProfile.id,
      email: user.email ?? '',
      fullName: createdProfile.full_name,
      role: createdProfile.role,
      isActive: createdProfile.is_active,
      createdAt: createdProfile.created_at,
      updatedAt: createdProfile.updated_at
    };
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
