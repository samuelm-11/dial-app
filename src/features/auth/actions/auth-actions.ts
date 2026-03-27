'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function loginAction(
  email: string,
  password: string
): Promise<{ error: string | null; success?: boolean }> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  return { error: null, success: true };
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}
