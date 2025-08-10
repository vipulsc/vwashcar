"use client";
import React from "react";
import { Search, Car } from "lucide-react";

interface QueueItem {
  id: string;
  plateNumber: string;
  servicePackage: string;
  status: "waiting" | "in-progress" | "completed";
  arrivalTime: string;
  phoneNumber?: string;
  vehicleType?: string;
  estimatedTime: number;
  priority: number;
}

interface QueueSectionProps {
  queueItems: QueueItem[];
  queueFilter: "all" | "waiting" | "in-progress" | "completed";
  searchTerm: string;
  setQueueFilter: (filter: "all" | "waiting" | "in-progress" | "completed") => void;
  setSearchTerm: (term: string) => void;
  updateQueueStatus: (id: string, status: "waiting" | "in-progress" | "completed") => void;
}

const servicePackages = [
  { id: "basic", name: "Basic" },
  { id: "jack", name: "Jack" },
  { id: "extreme", name: "Extreme" },
];

export default function QueueSection({ 
  queueItems, 
  queueFilter, 
  searchTerm, 
  setQueueFilter, 
  setSearchTerm, 
  updateQueueStatus 
}: QueueSectionProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredQueue = queueItems.filter((item) => {
    const matchesFilter = queueFilter === "all" || item.status === queueFilter;
    const matchesSearch =
      searchTerm === "" ||
      item.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phoneNumber?.includes(searchTerm) ||
      servicePackages
        .find((p) => p.id === item.servicePackage)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Queue Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Queue Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setQueueFilter("all")}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              queueFilter === "all"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setQueueFilter("waiting")}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              queueFilter === "waiting"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Waiting
          </button>
          <button
            onClick={() => setQueueFilter("in-progress")}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              queueFilter === "in-progress"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            In Progress
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by plate number or service..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Queue Items */}
      <div className="space-y-3">
        {filteredQueue.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Car className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No vehicles in queue</p>
          </div>
        ) : (
          filteredQueue.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {item.plateNumber}
                  </h3>
                  <p className="text-sm text-gray-600">{item.arrivalTime}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="text-sm text-gray-600">Service: </span>
                  <span className="font-medium text-gray-900">
                    {servicePackages.find((p) => p.id === item.servicePackage)
                      ?.name || "Unknown"}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status.replace("-", " ")}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updateQueueStatus(item.id, "waiting")}
                  className="flex-1 py-2 px-3 text-sm bg-yellow-50 text-yellow-700 border border-yellow-200 rounded hover:bg-yellow-100 transition-colors"
                >
                  Waiting
                </button>
                <button
                  onClick={() => updateQueueStatus(item.id, "in-progress")}
                  className="flex-1 py-2 px-3 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                >
                  In Progress
                </button>
                <button
                  onClick={() => updateQueueStatus(item.id, "completed")}
                  className="flex-1 py-2 px-3 text-sm bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 transition-colors"
                >
                  Complete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
