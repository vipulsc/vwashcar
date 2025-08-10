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
    <div
      className="min-h-screen flex items-center justify-center p-3 sm:p-4 lg:p-8"
      style={{ backgroundColor: "var(--auth-bg)" }}
    >
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-md">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2"
            style={{ color: "var(--auth-text-primary)" }}
          >
            VWashCar
          </h1>
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--auth-text-secondary)" }}
          >
            Account Management
          </p>
        </div>

        {/* Auth Container */}
        <div
          className="backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border p-4 sm:p-6 lg:p-8"
          style={{
            backgroundColor: "var(--auth-container-bg)",
            borderColor: "var(--auth-border)",
          }}
        >
          {/* Mode Toggle */}
          <div
            className="flex rounded-2xl sm:rounded-3xl p-1 mb-6 sm:mb-8 relative overflow-hidden backdrop-blur-md"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Animated Background Slider */}
            <div
              className={`absolute top-1 bottom-1 rounded-xl sm:rounded-2xl transition-all duration-500 ease-out ${
                mode === "register"
                  ? "left-1 w-[calc(50%-0.25rem)]"
                  : "left-[calc(50%+0.25rem)] w-[calc(50%-0.25rem)]"
              }`}
              style={{
                backgroundColor: "rgba(37, 99, 235, 0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
              }}
            />

            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl font-medium sm:font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center min-h-[36px] sm:min-h-[44px] relative z-10 ${
                mode === "register"
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <span className="leading-none font-medium">Register</span>
            </button>
            <button
              onClick={() => setMode("forgot")}
              className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl font-medium sm:font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center min-h-[36px] sm:min-h-[44px] relative z-10 ${
                mode === "forgot"
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <span className="leading-none font-medium">Forgot Password</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {mode === "register" && (
              <>
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1.5 sm:mb-2"
                    style={{ color: "var(--auth-text-primary)" }}
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base ${
                      errors.name ? "border-red-400" : ""
                    }`}
                    style={{
                      backgroundColor: "var(--auth-input-bg)",
                      border: `1px solid ${
                        errors.name
                          ? "var(--auth-red)"
                          : "var(--auth-input-border)"
                      }`,
                      color: "var(--auth-text-primary)",
                    }}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--auth-red)" }}
                    >
                      {errors.name}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5 sm:mb-2"
                style={{ color: "var(--auth-text-primary)" }}
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base ${
                  errors.email ? "border-red-400" : ""
                }`}
                style={{
                  backgroundColor: "var(--auth-input-bg)",
                  border: `1px solid ${
                    errors.email
                      ? "var(--auth-red)"
                      : "var(--auth-input-border)"
                  }`,
                  color: "var(--auth-text-primary)",
                }}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--auth-red)" }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            {mode === "register" && (
              <>
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
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base ${
                      errors.password ? "border-red-400" : ""
                    }`}
                    style={{
                      backgroundColor: "var(--auth-input-bg)",
                      border: `1px solid ${
                        errors.password
                          ? "var(--auth-red)"
                          : "var(--auth-input-border)"
                      }`,
                      color: "var(--auth-text-primary)",
                    }}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--auth-red)" }}
                    >
                      {errors.password}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl font-semibold sm:font-bold text-base sm:text-lg transition-all duration-300 mt-4 sm:mt-6"
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
              {mode === "register" ? "Create Account" : "Send Reset Link"}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-4 sm:mt-6 text-center">
            <Link
              href="/login"
              className="font-medium transition-colors duration-200 text-sm sm:text-base"
              style={{ color: "var(--auth-text-secondary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--auth-text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--auth-text-secondary)";
              }}
            >
              ← Back to Login
            </Link>
          </div>
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
