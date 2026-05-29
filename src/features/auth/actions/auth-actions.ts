'use server';

import { createSupabaseServerActionClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

type CookieDebug = { name: string; value: string };

export async function loginAction(email: string, password: string): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerActionClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  console.log('=== LOGIN DEBUG ===');
  console.log('error:', error);
  console.log('user:', data?.user?.email ?? 'null');
  console.log('session exists:', !!data?.session);
  console.log('access_token prefix:', data?.session?.access_token?.slice(0, 20) ?? 'null');

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll() as CookieDebug[];

  console.log('cookies après signIn:', allCookies.map((cookie) => cookie.name));

  console.log(
    'supabase cookies:',
    allCookies
      .filter((cookie) => cookie.name.includes('sb-'))
      .map((cookie) => ({
        name: cookie.name,
        valueStart: cookie.value.slice(0, 20),
      }))
  );

  console.log('===================');

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function logoutAction() {
  const supabase = await createSupabaseServerActionClient();
  await supabase.auth.signOut();
}
