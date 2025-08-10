"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackRoute: string;
}

export function RouteGuard({ children, allowedRoles, fallbackRoute }: RouteGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User is not authenticated, redirect to login
        router.push("/login");
        return;
      }

      // Check if user's role is allowed for this route
      if (!allowedRoles.includes(user.role)) {
        console.warn(`Access denied: User role ${user.role} not allowed for this route`);
        
        // Redirect to appropriate dashboard based on role
        if (user.role === "SUPER_ADMIN") {
          router.push("/superadmin");
        } else if (user.role === "ADMIN") {
          router.push("/admin");
        } else if (user.role === "SALESMAN") {
          router.push("/sales");
        } else {
          router.push(fallbackRoute);
        }
        return;
      }
    }
  }, [user, loading, allowedRoles, fallbackRoute, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if user is not authenticated or not authorized
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

// Convenience components for each role
export function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN"]} fallbackRoute="/login">
      {children}
    </RouteGuard>
  );
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={["ADMIN"]} fallbackRoute="/login">
      {children}
    </RouteGuard>
  );
}

export function SalesmanGuard({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={["SALESMAN"]} fallbackRoute="/login">
      {children}
    </RouteGuard>
  );
}
