'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function loginAction(email: string, password: string): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  console.log('=== LOGIN DEBUG ===');
  console.log('error:', error);
  console.log('user:', data?.user?.email ?? 'null');
  console.log('session exists:', !!data?.session);
  console.log('access_token prefix:', data?.session?.access_token?.slice(0, 20) ?? 'null');

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  console.log('cookies après signIn:', allCookies.map((c) => c.name));

  console.log(
    'supabase cookies:',
    allCookies
      .filter((c) => c.name.includes('sb-'))
      .map((c) => ({
        name: c.name,
        valueStart: c.value.slice(0, 20),
      }))
  );

  console.log('===================');

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}
