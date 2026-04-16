import { NextResponse } from "next/server";
import { ROLES, ROLE_NAMES } from "@/utils/constants";

export function middleware(request) {
    const token = request.cookies.get("token")?.value;
    const userCookie = request.cookies.get("user")?.value;

    let user = null;
    try {
        user = userCookie ? JSON.parse(userCookie) : null;
    } catch {
        user = null;
    }

    const { pathname } = request.nextUrl;

    const publicRoutes = ["/", "/sign-in", "/sign-up", "/unauthorized"];

    // 🔒 Not logged in
    if (!token && !publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // 🔒 Logged in → block auth pages
    if (token && (pathname === "/sign-in" || pathname === "/sign-up")) {
        return NextResponse.redirect(
            new URL(`/${ROLE_NAMES[user.role_id]}/dashboard`, request.url)
        );
    }

    // 🔐 STRICT ROLE CHECK
    if (user) {
        const role = user.role_id;

        // ✅ define allowed base route
        let allowedBase = "";

        if (role === ROLES.ADMIN) allowedBase = "/admin";
        if (role === ROLES.EMPLOYER) allowedBase = "/employer";
        if (role === ROLES.CANDIDATE) allowedBase = "/candidate";

        // ❌ If trying to access other role routes → BLOCK
        if (
            pathname.startsWith("/admin") ||
            pathname.startsWith("/employer") ||
            pathname.startsWith("/candidate")
        ) {
            if (!pathname.startsWith(allowedBase)) {
                return NextResponse.redirect(
                    new URL(`${allowedBase}/dashboard`, request.url)
                );
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/employer/:path*",
        "/candidate/:path*",
    ],
};