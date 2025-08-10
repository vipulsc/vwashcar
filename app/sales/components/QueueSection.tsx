"use client";
import React, { useState } from "react";
import {
  Search,
  Car,
  DollarSign,
  CheckCircle,
  Clock,
  Droplets,
  Truck,
  Bike,
  Phone,
  Activity,
} from "lucide-react";

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
  addOns?: string[];
}

interface QueueSectionProps {
  queueItems: QueueItem[];
  queueFilter: "all" | "waiting" | "in-progress" | "completed";
  searchTerm: string;
  setQueueFilter: (
    filter: "all" | "waiting" | "in-progress" | "completed"
  ) => void;
  setSearchTerm: (term: string) => void;
  updateQueueStatus: (
    id: string,
    status: "waiting" | "in-progress" | "completed"
  ) => void;
}

const servicePackages = [
  { id: "basic", name: "Basic Wash", price: 25 },
  { id: "jack", name: "Jack Wash", price: 35 },
  { id: "extreme", name: "Extreme Wash", price: 50 },
];

const addOnServices = [
  { id: "wax", name: "Wax", price: 15 },
  { id: "polish", name: "Polish", price: 20 },
  { id: "engine", name: "Engine Clean", price: 40 },
  { id: "interior", name: "Deep Interior Clean", price: 30 },
  { id: "wheels", name: "Wheel Detail", price: 20 },
  { id: "protection", name: "Paint Protection", price: 50 },
];

