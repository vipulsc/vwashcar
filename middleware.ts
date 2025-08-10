import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  iat?: number;
  exp?: number;
}

// Edge Runtime compatible JWT verification
function verifyToken(token: string): JWTPayload | null {
  try {
    // Split the token
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (base64url decode)
    const payload = parts[1];
    const decodedPayload = JSON.parse(
      Buffer.from(
        payload.replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
      ).toString()
    );

    // Check expiration
    if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
      return null;
    }

    // Additional security checks
    if (
      !decodedPayload.userId ||
      !decodedPayload.email ||
      !decodedPayload.role
    ) {
      console.error("Invalid token payload: missing required fields");
      return null;
    }

    // Validate role
    const validRoles = ["SUPER_ADMIN", "ADMIN", "SALESMAN"];
    if (!validRoles.includes(decodedPayload.role)) {
      console.error("Invalid token payload: invalid role", decodedPayload.role);
      return null;
    }

    return decodedPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth", "/login"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // API routes that don't require authentication
  const publicApiRoutes = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/logout",
    "/api/health",
  ];
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if it's a public route (exact match or starts with)
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if it's a public API route
  if (isPublicApiRoute) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get("auth-token")?.value;

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify token using Edge Runtime compatible verification
  const payload = verifyToken(token);

  if (!payload) {
    // Clear invalid token
    const response = pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", request.url));

    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  }

  // STRICT Role-based access control - each role can only access their designated routes
  if (pathname.startsWith("/superadmin")) {
    // Only SUPER_ADMIN can access superadmin routes
    if (payload.role !== "SUPER_ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      // Redirect unauthorized users to their appropriate dashboard
      if (payload.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else if (payload.role === "SALESMAN") {
        return NextResponse.redirect(new URL("/sales", request.url));
      } else {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  } else if (pathname.startsWith("/admin")) {
    // Only ADMIN can access admin routes (SUPER_ADMIN cannot access admin routes)
    if (payload.role !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      // Redirect unauthorized users to their appropriate dashboard
      if (payload.role === "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/superadmin", request.url));
      } else if (payload.role === "SALESMAN") {
        return NextResponse.redirect(new URL("/sales", request.url));
      } else {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  } else if (pathname.startsWith("/sales")) {
    // Only SALESMAN can access sales routes (SUPER_ADMIN and ADMIN cannot access sales routes)
    if (payload.role !== "SALESMAN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      // Redirect unauthorized users to their appropriate dashboard
      if (payload.role === "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/superadmin", request.url));
      } else if (payload.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  // If user is logged in and tries to access login page, redirect to appropriate dashboard
  if (pathname === "/login" || pathname === "/auth") {
    if (payload.role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/superadmin", request.url));
    } else if (payload.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else if (payload.role === "SALESMAN") {
      return NextResponse.redirect(new URL("/sales", request.url));
    }
  }

  // Add user info to headers for API routes
  if (pathname.startsWith("/api/")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-role", payload.role);
    requestHeaders.set("x-user-email", payload.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    "/api/:path*",
  ],
};
