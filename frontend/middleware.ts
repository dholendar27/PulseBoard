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

    // Role-based route protection (server-side basic check)
    // Note: This is a basic check. The main role validation happens client-side
    const adminOnlyRoutes = ['/users'];
    const isAdminRoute = adminOnlyRoutes.some(route => pathname.startsWith(route));
    
    if (isAdminRoute && isLoggedIn) {
        // You could decode JWT token here to check role if needed
        // For now, we rely on client-side protection
        // This is just a placeholder for future server-side role checking
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