import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptToken } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  const sessionCookie = request.cookies.get("bemms_session")?.value;
  const user = sessionCookie ? await decryptToken(sessionCookie) : null;

  // 1. Auth Page Interception (Redirect already logged-in users)
  if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
    if (user) {
      if (user.role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      } else if (user.role === "TECHNICIAN") {
        return NextResponse.redirect(new URL("/dashboard/technician", request.url));
      } else if (user.role === "CLINICAL") {
        return NextResponse.redirect(new URL("/dashboard/clinical", request.url));
      }
    }
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // 2. Role-Based Path Restrictions
  if (pathname.startsWith("/dashboard/admin")) {
    if (!user || user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/dashboard/technician")) {
    if (!user || user.role !== "TECHNICIAN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/dashboard/clinical")) {
    if (!user || user.role !== "CLINICAL") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Fallback protection for generic dashboard pages
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Redirect to respective sub-dashboards
    if (user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    } else if (user.role === "TECHNICIAN") {
      return NextResponse.redirect(new URL("/dashboard/technician", request.url));
    } else if (user.role === "CLINICAL") {
      return NextResponse.redirect(new URL("/dashboard/clinical", request.url));
    }
  }

  // Global page authorization for asset management, team rosters, etc.
  const isGlobalProtected = 
    pathname.startsWith("/assets") || 
    pathname.startsWith("/maintenance") || 
    pathname.startsWith("/team") || 
    pathname.startsWith("/fault-report");

  if (isGlobalProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/assets/:path*",
    "/maintenance/:path*",
    "/team/:path*",
    "/fault-report/:path*",
    "/login",
    "/signup",
    "/",
  ],
};
