"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserRole = "superadmin" | "admin" | "sales";

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    let redirectPath = "";

    if (role === "superadmin") {
      redirectPath = "/superadmin";
    } else if (role === "admin") {
      redirectPath = "/admin";
    } else if (role === "sales") {
      redirectPath = "/sales";
    }

    router.push(redirectPath);
  };

  const handleRoleToggle = (newRole: UserRole) => {
    setRole(newRole);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Role Switcher */}
          <div className="flex bg-white/10 rounded-2xl p-1 mb-8">
            {(["superadmin", "admin", "sales"] as UserRole[]).map((r) => (
              <div
                key={r}
                className={`flex-1 text-center py-3 px-4 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-300 ${
                  role === r
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-white"
                }`}
                onClick={() => handleRoleToggle(r)}
              >
                {r === "superadmin"
                  ? "Super Admin"
                  : r.charAt(0).toUpperCase() + r.slice(1)}
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-2"
              >
                Username (Optional)
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`${role} username`}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-2"
              >
                Password (Optional)
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={`${role} password`}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all duration-300"
            >
              Continue as{" "}
              {role === "superadmin"
                ? "Super Admin"
                : role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          </form>

          {/* Register/Forgot Link - Only for Super Admin */}
          {role === "superadmin" && (
            <div className="mt-8 text-center">
              <Link
                href="/auth"
                className="text-slate-300 hover:text-white font-medium transition-colors duration-200"
              >
                Register / Forgot Password
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            © 2024 VWashCar. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
