import React from "react";
import { X } from "lucide-react";

interface AddServiceModalProps {
  showAddServiceModal: boolean;
  setShowAddServiceModal: (show: boolean) => void;
  newServiceData: {
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
  setNewServiceData: React.Dispatch<
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
  handleAddService: (e: React.FormEvent) => void;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  showAddServiceModal,
  setShowAddServiceModal,
  newServiceData,
  setNewServiceData,
  handleAddService,
}) => {
  if (!showAddServiceModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-black">Add New Service</h3>
            <p className="text-gray-600 text-sm mt-1">
              Create a new service package or add-on
            </p>
          </div>
          <button
            onClick={() => setShowAddServiceModal(false)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleAddService} className="space-y-6">
          {/* Service Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-black mb-3">
              Service Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setNewServiceData((prev) => ({ ...prev, type: "package" }))
                }
                className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                  newServiceData.type === "package"
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
                  setNewServiceData((prev) => ({ ...prev, type: "addon" }))
                }
                className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                  newServiceData.type === "addon"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="font-semibold text-sm text-black">
                  Add-on Service
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Additional services and upgrades
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
              placeholder="Enter service name"
              value={newServiceData.name}
              onChange={(e) =>
                setNewServiceData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500 text-black"
            />
          </div>



          {/* Pricing Section */}
          <div>
            <label className="block text-sm font-semibold text-black mb-3">
              Pricing by Vehicle Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Sedan
                </label>
                <input
                  type="number"
                  placeholder="AED"
                  value={newServiceData.pricing.sedan}
                  onChange={(e) =>
                    setNewServiceData((prev) => ({
                      ...prev,
                      pricing: { ...prev.pricing, sedan: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500 text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  SUV
                </label>
                <input
                  type="number"
                  placeholder="AED"
                  value={newServiceData.pricing.suv}
                  onChange={(e) =>
                    setNewServiceData((prev) => ({
                      ...prev,
                      pricing: { ...prev.pricing, suv: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500 text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  4x4
                </label>
                <input
                  type="number"
                  placeholder="AED"
                  value={newServiceData.pricing["4x4"]}
                  onChange={(e) =>
                    setNewServiceData((prev) => ({
                      ...prev,
                      pricing: { ...prev.pricing, "4x4": e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500 text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Pickup
                </label>
                <input
                  type="number"
                  placeholder="AED"
                  value={newServiceData.pricing.pickup}
                  onChange={(e) =>
                    setNewServiceData((prev) => ({
                      ...prev,
                      pricing: { ...prev.pricing, pickup: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500 text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Motorcycle
                </label>
                <input
                  type="number"
                  placeholder="AED"
                  value={newServiceData.pricing.motorcycle}
                  onChange={(e) =>
                    setNewServiceData((prev) => ({
                      ...prev,
                      pricing: { ...prev.pricing, motorcycle: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500 text-black"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowAddServiceModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors duration-200"
            >
              Add Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