export default function QueueSection({
  queueItems,
  queueFilter,
  searchTerm,
  setQueueFilter,
  setSearchTerm,
  updateQueueStatus,
}: QueueSectionProps) {
  // State for completion confirmation
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [carToComplete, setCarToComplete] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "waiting":
        return "bg-slate-100 text-slate-800 border-slate-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
    }).format(amount);
  };

  // Car icon functions based on vehicle type
  const getCarIcon = (vehicleType: string) => {
    const carType = vehicleType?.toLowerCase() || "";

    if (
      carType.includes("motorcycle") ||
      carType.includes("bike") ||
      carType.includes("moto")
    ) {
      return <Bike className="h-5 w-5" style={{ color: "#64748b" }} />;
    } else if (
      carType.includes("truck") ||
      carType.includes("pickup") ||
      carType.includes("4x4") ||
      carType.includes("suv")
    ) {
      return <Truck className="h-5 w-5" style={{ color: "#64748b" }} />;
    } else if (
      carType.includes("sedan") ||
      carType.includes("compact") ||
      carType.includes("hatchback")
    ) {
      return <Car className="h-5 w-5" style={{ color: "#64748b" }} />;
    } else {
      return <Car className="h-5 w-5" style={{ color: "#64748b" }} />;
    }
  };

  const getCarIconLarge = (vehicleType: string) => {
    const carType = vehicleType?.toLowerCase() || "";

    if (
      carType.includes("motorcycle") ||
      carType.includes("bike") ||
      carType.includes("moto")
    ) {
      return <Bike className="h-6 w-6" style={{ color: "#3b82f6" }} />;
    } else if (
      carType.includes("truck") ||
      carType.includes("pickup") ||
      carType.includes("4x4") ||
      carType.includes("suv")
    ) {
      return <Truck className="h-6 w-6" style={{ color: "#3b82f6" }} />;
    } else {
      return <Car className="h-6 w-6" style={{ color: "#3b82f6" }} />;
    }
  };

  const getServiceTotal = (car: QueueItem) => {
    const servicePackage = servicePackages.find(
      (p) => p.id === car.servicePackage
    );
    const addOnsTotal = (car.addOns || []).reduce(
      (total: number, addOnId: string) => {
        const addOn = addOnServices.find((a) => a.id === addOnId);
        return total + (addOn?.price || 0);
      },
      0
    );
    return (servicePackage?.price || 0) + addOnsTotal;
  };

  const filteredQueue = queueItems.filter((car) => {
    const matchesFilter = queueFilter === "all" || car.status === queueFilter;

    if (searchTerm === "") {
      return matchesFilter;
    }

    const searchLower = searchTerm.toLowerCase().trim();

    // Search in multiple fields
    const matchesPlate = car.plateNumber.toLowerCase().includes(searchLower);
    const matchesService =
      servicePackages
        .find((p) => p.id === car.servicePackage)
        ?.name.toLowerCase()
        .includes(searchLower) || false;
    const matchesPhone = car.phoneNumber?.includes(searchTerm) || false;
    const matchesId = car.id.toLowerCase().includes(searchLower);

    const matchesSearch =
      matchesPlate || matchesService || matchesPhone || matchesId;

    return matchesFilter && matchesSearch;
  });

  const totalRevenue = filteredQueue.reduce(
    (sum, car) => sum + getServiceTotal(car),
    0
  );
  const completedCars = filteredQueue.filter(
    (car) => car.status === "completed"
  ).length;
  const activeCars = filteredQueue.filter(
    (car) => car.status === "in-progress" || car.status === "waiting"
  ).length;

  // Function to handle completion confirmation
  const handleCompleteClick = (carId: string) => {
    setCarToComplete(carId);
    setShowCompletionModal(true);
  };

  const confirmCompletion = () => {
    if (carToComplete) {
      updateQueueStatus(carToComplete, "completed");
    }
    setShowCompletionModal(false);
    setCarToComplete(null);
  };

  const cancelCompletion = () => {
    setShowCompletionModal(false);
    setCarToComplete(null);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search
          className="h-4 w-4 absolute left-3 top-3"
          style={{ color: "#64748b" }}
        />
        <input
          type="text"
          placeholder="Search by car number or service..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm transition-all duration-200"
          style={{
            backgroundColor: "#f8fafc",
            borderColor: "#e2e8f0",
            color: "#1e293b",
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Cars List */}
      <div className="space-y-4">
        {filteredQueue.map((car) => (
          <div
            key={car.id}
            className="p-4 sm:p-6 rounded-lg border transition-all duration-200 shadow-sm"
            style={{
              backgroundColor: "#ffffff",
              borderColor: "#e2e8f0",
              borderWidth: "1px",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-4">
              <div className="flex items-center">
                <div className="relative mr-3">
                  {getCarIcon(car.vehicleType || "")}
                  <Droplets
                    className="h-2.5 w-2.5 absolute -top-0.5 -right-0.5"
                    style={{ color: "#06b6d4" }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-semibold" style={{ color: "#1e293b" }}>
                      {car.plateNumber}
                    </h3>
                    <p className="text-sm" style={{ color: "#64748b" }}>
                      {car.vehicleType || "Unknown Vehicle"} • {car.arrivalTime}
                    </p>
                  </div>
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      car.status
                    )}`}
                  >
                    {car.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Smooth Sliding Status Toggle */}
                <div
                  className="flex rounded-xl p-1 backdrop-blur-md border border-white/20 shadow-lg relative overflow-hidden min-w-[240px]"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Animated Background Slider */}
                  <div
                    className={`absolute top-1 bottom-1 rounded-lg transition-all duration-500 ease-out ${
                      car.status === "waiting"
                        ? "left-1 w-[calc(33.333%-0.5rem)] bg-yellow-500"
                        : car.status === "in-progress"
                        ? "left-[calc(33.333%+0.5rem)] w-[calc(33.333%-0.5rem)] bg-orange-500"
                        : "left-[calc(66.666%+0.5rem)] w-[calc(33.333%-0.5rem)] bg-green-500"
                    }`}
                    style={{
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                    }}
                  />

                  <button
                    onClick={() => updateQueueStatus(car.id, "waiting")}
                    className="relative flex-1 px-3 py-1.5 sm:py-2 text-xs font-medium rounded-lg transition-all duration-300 z-10 whitespace-nowrap min-w-0"
                    style={{
                      color: car.status === "waiting" ? "#ffffff" : "#6b7280",
                    }}
                  >
                    Waiting
                  </button>
                  <button
                    onClick={() => updateQueueStatus(car.id, "in-progress")}
                    className="relative flex-1 px-3 py-1.5 sm:py-2 text-xs font-medium rounded-lg transition-all duration-300 z-10 whitespace-nowrap min-w-0"
                    style={{
                      color:
                        car.status === "in-progress" ? "#ffffff" : "#6b7280",
                    }}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleCompleteClick(car.id)}
                    className="relative flex-1 px-3 py-1.5 sm:py-2 text-xs font-medium rounded-lg transition-all duration-300 z-10 whitespace-nowrap min-w-0"
                    style={{
                      color: car.status === "completed" ? "#ffffff" : "#6b7280",
                    }}
                  >
                    Complete
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <p
                  className="text-xs uppercase tracking-wider font-medium mb-1"
                  style={{ color: "#64748b" }}
                >
                  Service
                </p>
                <p className="font-semibold" style={{ color: "#1e293b" }}>
                  {servicePackages.find((p) => p.id === car.servicePackage)
                    ?.name || "Unknown"}
                </p>
              </div>

              {car.addOns && car.addOns.length > 0 && (
                <div>
                  <p
                    className="text-xs uppercase tracking-wider font-medium mb-1"
                    style={{ color: "#64748b" }}
                  >
                    Add-ons
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {car.addOns.map((addOnId, index) => {
                      const addOn = addOnServices.find((a) => a.id === addOnId);
                      return (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          style={{
                            backgroundColor: "#dbeafe",
                            color: "#1d4ed8",
                            border: "1px solid #bfdbfe",
                          }}
                        >
                          {addOn?.name || "Unknown"}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <p
                  className="text-xs uppercase tracking-wider font-medium mb-1"
                  style={{ color: "#64748b" }}
                >
                  Payment
                </p>
                <p className="font-semibold" style={{ color: "#1e293b" }}>
                  Card
                </p>
                <p className="text-lg font-bold" style={{ color: "#10b981" }}>
                  {formatCurrency(getServiceTotal(car))}
                </p>
              </div>

              <div>
                <p
                  className="text-xs uppercase tracking-wider font-medium mb-1"
                  style={{ color: "#64748b" }}
                >
                  Contact
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" style={{ color: "#3b82f6" }} />
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#1e293b" }}
                  >
                    {car.phoneNumber || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredQueue.length === 0 && (
        <div className="text-center py-12">
          <div className="relative mx-auto mb-4 w-12 h-12">
            <Car className="h-12 w-12" style={{ color: "#94a3b8" }} />
            <Droplets
              className="h-4 w-4 absolute -top-1 -right-1"
              style={{ color: "#06b6d4" }}
            />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: "#1e293b" }}>
            No cars found
          </h3>
          <p style={{ color: "#64748b" }}>
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Completion Confirmation Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Mark as Completed?
              </h3>
              <p className="text-gray-600 mb-6">
                A completion notification will be sent to the owner of car
                number{" "}
                {carToComplete
                  ? queueItems.find((c) => c.id === carToComplete)?.plateNumber
                  : ""}
                .
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelCompletion}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCompletion}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Yes, Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
