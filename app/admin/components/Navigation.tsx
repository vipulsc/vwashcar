import React, { useState } from "react";
import { LogOut, ChevronDown, User } from "lucide-react";
import { AdminInfo } from "./types";

interface NavigationProps {
  activeTab: "dashboard" | "queue";
  setActiveTab: (tab: "dashboard" | "queue") => void;
  adminInfo: AdminInfo;
  showAccountMenu: boolean;
  setShowAccountMenu: (show: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  adminInfo,
  showAccountMenu,
  setShowAccountMenu,
}) => {
  const handleSignOut = () => {
    // Handle sign out logic
    console.log("Signing out...");
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Empty div for spacing */}
            </div>

            {/* User Avatar and Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--auth-purple)" }}
                >
                  <span className="text-white text-sm font-medium">
                    {adminInfo.avatar}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {adminInfo.name}
                  </p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                    showAccountMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 py-2 z-50 animate-scaleIn shadow-lg">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {adminInfo.name}
                    </p>
                    <p className="text-sm text-gray-500">{adminInfo.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-smooth"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
