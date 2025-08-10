"use client";

import { useState } from "react";
import Link from "next/link";

type AuthMode = "register" | "forgot";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("register");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === "register") {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    } else {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (mode === "register") {
      console.log("Registration attempt:", {
        ...formData,
        role: "SUPER_ADMIN",
      });
    } else {
      console.log("Password reset requested for:", formData.email);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">VWashCar</h1>
          <p className="text-slate-300">Account Management</p>
        </div>

        {/* Auth Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Mode Toggle */}
          <div className="flex bg-white/10 rounded-2xl p-1 mb-8">
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                mode === "register"
                  ? "bg-white text-slate-900 shadow-lg"
                  : "text-white hover:text-slate-200"
              }`}
            >
              Register
            </button>
            <button
              onClick={() => setMode("forgot")}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                mode === "forgot"
                  ? "bg-white text-slate-900 shadow-lg"
                  : "text-white hover:text-slate-200"
              }`}
            >
              Forgot Password
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "register" && (
              <>
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-slate-300 border-white/20 ${
                      errors.name ? "border-red-400" : ""
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-300">{errors.name}</p>
                  )}
                </div>
              </>
            )}

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-slate-300 border-white/20 ${
                  errors.email ? "border-red-400" : ""
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-300">{errors.email}</p>
              )}
            </div>

            {mode === "register" && (
              <>
                {/* Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-slate-300 border-white/20 ${
                      errors.password ? "border-red-400" : ""
                    }`}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.password}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all duration-300"
            >
              {mode === "register" ? "Create Account" : "Send Reset Link"}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white font-medium transition-colors duration-200"
            >
              ← Back to Login
            </Link>
          </div>
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
