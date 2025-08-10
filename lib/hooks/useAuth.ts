"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const lastCheckRef = useRef<number>(0);
  const checkingRef = useRef<boolean>(false);
  const sessionValidationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkAuth = useCallback(async () => {
    // Prevent multiple simultaneous auth checks
    if (checkingRef.current) {
      return;
    }

    // Debounce: don't check more than once every 2 seconds
    const now = Date.now();
    if (now - lastCheckRef.current < 2000) {
      return;
    }

    checkingRef.current = true;
    lastCheckRef.current = now;

    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);

        // STRICT Role-based redirects - users can only access their designated routes
        if (pathname === "/login" || pathname === "/auth") {
          // Redirect to appropriate dashboard based on role
          if (userData.user.role === "SUPER_ADMIN") {
            router.push("/superadmin");
          } else if (userData.user.role === "ADMIN") {
            router.push("/admin");
          } else if (userData.user.role === "SALESMAN") {
            router.push("/sales");
          }
        } else {
          // Check if user is on the wrong route for their role
          const currentRole = userData.user.role;
          const isOnWrongRoute =
            (currentRole === "SUPER_ADMIN" &&
              !pathname.startsWith("/superadmin")) ||
            (currentRole === "ADMIN" && !pathname.startsWith("/admin")) ||
            (currentRole === "SALESMAN" && !pathname.startsWith("/sales"));

          if (isOnWrongRoute) {
            // Redirect to their designated dashboard
            if (currentRole === "SUPER_ADMIN") {
              router.push("/superadmin");
            } else if (currentRole === "ADMIN") {
              router.push("/admin");
            } else if (currentRole === "SALESMAN") {
              router.push("/sales");
            }
          }
        }
      } else {
        // If auth check fails, clear user and redirect to login
        setUser(null);
        if (pathname !== "/login" && pathname !== "/auth") {
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      if (pathname !== "/login" && pathname !== "/auth") {
        router.push("/login");
      }
    } finally {
      setLoading(false);
      checkingRef.current = false;
    }
  }, [pathname, router]);

  const login = async (
    email: string,
    password: string,
    role: string
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, role }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);

        // STRICT Role-based redirects after login
        if (data.user.role === "SUPER_ADMIN") {
          router.push("/superadmin");
        } else if (data.user.role === "ADMIN") {
          router.push("/admin");
        } else if (data.user.role === "SALESMAN") {
          router.push("/sales");
        }

        return true;
      } else {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  // Initial auth check on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Set up periodic session validation when user is logged in
  useEffect(() => {
    if (user) {
      // Validate session every 5 minutes to detect role tampering
      sessionValidationIntervalRef.current = setInterval(() => {
        checkAuth();
      }, 5 * 60 * 1000); // 5 minutes
    } else {
      // Clear interval when user is not logged in
      if (sessionValidationIntervalRef.current) {
        clearInterval(sessionValidationIntervalRef.current);
        sessionValidationIntervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (sessionValidationIntervalRef.current) {
        clearInterval(sessionValidationIntervalRef.current);
      }
    };
  }, [user, checkAuth]);

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        loading,
        login,
        logout,
        checkAuth,
      },
    },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
