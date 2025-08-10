import React, { useState } from "react";
import { Search, Download, Car, DollarSign, CheckCircle, Clock } from "lucide-react";
import { CarStatus, Service } from "./types";

interface CarsHistoryProps {
  carsStatus: CarStatus[];
  services: Service[];
  historyFilter: {
    period: string;
    month: number;
    year: number;
    status: string;
  };
  setHistoryFilter: React.Dispatch<React.SetStateAction<{
    period: string;
    month: number;
    year: number;
    status: string;
  }>>;
  updateCarStatus: (carId: number, newStatus: "in-progress" | "completed" | "waiting") => void;
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

    // Sort cars: in-progress and waiting first, then completed
    const inProgressWaiting = filtered.filter(
      (car) => car.status === "in-progress" || car.status === "waiting"
    );
    const completed = filtered.filter((car) => car.status === "completed");

    return [...inProgressWaiting, ...completed];
  };

  const filteredCars = getFilteredCars();

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900">Cars History</h2>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={historyFilter.status}
            onChange={(e) =>
              setHistoryFilter((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="waiting">Waiting</option>
          </select>

          <select
            value={historyFilter.period}
            onChange={(e) =>
              setHistoryFilter((prev) => ({
                ...prev,
                period: e.target.value,
              }))
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          <button className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Car className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Total Cars
              </p>
              <p className="text-lg font-bold text-gray-900">
                {filteredCars.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Total Revenue
              </p>
              <p className="text-lg font-bold text-gray-900">
                AED{" "}
                {filteredCars
                  .reduce((sum, car) => sum + car.amountPaid, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Completed
              </p>
              <p className="text-lg font-bold text-gray-900">
                {
                  filteredCars.filter((car) => car.status === "completed")
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-orange-600 mr-3" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                In Progress
              </p>
              <p className="text-lg font-bold text-gray-900">
                {
                  filteredCars.filter(
                    (car) =>
                      car.status === "in-progress" || car.status === "waiting"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by car number or service..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredCars
            .filter(
              (car) =>
                car.carNumber
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                car.service.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((car) => (
              <div key={car.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {car.carNumber}
                      </h3>
                      <p className="text-sm text-gray-600">{car.site}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        car.status
                      )}`}
                    >
                      {car.status}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => updateCarStatus(car.id, "waiting")}
                        className={`px-2 py-1 text-xs rounded ${
                          car.status === "waiting"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600 hover:bg-yellow-50"
                        }`}
                      >
                        Waiting
                      </button>
                      <button
                        onClick={() => updateCarStatus(car.id, "in-progress")}
                        className={`px-2 py-1 text-xs rounded ${
                          car.status === "in-progress"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-600 hover:bg-orange-50"
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateCarStatus(car.id, "completed")}
                        className={`px-2 py-1 text-xs rounded ${
                          car.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600 hover:bg-green-50"
                        }`}
                      >
                        Complete
                      </button>
                      {(car.status === "in-progress" ||
                        car.status === "waiting") && (
                        <button
                          onClick={() => handleEditCar(car)}
                          className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-50"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                      Service
                    </p>
                    <p className="font-semibold text-gray-900">
                      {car.service}
                    </p>
                  </div>
                  {car.addons.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                        Addons
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {car.addons.map((addon, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                          >
                            {addon}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                      Service Price
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      AED {car.servicePrice}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                    Timestamp
                  </p>
                  <p className="text-sm text-gray-700">{car.timestamp}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
