import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const path = req.nextUrl.pathname;
    const isDashboard = path.startsWith("/dashboard");

    if (isDashboard) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        console.log("Middleware Check - Path:", path, "Role:", token?.role);

        // If there is no token, redirect to the login page
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // If the user is logged in but is not a manager, redirect to the home page
        if (token.role !== "manager") {
            console.log("Unauthorized access attempt to dashboard by non-manager. User role:", token.role);
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/dashboard"],
};
