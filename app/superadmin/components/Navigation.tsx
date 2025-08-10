import React, { useState } from "react";
import { Car, LogOut, Menu, X, ChevronDown, User } from "lucide-react";
import { TabButtonProps } from "./types";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  handleSignOut: () => void;
  tabs: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleSignOut,
  tabs,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Mock user data - in real app this would come from context/auth
  const user = {
    name: "Super Admin",
    email: "superadmin@carwash.ae",
    avatar: null, // You can add avatar URL here
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md mr-2 transition-all duration-200 hover:scale-105"
                style={{
                  color: "#6b7280",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              >
                <Menu
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isMobileMenuOpen ? "rotate-90" : "rotate-0"
                  }`}
                />
              </button>
            </div>

            {/* User Avatar and Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--auth-purple)" }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                    showUserDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-200 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed inset-0 backdrop-blur-md ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        <div
          className={`fixed top-0 left-0 w-80 h-full bg-white shadow-xl transition-all duration-200 ease-out transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Glass Morphism Navigation */}
          <div className="p-4">
            <div
              className="flex flex-col rounded-2xl p-2 relative overflow-hidden backdrop-blur-md"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Animated Background Slider */}
              <div
                className={`absolute left-2 right-2 rounded-xl transition-all duration-500 ease-out ${
                  activeTab === "overview"
                    ? "top-2 h-[calc(16.666%-0.5rem)]"
                    : activeTab === "sites"
                    ? "top-[calc(16.666%+0.5rem)] h-[calc(16.666%-0.5rem)]"
                    : activeTab === "coordinators"
                    ? "top-[calc(33.333%+0.5rem)] h-[calc(16.666%-0.5rem)]"
                    : activeTab === "salesmen"
                    ? "top-[calc(50%+0.5rem)] h-[calc(16.666%-0.5rem)]"
                    : activeTab === "services"
                    ? "top-[calc(66.666%+0.5rem)] h-[calc(16.666%-0.5rem)]"
                    : "top-[calc(83.333%+0.5rem)] h-[calc(16.666%-0.5rem)]"
                }`}
                style={{
                  backgroundColor: "rgba(37, 99, 235, 0.9)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
                }}
              />

              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap relative z-10 ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <tab.icon className="h-5 w-5 mr-3" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation with Glass Morphism */}
      <div className="hidden lg:block w-full">
        <div className="flex justify-center items-center py-6">
          <div
            className="flex rounded-2xl p-2 relative overflow-hidden backdrop-blur-md"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Animated Background Slider */}
            <div
              className={`absolute top-2 bottom-2 rounded-xl transition-all duration-500 ease-out ${
                activeTab === "overview"
                  ? "left-2 w-[calc(16.666%-0.5rem)]"
                  : activeTab === "sites"
                  ? "left-[calc(16.666%+0.5rem)] w-[calc(16.666%-0.5rem)]"
                  : activeTab === "coordinators"
                  ? "left-[calc(33.333%+0.5rem)] w-[calc(16.666%-0.5rem)]"
                  : activeTab === "salesmen"
                  ? "left-[calc(50%+0.5rem)] w-[calc(16.666%-0.5rem)]"
                  : activeTab === "services"
                  ? "left-[calc(66.666%+0.5rem)] w-[calc(16.666%-0.5rem)]"
                  : "left-[calc(83.333%+0.5rem)] w-[calc(16.666%-0.5rem)]"
              }`}
              style={{
                backgroundColor: "rgba(37, 99, 235, 0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
              }}
            />

            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap relative z-10 w-[160px] ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <div className="flex items-center justify-center">
                  <tab.icon className="h-5 w-5 mr-2" />
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showUserDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserDropdown(false)}
        />
      )}
    </>
  );
};
