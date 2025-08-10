import React from "react";
import { BarChart3, Clock } from "lucide-react";

interface TabNavigationProps {
  activeTab: "dashboard" | "queue";
  setActiveTab: (tab: "dashboard" | "queue") => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      description: "Overview and statistics",
    },
    {
      id: "queue",
      label: "Queue Management",
      icon: Clock,
      description: "Manage car queue and services",
    },
  ];

  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "dashboard" | "queue")}
              className={`group relative min-w-0 flex-1 overflow-hidden py-4 px-1 text-center text-sm font-medium hover:text-purple-600 focus:z-10 focus:outline-none sm:min-w-0 sm:flex-none sm:px-6 ${
                activeTab === tab.id
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : "border-b-2 border-transparent text-gray-500 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <tab.icon className="h-5 w-5" />
                <span className="hidden sm:block">{tab.label}</span>
              </div>
              <span
                className={`absolute inset-x-0 bottom-0 h-0.5 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-purple-500"
                    : "bg-transparent group-hover:bg-gray-300"
                }`}
              />
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Description */}
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          {tabs.find((tab) => tab.id === activeTab)?.description}
        </p>
      </div>
    </div>
  );
};
