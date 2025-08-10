"use client";

import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  Car,
  Search,
  X,
  Phone,
  Activity,
  Droplets,
  Truck,
  Bike,
} from "lucide-react";
import {
  QueueManagementProps,
  CarInQueue,
  ServicePackage,
  AddOnService,
} from "./types";

export const QueueManagement: React.FC<QueueManagementProps> = ({
  queue,
  setQueue,
  servicePackages,
  addOnServices,
  queueFilter,
  setQueueFilter,
  searchTerm,
  setSearchTerm,
  setEditingQueue,
  showEditCarModal,
  setShowEditCarModal,
  editingCar,
  setEditingCar,
  editCarData,
  setEditCarData,
}) => {
  // State for completion confirmation
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [carToComplete, setCarToComplete] = useState<string | null>(null);
  const [completionMessage, setCompletionMessage] = useState("");
  // Filter queue to show only today's data
  const todayQueue = queue.filter((car) => {
    // Since arrivalTime is just a time string (e.g., "09:30 AM"),
    // we'll show all cars for now. In a real app, you'd have full dates.
    // For demo purposes, we'll show all cars in the queue
    return true;
  });

  // Queue management functions
  const cycleStatus = (carId: string) => {
    const car = queue.find((c: CarInQueue) => c.id === carId);
    if (!car) return;

    // If current status is "in-progress" and we're trying to complete, show confirmation
    if (car.status === "in-progress") {
      setCarToComplete(carId);
      setCompletionMessage(
        `Your car wash for ${car.plateNumber} has been completed! Your vehicle is ready for pickup. Thank you for choosing our service.`
      );
      setShowCompletionModal(true);
      return;
    }

    // For other status changes, proceed normally
    setQueue(
      queue.map((car: CarInQueue) => {
        if (car.id === carId) {
          // Cycle through: waiting -> in-progress -> completed -> waiting
          switch (car.status) {
            case "waiting":
              return { ...car, status: "in-progress" as const };
            case "completed":
              return { ...car, status: "waiting" as const };
            default:
              return car;
          }
        }
        return car;
      })
    );
  };

  const confirmCompletion = () => {
    if (carToComplete) {
      setQueue(
        queue.map((car: CarInQueue) => {
          if (car.id === carToComplete) {
            return { ...car, status: "completed" as const };
          }
          return car;
        })
      );
    }
    setShowCompletionModal(false);
    setCarToComplete(null);
    setCompletionMessage("");
  };

  const cancelCompletion = () => {
    setShowCompletionModal(false);
    setCarToComplete(null);
    setCompletionMessage("");
  };

  const updateServicePackage = (id: string, servicePackage: string) => {
    setQueue((prev: CarInQueue[]) =>
      prev.map((item: CarInQueue) =>
        item.id === id ? { ...item, servicePackage } : item
      )
    );
    setEditingQueue(null);
  };

  const toggleAddOn = (carId: string, addOnId: string) => {
    setQueue((prev: CarInQueue[]) =>
      prev.map((car: CarInQueue) => {
        if (car.id === carId) {
          const currentAddOns = car.addOns || [];
          const newAddOns = currentAddOns.includes(addOnId)
            ? currentAddOns.filter((id: string) => id !== addOnId)
            : [...currentAddOns, addOnId];
          return { ...car, addOns: newAddOns };
        }
        return car;
      })
    );
  };

  // Function to calculate total price based on selected service and addons
  const calculateTotalPrice = (
    selectedService: string,
    selectedAddOns: string[]
  ) => {
    let totalPrice = 0;

    // Get base service price
    const servicePackage = servicePackages.find(
      (p: ServicePackage) => p.id === selectedService
    );
    if (servicePackage) {
      totalPrice += servicePackage.price;
    }

    // Add addon prices
    selectedAddOns.forEach((addOnId: string) => {
      const addOn = addOnServices.find((a: AddOnService) => a.id === addOnId);
      if (addOn) {
        totalPrice += addOn.price;
      }
    });

    return totalPrice;
  };

  // Function to handle editing car details
  const handleEditCar = (car: CarInQueue) => {
    setEditingCar(car);
    setEditCarData({
      servicePackage: car.servicePackage,
      addOns: car.addOns || [],
      status: car.status,
    });
    setShowEditCarModal(true);
  };

  // Function to update car details
  const handleUpdateCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCar && editCarData.servicePackage) {
      setQueue((prev) =>
        prev.map((car) =>
          car.id === editingCar.id
            ? {
                ...car,
                servicePackage: editCarData.servicePackage,
                addOns: editCarData.addOns,
                status: editCarData.status,
              }
            : car
        )
      );
      setShowEditCarModal(false);
      setEditingCar(null);
      setEditCarData({
        servicePackage: "",
        addOns: [],
        status: "waiting",
      });
    }
  };

  const getAddOnsTotal = (addOns: string[] = []) => {
    return addOns.reduce((total: number, addOnId: string) => {
      const addOn = addOnServices.find((a: AddOnService) => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
  };

  const getServiceTotal = (car: CarInQueue) => {
    const servicePackage = servicePackages.find(
      (p: ServicePackage) => p.id === car.servicePackage
    );
    const addOnsTotal = getAddOnsTotal(car.addOns);
    return (servicePackage?.price || 0) + addOnsTotal;
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in-progress":
        return <Activity className="w-4 h-4" />;
      case "waiting":
        return <Clock className="w-4 h-4" />;
      default:
        return <Car className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
    }).format(amount);
  };

  const filteredQueue = todayQueue.filter((car: CarInQueue) => {
    const matchesFilter = queueFilter === "all" || car.status === queueFilter;

    if (searchTerm === "") {
      return matchesFilter;
    }

    const searchLower = searchTerm.toLowerCase().trim();

    // Search in multiple fields
    const matchesPlate = car.plateNumber.toLowerCase().includes(searchLower);

    const matchesService =
      servicePackages
        .find((p: ServicePackage) => p.id === car.servicePackage)
        ?.name.toLowerCase()
        .includes(searchLower) || false;
    const matchesPhone = car.phoneNumber?.includes(searchTerm) || false;
    const matchesId = car.id.toLowerCase().includes(searchLower);

    const matchesSearch =
      matchesPlate || matchesService || matchesPhone || matchesId;

    return matchesFilter && matchesSearch;
  });

  // Function to highlight search terms in text
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold rounded px-1">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const getFilterCount = (
    status: "all" | "waiting" | "in-progress" | "completed"
  ) => {
    if (status === "all") return todayQueue.length;
    return todayQueue.filter((car: CarInQueue) => car.status === status).length;
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Queue Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Track and manage today's car wash progress in real-time
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-auto lg:min-w-[320px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search plate, customer, service, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full text-sm text-gray-900 placeholder-gray-500 bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs - Mobile Optimized */}
        <div className="mt-4 sm:mt-6">
          <div className="flex justify-center sm:justify-start items-center py-3 sm:py-4">
            <div
              className="flex rounded-2xl p-1 relative overflow-hidden backdrop-blur-md w-full max-w-xs sm:max-w-md lg:max-w-lg"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Animated Background Slider */}
              <div
                className={`absolute top-1 bottom-1 rounded-xl transition-all duration-500 ease-out ${
                  queueFilter === "all"
                    ? "left-1 w-[calc(25%-0.5rem)]"
                    : queueFilter === "waiting"
                    ? "left-[calc(25%+0.5rem)] w-[calc(25%-0.5rem)]"
                    : queueFilter === "in-progress"
                    ? "left-[calc(50%+0.5rem)] w-[calc(25%-0.5rem)]"
                    : "left-[calc(75%+0.5rem)] w-[calc(25%-0.5rem)]"
                }`}
                style={{
                  backgroundColor: "rgba(37, 99, 235, 0.9)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
                }}
              />

              {(["all", "waiting", "in-progress", "completed"] as const).map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setQueueFilter(filter)}
                    className={`flex items-center justify-center px-1 py-2 rounded-xl font-semibold text-xs transition-all duration-300 relative z-10 flex-1 min-h-[36px] text-center ${
                      queueFilter === filter
                        ? "text-white font-bold"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-0.5 sm:space-y-0 sm:space-x-1.5 text-center w-full">
                      <span className="capitalize text-xs leading-tight text-center">
                        {filter === "in-progress"
                          ? "Progress"
                          : filter === "completed"
                          ? "Done"
                          : filter.replace("-", " ")}
                      </span>
                      <span
                        className={`px-1 py-0.5 rounded-full text-xs font-medium ${
                          queueFilter === filter
                            ? "bg-white text-blue-600 font-semibold"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {getFilterCount(filter)}
                      </span>
                    </div>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Queue List - Superadmin Style */}
      <div className="space-y-4">
        {filteredQueue.map((car, index) => (
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
                      {highlightSearchTerm(car.plateNumber, searchTerm)}
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
                    onClick={() => cycleStatus(car.id)}
                    className="relative flex-1 px-3 py-1.5 sm:py-2 text-xs font-medium rounded-lg transition-all duration-300 z-10 whitespace-nowrap min-w-0"
                    style={{
                      color: car.status === "waiting" ? "#ffffff" : "#6b7280",
                    }}
                  >
                    Waiting
                  </button>
                  <button
                    onClick={() => cycleStatus(car.id)}
                    className="relative flex-1 px-3 py-1.5 sm:py-2 text-xs font-medium rounded-lg transition-all duration-300 z-10 whitespace-nowrap min-w-0"
                    style={{
                      color:
                        car.status === "in-progress" ? "#ffffff" : "#6b7280",
                    }}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => cycleStatus(car.id)}
                    className="relative flex-1 px-3 py-1.5 sm:py-2 text-xs font-medium rounded-lg transition-all duration-300 z-10 whitespace-nowrap min-w-0"
                    style={{
                      color: car.status === "completed" ? "#ffffff" : "#6b7280",
                    }}
                  >
                    Complete
                  </button>
                </div>

                {(car.status === "in-progress" || car.status === "waiting") && (
                  <button
                    onClick={() => handleEditCar(car)}
                    className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Edit
                  </button>
                )}
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
                    {highlightSearchTerm(car.phoneNumber || "", searchTerm)}
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

      {/* Edit Car Modal - Superadmin Style */}
      {showEditCarModal && editingCar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-black">
                  Edit Car Details
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Update service and status for {editingCar.plateNumber}
                </p>
              </div>
              <button
                onClick={() => setShowEditCarModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCar} className="space-y-6">
              {/* Car Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-black mb-2">
                  Car Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Car Number:</span>
                    <p className="font-medium text-black">
                      {editingCar.plateNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Vehicle Type:</span>
                    <p className="font-medium text-black">
                      {editingCar.vehicleType || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Arrival Time:</span>
                    <p className="font-medium text-black">
                      {editingCar.arrivalTime}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium text-black">
                      {editingCar.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Service Package
                </label>
                <select
                  value={editCarData.servicePackage}
                  onChange={(e) =>
                    setEditCarData({
                      ...editCarData,
                      servicePackage: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  required
                >
                  <option value="">Select a service</option>
                  {servicePackages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - {pkg.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add-ons Selection */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Add-on Services
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addOnServices.map((addOn) => (
                    <label
                      key={addOn.id}
                      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={editCarData.addOns.includes(addOn.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditCarData({
                              ...editCarData,
                              addOns: [...editCarData.addOns, addOn.id],
                            });
                          } else {
                            setEditCarData({
                              ...editCarData,
                              addOns: editCarData.addOns.filter(
                                (id) => id !== addOn.id
                              ),
                            });
                          }
                        }}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <div className="font-medium text-black">
                          {addOn.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          +{formatCurrency(addOn.price)}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-black mb-2">
                  Calculated Price
                </h4>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    calculateTotalPrice(
                      editCarData.servicePackage,
                      editCarData.addOns
                    )
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Based on selected service and add-ons
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditCarModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Car
                </button>
              </div>
            </form>
          </div>
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
                  ? queue.find((c) => c.id === carToComplete)?.plateNumber
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
};
