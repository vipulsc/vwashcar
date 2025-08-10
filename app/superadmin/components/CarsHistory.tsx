import React, { useState, useEffect, useRef } from "react";
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
  Mail,
  MapPin,
  Filter,
  X,
  ChevronDown,
} from "lucide-react";
import { CarStatus, Service } from "./types";

interface CarsHistoryProps {
  carsStatus: CarStatus[];
  services: Service[];
  historyFilter: {
    period: string;
    month: number;
    year: number;
    status: string;
    site: string;
  };
  setHistoryFilter: React.Dispatch<
    React.SetStateAction<{
      period: string;
      month: number;
      year: number;
      status: string;
      site: string;
    }>
  >;
  updateCarStatus: (
    carId: number,
    newStatus: "in-progress" | "completed" | "waiting"
  ) => void;
  handleEditCar: (car: CarStatus) => void;
  getStatusColor: (status: string) => string;
}

export const CarsHistory: React.FC<CarsHistoryProps> = ({
  carsStatus,
  services,
  historyFilter,
  setHistoryFilter,
  updateCarStatus,
  handleEditCar,
  getStatusColor,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [showSiteFilter, setShowSiteFilter] = useState(false);

  // Refs for dropdown containers
  const statusFilterRef = useRef<HTMLDivElement>(null);
  const timeFilterRef = useRef<HTMLDivElement>(null);
  const siteFilterRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusFilterRef.current &&
        !statusFilterRef.current.contains(event.target as Node)
      ) {
        setShowStatusFilter(false);
      }
      if (
        timeFilterRef.current &&
        !timeFilterRef.current.contains(event.target as Node)
      ) {
        setShowTimeFilter(false);
      }
      if (
        siteFilterRef.current &&
        !siteFilterRef.current.contains(event.target as Node)
      ) {
        setShowSiteFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getFilteredCars = () => {
    let filtered = carsStatus;

    if (historyFilter.period === "today") {
      const today = new Date();
      filtered = filtered.filter(
        (car) =>
          parseInt(car.date) === today.getDate() &&
          parseInt(car.month) === today.getMonth() + 1 &&
          parseInt(car.year) === today.getFullYear()
      );
    } else if (historyFilter.period === "month") {
      filtered = filtered.filter(
        (car) =>
          parseInt(car.month) === historyFilter.month &&
          parseInt(car.year) === historyFilter.year
      );
    } else if (historyFilter.period === "year") {
      filtered = filtered.filter(
        (car) => parseInt(car.year) === historyFilter.year
      );
    }

    if (historyFilter.status !== "all") {
      filtered = filtered.filter((car) => car.status === historyFilter.status);
    }

    if (historyFilter.site !== "all") {
      filtered = filtered.filter((car) => car.site === historyFilter.site);
    }

    // Sort cars: in-progress and waiting first, then completed
    const inProgressWaiting = filtered.filter(
      (car) => car.status === "in-progress" || car.status === "waiting"
    );
    const completed = filtered.filter((car) => car.status === "completed");

    return [...inProgressWaiting, ...completed];
  };

  const filteredCars = getFilteredCars();
  const totalRevenue = filteredCars.reduce(
    (sum, car) => sum + car.amountPaid,
    0
  );
  const completedCars = filteredCars.filter(
    (car) => car.status === "completed"
  ).length;
  const activeCars = filteredCars.filter(
    (car) => car.status === "in-progress" || car.status === "waiting"
  ).length;

  // Get unique sites for the filter
  const uniqueSites = Array.from(
    new Set(carsStatus.map((car) => car.site))
  ).sort();

  // Function to get car icon based on car type
  const getCarIcon = (carNumber: string) => {
    // Extract car type from car number or service - this is a simple heuristic
    // You might want to add a carType field to your CarStatus interface for better accuracy
    const carType = carNumber.toLowerCase();

    if (
      carType.includes("motorcycle") ||
      carType.includes("bike") ||
      carType.includes("moto")
    ) {
      return <Bike className="h-5 w-5" style={{ color: "#64748b" }} />;
    } else if (
      carType.includes("truck") ||
      carType.includes("pickup") ||
      carType.includes("4x4")
    ) {
      return <Truck className="h-5 w-5" style={{ color: "#64748b" }} />;
    } else {
      return <Car className="h-5 w-5" style={{ color: "#64748b" }} />;
    }
  };

  const getCarIconLarge = (carNumber: string) => {
    const carType = carNumber.toLowerCase();

    if (
      carType.includes("motorcycle") ||
      carType.includes("bike") ||
      carType.includes("moto")
    ) {
      return <Bike className="h-6 w-6" style={{ color: "#3b82f6" }} />;
    } else if (
      carType.includes("truck") ||
      carType.includes("pickup") ||
      carType.includes("4x4")
    ) {
      return <Truck className="h-6 w-6" style={{ color: "#3b82f6" }} />;
    } else {
      return <Car className="h-6 w-6" style={{ color: "#3b82f6" }} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-bold" style={{ color: "#1e293b" }}>
          Cars History
        </h2>
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="relative" ref={statusFilterRef}>
            <button
              onClick={() => setShowStatusFilter(!showStatusFilter)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm border"
            >
              <span className="text-sm font-medium">
                {historyFilter.status === "all"
                  ? "Status"
                  : historyFilter.status}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {showStatusFilter && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                {[
                  { value: "all", label: "All Status" },
                  { value: "completed", label: "Completed" },
                  { value: "in-progress", label: "In Progress" },
                  { value: "waiting", label: "Waiting" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setHistoryFilter((prev) => ({
                        ...prev,
                        status: option.value,
                      }));
                      setShowStatusFilter(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 ${
                      historyFilter.status === option.value
                        ? "bg-blue-50 text-blue-700"
                        : ""
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time Period Filter */}
          <div className="relative" ref={timeFilterRef}>
            <button
              onClick={() => setShowTimeFilter(!showTimeFilter)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm border"
            >
              <span className="text-sm font-medium">
                {historyFilter.period === "all" ? "Time" : historyFilter.period}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {showTimeFilter && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                {[
                  { value: "all", label: "All Time" },
                  { value: "today", label: "Today" },
                  { value: "month", label: "This Month" },
                  { value: "year", label: "This Year" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setHistoryFilter((prev) => ({
                        ...prev,
                        period: option.value,
                      }));
                      setShowTimeFilter(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 ${
                      historyFilter.period === option.value
                        ? "bg-blue-50 text-blue-700"
                        : ""
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Site Filter */}
          <div className="relative" ref={siteFilterRef}>
            <button
              onClick={() => setShowSiteFilter(!showSiteFilter)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm border"
            >
              <span className="text-sm font-medium">
                {historyFilter.site === "all" ? "Site" : historyFilter.site}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {showSiteFilter && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px] max-h-48 overflow-y-auto">
                <button
                  onClick={() => {
                    setHistoryFilter((prev) => ({ ...prev, site: "all" }));
                    setShowSiteFilter(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 ${
                    historyFilter.site === "all"
                      ? "bg-blue-50 text-blue-700"
                      : ""
                  }`}
                >
                  All Sites
                </button>
                {uniqueSites.map((site) => (
                  <button
                    key={site}
                    onClick={() => {
                      setHistoryFilter((prev) => ({ ...prev, site }));
                      setShowSiteFilter(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 ${
                      historyFilter.site === site
                        ? "bg-blue-50 text-blue-700"
                        : ""
                    }`}
                  >
                    {site}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-lg border transition-all duration-200 shadow-sm"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#e2e8f0",
            borderWidth: "1px",
          }}
        >
          <div className="flex items-center">
            <div className="relative mr-3">
              {getCarIconLarge("car")}
              <Droplets
                className="h-3 w-3 absolute -top-1 -right-1"
                style={{ color: "#06b6d4" }}
              />
            </div>
            <div>
              <p
                className="text-xs uppercase tracking-wider font-medium"
                style={{ color: "#64748b" }}
              >
                Total Cars
              </p>
              <p className="text-lg font-bold" style={{ color: "#1e293b" }}>
                {filteredCars.length}
              </p>
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-lg border transition-all duration-200 shadow-sm"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#e2e8f0",
            borderWidth: "1px",
          }}
        >
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 mr-3" style={{ color: "#10b981" }} />
            <div>
              <p
                className="text-xs uppercase tracking-wider font-medium"
                style={{ color: "#64748b" }}
              >
                Total Revenue
              </p>
              <p className="text-lg font-bold" style={{ color: "#1e293b" }}>
                AED {totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-lg border transition-all duration-200 shadow-sm"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#e2e8f0",
            borderWidth: "1px",
          }}
        >
          <div className="flex items-center">
            <CheckCircle
              className="h-6 w-6 mr-3"
              style={{ color: "#10b981" }}
            />
            <div>
              <p
                className="text-xs uppercase tracking-wider font-medium"
                style={{ color: "#64748b" }}
              >
                Completed
              </p>
              <p className="text-lg font-bold" style={{ color: "#1e293b" }}>
                {completedCars}
              </p>
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-lg border transition-all duration-200 shadow-sm"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#e2e8f0",
            borderWidth: "1px",
          }}
        >
          <div className="flex items-center">
            <Clock className="h-6 w-6 mr-3" style={{ color: "#f59e0b" }} />
            <div>
              <p
                className="text-xs uppercase tracking-wider font-medium"
                style={{ color: "#64748b" }}
              >
                Active
              </p>
              <p className="text-lg font-bold" style={{ color: "#1e293b" }}>
                {activeCars}
              </p>
            </div>
          </div>
        </div>
      </div>

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
        {filteredCars
          .filter(
            (car) =>
              car.carNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
              car.service.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((car) => (
            <div
              key={car.id}
              className="p-6 rounded-lg border transition-all duration-200 shadow-sm"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderWidth: "1px",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="relative mr-3">
                    {getCarIcon(car.carNumber)}
                    <Droplets
                      className="h-2.5 w-2.5 absolute -top-0.5 -right-0.5"
                      style={{ color: "#06b6d4" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: "#1e293b" }}>
                      {car.carNumber}
                    </h3>
                    <p className="text-sm" style={{ color: "#64748b" }}>
                      {car.site} • {car.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      car.status
                    )}`}
                  >
                    {car.status}
                  </span>

                  {/* Smooth Sliding Status Toggle */}
                  <div
                    className="flex rounded-xl p-1 backdrop-blur-md border border-white/20 shadow-lg relative overflow-hidden"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {/* Animated Background Slider */}
                    <div
                      className={`absolute top-1 bottom-1 rounded-lg transition-all duration-500 ease-out ${
                        car.status === "waiting"
                          ? "left-1 w-[calc(33.333%-0.25rem)] bg-yellow-500"
                          : car.status === "in-progress"
                          ? "left-[calc(33.333%+0.25rem)] w-[calc(33.333%-0.25rem)] bg-orange-500"
                          : "left-[calc(66.666%+0.25rem)] w-[calc(33.333%-0.25rem)] bg-green-500"
                      }`}
                      style={{
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                      }}
                    />

                    <button
                      onClick={() => updateCarStatus(car.id, "waiting")}
                      className="relative px-4 py-2 text-xs font-medium rounded-lg transition-all duration-300 z-10"
                      style={{
                        color: car.status === "waiting" ? "#ffffff" : "#6b7280",
                      }}
                    >
                      Waiting
                    </button>
                    <button
                      onClick={() => updateCarStatus(car.id, "in-progress")}
                      className="relative px-4 py-2 text-xs font-medium rounded-lg transition-all duration-300 z-10"
                      style={{
                        color:
                          car.status === "in-progress" ? "#ffffff" : "#6b7280",
                      }}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => updateCarStatus(car.id, "completed")}
                      className="relative px-4 py-2 text-xs font-medium rounded-lg transition-all duration-300 z-10"
                      style={{
                        color:
                          car.status === "completed" ? "#ffffff" : "#6b7280",
                      }}
                    >
                      Complete
                    </button>
                  </div>

                  {(car.status === "in-progress" ||
                    car.status === "waiting") && (
                    <button
                      onClick={() => handleEditCar(car)}
                      className="px-3 py-2 text-xs font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p
                    className="text-xs uppercase tracking-wider font-medium mb-1"
                    style={{ color: "#64748b" }}
                  >
                    Service
                  </p>
                  <p className="font-semibold" style={{ color: "#1e293b" }}>
                    {car.service}
                  </p>
                </div>

                {car.addons.length > 0 && (
                  <div>
                    <p
                      className="text-xs uppercase tracking-wider font-medium mb-1"
                      style={{ color: "#64748b" }}
                    >
                      Add-ons
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {car.addons.map((addon, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          style={{
                            backgroundColor: "#dbeafe",
                            color: "#1d4ed8",
                            border: "1px solid #bfdbfe",
                          }}
                        >
                          {addon}
                        </span>
                      ))}
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
                    {car.paymentMethod === "cash" ? "Cash" : "Card"}
                  </p>
                  <p className="text-lg font-bold" style={{ color: "#10b981" }}>
                    AED {car.servicePrice}
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
                      +971 50 123 4567
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Empty State */}
      {filteredCars.filter(
        (car) =>
          car.carNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.service.toLowerCase().includes(searchTerm.toLowerCase())
      ).length === 0 && (
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
    </div>
  );
};
