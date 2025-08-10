import React from "react";
import { X } from "lucide-react";
import { Service } from "../types";

interface EditServiceModalProps {
  showEditServiceModal: boolean;
  setShowEditServiceModal: (show: boolean) => void;
  editingService: Service | null;
  editServiceData: {
    name: string;
    type: "package" | "addon";
    pricing: {
      sedan: string;
      suv: string;
      "4x4": string;
      pickup: string;
      motorcycle: string;
    };
  };
  setEditServiceData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      type: "package" | "addon";
      pricing: {
        sedan: string;
        suv: string;
        "4x4": string;
        pickup: string;
        motorcycle: string;
      };
    }>
  >;
  handleUpdateService: (e: React.FormEvent) => void;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  showEditServiceModal,
  setShowEditServiceModal,
  editingService,
  editServiceData,
  setEditServiceData,
  handleUpdateService,
}) => {
  if (!showEditServiceModal || !editingService) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-black">Edit Service</h3>
            <p className="text-gray-600 text-sm mt-1">
              Update service information and pricing
            </p>
          </div>
          <button
            onClick={() => setShowEditServiceModal(false)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleUpdateService} className="space-y-6">
          {/* Service Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-black mb-2">
              Current Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Current Name:</span>
                <p className="font-medium text-black">{editingService.name}</p>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <p className="font-medium text-black capitalize">
                  {editingService.type}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Total Usage:</span>
                <p className="font-medium text-black">
                  {editingService.totalUsage}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Total Revenue:</span>
                <p className="font-medium text-black">
                  AED {editingService.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Service Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-black mb-3">
              Service Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setEditServiceData((prev) => ({ ...prev, type: "package" }))
                }
                className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                  editServiceData.type === "package"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="font-semibold text-sm text-black">
                  Main Service Package
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Primary car wash services
                </div>
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditServiceData((prev) => ({ ...prev, type: "addon" }))
                }
                className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                  editServiceData.type === "addon"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="font-semibold text-sm text-black">
                  Add-on Service
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Additional services
                </div>
              </button>
            </div>
          </div>

          {/* Service Name */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Service Name
            </label>
            <input
              type="text"
              value={editServiceData.name}
              onChange={(e) =>
                setEditServiceData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="Enter service name"
              required
            />
          </div>



          {/* Pricing Section */}
          <div>
            <label className="block text-sm font-semibold text-black mb-3">
              Pricing (AED)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Sedan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sedan
                </label>
                <input
                  type="number"
                  value={editServiceData.pricing.sedan}
                  onChange={(e) =>
                    setEditServiceData((prev) => ({
                      ...prev,
                      pricing: { ...prev.pricing, sedan: e.target.value },
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* SUV */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SUV
                </label>
                <input
                  type="number"
                  value={editServiceData.pricing.suv}
                  onChange={(e) =>
                    setEditServiceData((prev) => ({
                      ...prev,
                      pricing: { ...prev.pricing, suv: e.target.value },
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* 4x4 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  4x4
                </label>
                <input
                  type="number"
                  value={editServiceData.pricing["4x4"]}
                  onChange={(e) =>
                    setEditServiceData((prev) => ({
                      ...prev,
                      pricing: { ...prev.pricing, "4x4": e.target.value },
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Pickup */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup
                </label>
                <input
                  type="number"
                  value={editServiceData.pricing.pickup}
                  onChange={(e) =>
                    setEditServiceData((prev) => ({
                      ...prev,
                      pricing: { ...prev.pricing, pickup: e.target.value },
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Motorcycle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motorcycle
                </label>
                <input
                  type="number"
                  value={editServiceData.pricing.motorcycle}
                  onChange={(e) =>
                    setEditServiceData((prev) => ({
                      ...prev,
                      pricing: { ...prev.pricing, motorcycle: e.target.value },
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowEditServiceModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
