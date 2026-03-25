import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse['cookies']['set']>[2];
};

const protectedPaths = [
  '/',
  '/dashboard',
  '/clients',
  '/contracts',
  '/opportunities',
  '/alerts',
  '/imports',
  '/settings',
  '/users',
  '/account',
];

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: req,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;
  const isProtected = protectedPaths.some((path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)
  );

  if (isProtected && !user) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
