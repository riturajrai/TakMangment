import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/notifications'];
  const publicRoutes = ['/login', '/register', '/reset-password', '/'];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/protected`, {
        method: 'GET',
        headers: {
          Cookie: request.headers.get('cookie') || '',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Middleware authentication failed:', error);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};