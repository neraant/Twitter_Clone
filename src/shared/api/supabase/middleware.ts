import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

import { routes } from '@/shared/config/routes';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const protectedRoutes = [
    routes.app.bookmarks,
    routes.app.explore,
    routes.app.home,
    routes.app.lists,
    routes.app.messages,
    routes.app.more,
    routes.app.notifications,
    routes.app.profile,
  ];

  const authRoutes = [
    routes.auth.signUpMain,
    routes.auth.error,
    routes.auth.login,
    routes.auth.signUp,
  ];

  const knownRoutes = [
    routes.root,
    ...protectedRoutes,
    ...authRoutes,
    routes.api.callback,
    routes.api.checkEmail,
    routes.api.createPost,
    routes.api.getUser,
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const routeExists = knownRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL(routes.auth.signUpMain, request.url));
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL(routes.app.home, request.url));
  }

  if (!routeExists) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  return supabaseResponse;
}
