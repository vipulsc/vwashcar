import React from "react";
import { Car, LogOut, Menu, X } from "lucide-react";
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
  const TabButton = ({
    id,
    label,
    icon: Icon,
    isActive,
    onClick,
  }: TabButtonProps) => (
    <button
      onClick={() => {
        onClick(id);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap w-full text-left ${
        isActive ? "text-white" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      <span>{label}</span>
    </button>
  );

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-2"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <Car className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">CarWash UAE</h1>
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                Super Admin
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={setActiveTab}
              />
            ))}
          </nav>
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
                backgroundColor: "rgba(34, 197, 94, 0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 16px rgba(34, 197, 94, 0.3)",
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
    </>
  );
};
