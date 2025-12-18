import {NextResponse} from "next/server";
import type {NextRequest} from "next/server"

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    
    // Check for authentication token
    const isLoggedIn = req.cookies.get("access_token") || 
                      req.cookies.get("laravel_session") ||
                      req.cookies.get("auth-token");

    // Protected routes
    const protectedRoutes = ['/dashboard', '/incidents', '/users', '/status'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // If logged in and trying to access login page, redirect to dashboard
    if (pathname === '/login' && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Redirect root to appropriate page
    if (pathname === '/') {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        } else {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}