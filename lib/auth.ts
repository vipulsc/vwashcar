import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  iat?: number;
  exp?: number;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    // Additional security checks
    if (!decoded.userId || !decoded.email || !decoded.role) {
      console.error("Invalid token payload: missing required fields");
      return null;
    }

    // Validate role
    const validRoles = ["SUPER_ADMIN", "ADMIN", "SALESMAN"];
    if (!validRoles.includes(decoded.role)) {
      console.error("Invalid token payload: invalid role", decoded.role);
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    return cookies["auth-token"] || null;
  }

  return null;
}

export async function authenticateUser(
  request: NextRequest
): Promise<JWTPayload | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // Check if token is expired
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    return null;
  }

  // Verify user still exists in database
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, role: true, name: true },
  });

  if (!user) return null;

  return {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
}

export function setAuthCookie(
  response: NextResponse,
  token: string
): NextResponse {
  const sevenDaysInSeconds = 7 * 24 * 60 * 60;

  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: sevenDaysInSeconds,
    path: "/",
  });
  return response;
}

export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}

export function requireAuth(
  handler: (request: NextRequest, user: JWTPayload) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(request, user);
  };
}

export function requireRole(allowedRoles: string[]) {
  return (
    handler: (request: NextRequest, user: JWTPayload) => Promise<NextResponse>
  ) => {
    return requireAuth(async (request: NextRequest, user: JWTPayload) => {
      if (!allowedRoles.includes(user.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return handler(request, user);
    });
  };
}

export function requireRoleWithParams(allowedRoles: string[]) {
  return (
    handler: (
      request: NextRequest,
      user: JWTPayload,
      context: { params: { id: string } }
    ) => Promise<NextResponse>
  ) => {
    return requireAuth(async (request: NextRequest, user: JWTPayload) => {
      if (!allowedRoles.includes(user.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      // Extract params from the URL
      const url = new URL(request.url);
      const pathParts = url.pathname.split("/");
      const id = pathParts[pathParts.length - 1];
      return handler(request, user, { params: { id } });
    });
  };
}
