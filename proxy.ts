import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
    const session = await auth.api.getSession();
    const { pathname } = req.nextUrl;

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
    const isAdminRoute = pathname.startsWith('/admin');
    const isApiAdminRoute = pathname.startsWith('/api/admin');
    const isUserRoute = pathname.startsWith('/my-events');
    const isApiUserRoute = pathname.startsWith('/api/participations');

    // @ts-ignore
    const isAdmin = session?.user?.role === 'admin';
    const isUser = !!session;

    if (isAuthPage && isUser) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if ((isAdminRoute || isApiAdminRoute) && !isAdmin) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    if ((isUserRoute || isApiUserRoute) && !isUser) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*', '/my-events/:path*', '/api/participations/:path*', '/login', '/signup'],
};
