import React from "react";
import { Plus, Edit, Trash2, Banknote, CreditCard } from "lucide-react";
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
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900">
          Service & Addon Management
        </h2>
        <button
          onClick={() => setShowAddServiceModal(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service/Addon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {service.name}
              </h3>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleEditService(service)}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Price:</span>
                <span className="text-lg font-bold text-green-600">
                  AED {Math.min(...Object.values(service.pricing))} -{" "}
                  {Math.max(...Object.values(service.pricing))}
                </span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-sm">Total Usage:</span>
                  <span className="text-gray-900 font-semibold">
                    {service.totalUsage} times
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">
                      Total Revenue:
                    </span>
                    <span className="text-gray-900 font-bold">
                      AED {service.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Banknote className="h-3 w-3 text-green-600 mr-1" />
                      <span className="text-xs text-gray-600">Cash:</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">
                      AED {service.totalCashRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CreditCard className="h-3 w-3 text-blue-600 mr-1" />
                      <span className="text-xs text-gray-600">Card:</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">
                      AED {service.totalCardRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
