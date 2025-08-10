"use client";

import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { QueueManagement } from "./components/QueueManagement";

import {
  CarInQueue,
  AdminInfo,
  ServicePackage,
  AddOnService,
  RevenueData,
  TodayStats,
  EditCarData,
} from "./components/types";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "queue">(
    "dashboard"
  );
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [queueFilter, setQueueFilter] = useState<
    "all" | "waiting" | "in-progress" | "completed"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingQueue, setEditingQueue] = useState<CarInQueue | null>(null);
  const [showEditCarModal, setShowEditCarModal] = useState(false);
  const [editingCar, setEditingCar] = useState<CarInQueue | null>(null);
  const [editCarData, setEditCarData] = useState<EditCarData>({
    servicePackage: "",
    addOns: [],
    status: "waiting",
  });

  const servicePackages: ServicePackage[] = [
    {
      id: "basic",
      name: "Basic",
      price: 25,
      description: "Exterior wash & dry",
    },
    {
      id: "jack",
      name: "Jack",
      price: 45,
      description: "Exterior wash, interior vacuum",
    },
    {
      id: "extreme",
      name: "Extreme",
      price: 85,
      description: "Complete wash, wax, interior detail",
    },
  ];

  const addOnServices: AddOnService[] = [
    { id: "wax", name: "Ceramic Wax", price: 35 },
    { id: "polish", name: "Paint Polish", price: 25 },
    { id: "engine", name: "Engine Clean", price: 40 },
    { id: "interior", name: "Deep Interior Clean", price: 30 },
    { id: "wheels", name: "Wheel Detail", price: 20 },
    { id: "protection", name: "Paint Protection", price: 50 },
  ];

  const adminInfo: AdminInfo = {
    name: "Sarah Johnson",
    email: "sarah.johnson@carwash.com",
    role: "",
    avatar: "SJ",
  };

  const [queue, setQueue] = useState<CarInQueue[]>([
    {
      id: "1",
      plateNumber: "A-12345",
      servicePackage: "jack",
      status: "waiting",
      estimatedTime: 15,
      priority: 1,
      arrivalTime: "09:30 AM",
      phoneNumber: "+971 50 123 4567",
      vehicleType: "SUV",
      addOns: ["wax", "interior"],
    },
    {
      id: "2",
      plateNumber: "B-67890",
      servicePackage: "basic",
      status: "in-progress",
      estimatedTime: 10,
      priority: 2,
      arrivalTime: "09:45 AM",
      phoneNumber: "+971 55 234 5678",
      vehicleType: "Sedan",
      addOns: [],
    },
    {
      id: "3",
      plateNumber: "C-11111",
      servicePackage: "extreme",
      status: "waiting",
      estimatedTime: 25,
      priority: 3,
      arrivalTime: "10:00 AM",
      phoneNumber: "+971 52 345 6789",
      vehicleType: "SUV",
      addOns: ["wax", "polish", "engine"],
    },
    {
      id: "4",
      plateNumber: "D-22222",
      servicePackage: "basic",
      status: "completed",
      estimatedTime: 15,
      priority: 4,
      arrivalTime: "10:15 AM",
      phoneNumber: "+971 56 456 7890",
      vehicleType: "Compact",
      addOns: ["wheels"],
    },
    {
      id: "5",
      plateNumber: "E-33333",
      servicePackage: "jack",
      status: "waiting",
      estimatedTime: 10,
      priority: 5,
      arrivalTime: "08:30 AM",
      phoneNumber: "+971 54 567 8901",
      vehicleType: "Sedan",
      addOns: ["protection"],
    },
  ]);

  const todayRevenue: RevenueData = {
    total: 2847.5,
    cash: 1247.5,
    card: 1600.0,
    yesterday: 2650.0,
  };

  const todayStats: TodayStats = {
    servicesCompleted: 23,
    averageRating: 4.7,
    totalCustomers: 28,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        adminInfo={adminInfo}
        showAccountMenu={showAccountMenu}
        setShowAccountMenu={setShowAccountMenu}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-6">
        {/* Tab Navigation - Superadmin Style with Shifting Animation */}
        <div className="mb-4 sm:mb-8">
          <div className="flex justify-center items-center py-2 sm:py-4 lg:py-6">
            <div
              className="flex rounded-2xl p-1 sm:p-2 relative overflow-hidden backdrop-blur-md w-full max-w-md"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Animated Background Slider */}
              <div
                className={`absolute top-2 bottom-2 rounded-xl transition-all duration-500 ease-out ${
                  activeTab === "dashboard"
                    ? "left-2 w-[calc(50%-0.5rem)]"
                    : "left-[calc(50%+0.5rem)] w-[calc(50%-0.5rem)]"
                }`}
                style={{
                  backgroundColor: "rgba(37, 99, 235, 0.9)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
                }}
              />

              {[
                { id: "dashboard", label: "Dashboard" },
                { id: "queue", label: "Queue" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "dashboard" | "queue")}
                  className={`flex items-center justify-center px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 whitespace-nowrap relative z-10 flex-1 ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <span className="text-center leading-tight">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {activeTab === "dashboard" && (
            <div className="animate-fadeIn">
              <Dashboard
                todayRevenue={todayRevenue}
                todayStats={todayStats}
                queue={queue}
                servicePackages={servicePackages}
              />
            </div>
          )}

          {activeTab === "queue" && (
            <div className="animate-fadeIn">
              <QueueManagement
                queue={queue}
                setQueue={setQueue}
                servicePackages={servicePackages}
                addOnServices={addOnServices}
                queueFilter={queueFilter}
                setQueueFilter={setQueueFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                editingQueue={editingQueue}
                setEditingQueue={setEditingQueue}
                showEditCarModal={showEditCarModal}
                setShowEditCarModal={setShowEditCarModal}
                editingCar={editingCar}
                setEditingCar={setEditingCar}
                editCarData={editCarData}
                setEditCarData={setEditCarData}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
