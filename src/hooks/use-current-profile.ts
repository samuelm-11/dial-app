'use client';

import { useEffect, useState } from 'react';
import type { UserProfile } from '@/types/auth';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function useCurrentProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, is_active, created_at, updated_at')
        .eq('id', user.id)
        .single();

      if (profileError || !data) {
        setError(profileError?.message ?? 'Profil introuvable');
      } else {
        setProfile({
          id: data.id,
          email: data.email,
          fullName: data.full_name,
          role: data.role,
          isActive: data.is_active,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        });
      }

      setIsLoading(false);
    };

    loadProfile();
  }, []);

  return { profile, isLoading, error };
}
