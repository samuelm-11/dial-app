import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<Awaited<ReturnType<typeof cookies>>['set']>[2];
};

function createClientWithCookies(cookieStore: Awaited<ReturnType<typeof cookies>>, canWriteCookies: boolean) {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        if (!canWriteCookies) {
          return;
        }

        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      }
    }
  });
}

export async function createSupabaseServerComponentClient() {
  const cookieStore = await cookies();
  return createClientWithCookies(cookieStore, false);
}

export async function createSupabaseServerActionClient() {
  const cookieStore = await cookies();
  return createClientWithCookies(cookieStore, true);
}
