"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserRole = "SUPER_ADMIN" | "ADMIN" | "SALESMAN";

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("ADMIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Store user data in localStorage or session
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      let redirectPath = "";
      if (role === "SUPER_ADMIN") {
        redirectPath = "/superadmin";
      } else if (role === "ADMIN") {
        redirectPath = "/admin";
      } else if (role === "SALESMAN") {
        redirectPath = "/sales";
      }

      router.push(redirectPath);
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = (newRole: UserRole) => {
    setRole(newRole);
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-3 sm:p-4 lg:p-8"
      style={{ backgroundColor: "var(--auth-bg)" }}
    >
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-md">
        {/* Login Container */}
        <div
          className="backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border p-4 sm:p-6 lg:p-8"
          style={{
            backgroundColor: "var(--auth-container-bg)",
            borderColor: "var(--auth-border)",
          }}
        >
          {/* Role Switcher */}
          <div
            className="flex rounded-xl sm:rounded-2xl p-1 mb-4 sm:mb-6"
            style={{ backgroundColor: "var(--auth-container-bg)" }}
          >
            {(["SUPER_ADMIN", "ADMIN", "SALESMAN"] as UserRole[]).map((r) => (
              <div
                key={r}
                className={`flex-1 text-center py-2.5 sm:py-3 px-2 sm:px-3 rounded-lg sm:rounded-xl font-medium sm:font-semibold text-xs sm:text-sm cursor-pointer transition-all duration-300 flex items-center justify-center min-h-[44px] sm:min-h-[48px] ${
                  role === r ? "shadow-lg" : ""
                }`}
                style={{
                  backgroundColor:
                    role === r ? "var(--auth-purple)" : "transparent",
                  color:
                    role === r
                      ? "var(--auth-text-primary)"
                      : "var(--auth-text-primary)",
                }}
                onClick={() => handleRoleToggle(r)}
              >
                <span className="leading-none">
                  {r === "SUPER_ADMIN"
                    ? "Super Admin"
                    : r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()}
                </span>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-lg sm:rounded-xl text-xs sm:text-sm"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                border: "1px solid var(--auth-red)",
                color: "var(--auth-red)",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5 sm:mb-2"
                style={{ color: "var(--auth-text-primary)" }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base"
                style={{
                  backgroundColor: "var(--auth-input-bg)",
                  border: "1px solid var(--auth-input-border)",
                  color: "var(--auth-text-primary)",
                }}
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1.5 sm:mb-2"
                style={{ color: "var(--auth-text-primary)" }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base"
                style={{
                  backgroundColor: "var(--auth-input-bg)",
                  border: "1px solid var(--auth-input-border)",
                  color: "var(--auth-text-primary)",
                }}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl font-semibold sm:font-bold text-base sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-6"
              style={{
                backgroundColor: "var(--auth-purple)",
                color: "var(--auth-text-primary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--auth-purple-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--auth-purple)";
              }}
            >
              {loading
                ? "Logging in..."
                : `Continue as ${
                    role === "SUPER_ADMIN"
                      ? "Super Admin"
                      : role.charAt(0).toUpperCase() +
                        role.slice(1).toLowerCase()
                  }`}
            </button>
          </form>

          {/* Register/Forgot Link - Only for Super Admin */}
          {role === "SUPER_ADMIN" && (
            <div className="mt-4 sm:mt-6 text-center">
              <Link
                href="/auth"
                className="font-medium transition-colors duration-200 text-sm sm:text-base"
                style={{ color: "var(--auth-text-secondary)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--auth-text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--auth-text-secondary)";
                }}
              >
                Register / Forgot Password
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6">
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--auth-text-muted)" }}
          >
            © 2024 VWashCar. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
