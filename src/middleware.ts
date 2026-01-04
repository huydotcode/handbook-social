import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

    // For client-side, we'll check token in the component
    // Middleware can't access localStorage, so we'll use a different approach
    // Check if there's a token in cookies (as fallback) or let client handle it

    // For now, allow all requests and let client-side handle auth
    // The AuthProvider will handle redirects on client-side

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
