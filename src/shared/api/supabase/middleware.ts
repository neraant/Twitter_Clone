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

  const pathname = request.nextUrl.pathname;

  const publicRoutes = [
    routes.auth.signUpMain,
    routes.auth.signUp,
    routes.auth.login,
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Auth error:', error);
      supabaseResponse.cookies.delete('sb-access-token');
      supabaseResponse.cookies.delete('sb-refresh-token');

      if (!isPublicRoute) {
        const redirectUrl = new URL(routes.auth.signUpMain, request.url);
        return NextResponse.redirect(redirectUrl);
      }

      return supabaseResponse;
    }

    if (!user && !isPublicRoute) {
      const redirectUrl = new URL(routes.auth.signUpMain, request.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (user && isPublicRoute) {
      const redirectUrl = new URL(routes.app.home, request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return supabaseResponse;
  } catch (error) {
    console.error('Middleware error:', error);

    supabaseResponse.cookies.delete('sb-access-token');
    supabaseResponse.cookies.delete('sb-refresh-token');

    if (!isPublicRoute) {
      const redirectUrl = new URL(routes.auth.signUpMain, request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return supabaseResponse;
  }
}
