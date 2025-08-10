import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  PlusCircle,
  AlertTriangle,
} from "lucide-react";
import { Service } from "./types";

interface ServicesManagementProps {
  services: Service[];
  setShowAddServiceModal: (show: boolean) => void;
  handleEditService: (service: Service) => void;
  deleteService: (serviceId: number) => void;
}

export const ServicesManagement: React.FC<ServicesManagementProps> = ({
  services,
  setShowAddServiceModal,
  handleEditService,
  deleteService,
}) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const packages = services.filter((service) => service.type === "package");
  const addons = services.filter((service) => service.type === "addon");

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      deleteService(serviceToDelete.id);
      setShowDeleteConfirmation(false);
      setServiceToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setServiceToDelete(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Service Management</h2>
        <button
          onClick={() => setShowAddServiceModal(true)}
          className="flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200"
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary)";
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service/Add-on
        </button>
      </div>

      {/* Main Packages Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">Main Services</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((service) => (
            <div
              key={service.id}
              className="bg-white p-6 rounded-xl border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-bold text-gray-900">
                  {service.name}
                </h4>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditService(service)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(service)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="space-y-2">
                    <div className="text-gray-600 text-sm font-medium mb-2">
                      Pricing by Vehicle Type:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sedan:</span>
                        <span className="font-semibold text-blue-600">
                          AED {service.pricing.sedan}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">SUV:</span>
                        <span className="font-semibold text-blue-600">
                          AED {service.pricing.suv}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">4x4:</span>
                        <span className="font-semibold text-blue-600">
                          AED {service.pricing["4x4"]}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pickup:</span>
                        <span className="font-semibold text-blue-600">
                          AED {service.pricing.pickup}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Motorcycle:</span>
                        <span className="font-semibold text-blue-600">
                          AED {service.pricing.motorcycle}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Usage:</span>
                    <span className="text-gray-900 font-semibold">
                      {service.totalUsage} times
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Revenue:</span>
                    <span className="text-gray-900 font-bold">
                      AED {service.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Addons Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <PlusCircle className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-800">Add-ons</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {addons.map((service) => (
            <div
              key={service.id}
              className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-base font-semibold text-gray-900">
                  {service.name}
                </h4>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditService(service)}
                    className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(service)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="bg-green-50 p-2 rounded">
                  <div className="space-y-1">
                    <div className="text-gray-600 text-xs font-medium mb-1">
                      Pricing by Vehicle Type:
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sedan:</span>
                        <span className="font-semibold text-green-600">
                          AED {service.pricing.sedan}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">SUV:</span>
                        <span className="font-semibold text-green-600">
                          AED {service.pricing.suv}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">4x4:</span>
                        <span className="font-semibold text-green-600">
                          AED {service.pricing["4x4"]}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Pickup:</span>
                        <span className="font-semibold text-green-600">
                          AED {service.pricing.pickup}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Motorcycle:</span>
                        <span className="font-semibold text-green-600">
                          AED {service.pricing.motorcycle}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Used:</span>
                    <span className="text-gray-700 font-medium">
                      {service.totalUsage} times
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Revenue:</span>
                    <span className="text-gray-700 font-semibold">
                      AED {service.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && serviceToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white bg-opacity-80 backdrop-blur-lg rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border"
            style={{ borderColor: "#e2e8f0", borderWidth: "1px" }}
          >
            <div className="flex items-center mb-4">
              <div
                className="p-2 rounded-full mr-3"
                style={{
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                }}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "#1e293b" }}
              >
                Delete Service
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-sm mb-3" style={{ color: "#64748b" }}>
                Are you sure you want to permanently delete the service{" "}
                <span className="font-semibold" style={{ color: "#1e293b" }}>
                  &ldquo;{serviceToDelete.name}&rdquo;
                </span>
                ?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-red-700 font-medium mb-1">
                  ⚠️ This action cannot be undone
                </p>
                <p className="text-xs text-red-600">
                  This will permanently remove the service and all associated
                  data including:
                </p>
                <ul className="text-xs text-red-600 mt-1 ml-4 list-disc">
                  <li>Service configuration and pricing</li>
                  <li>Usage statistics and revenue data</li>
                  <li>All vehicle type pricing settings</li>
                  <li>Service availability across all sites</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 rounded-lg border transition-all duration-200"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                }}
              >
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
