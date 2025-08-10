import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get user info from middleware headers
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");
    const userEmail = request.headers.get("x-user-email");

    if (!userId || !userRole || !userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Additional security: Verify user exists in database and role matches
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Security check: Ensure role in token matches role in database
    if (user.role !== userRole) {
      console.error(
        `Role mismatch for user ${userId}: token role=${userRole}, db role=${user.role}`
      );
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Security check: Ensure email in token matches email in database
    if (user.email !== userEmail) {
      console.error(
        `Email mismatch for user ${userId}: token email=${userEmail}, db email=${user.email}`
      );
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      authenticated: true,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
