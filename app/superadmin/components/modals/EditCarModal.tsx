import React from "react";
import {
  X,
  Car as SedanIcon,
  Truck as PickupIcon,
  Bike as MotorcycleIcon,
  Car,
  Truck,
  HelpCircle,
} from "lucide-react";
import { CarStatus, Service } from "../types";

const carTypes = [
  { id: "sedan", name: "Sedan", icon: SedanIcon },
  { id: "suv", name: "SUV", icon: Car },
  { id: "4x4", name: "4x4", icon: Truck },
  { id: "pickup", name: "Pick Up", icon: PickupIcon },
  { id: "motorcycle", name: "Motorcycle", icon: MotorcycleIcon },
  { id: "other", name: "Other", icon: HelpCircle },
];

interface EditCarModalProps {
  showEditCarModal: boolean;
  setShowEditCarModal: (show: boolean) => void;
  editingCar: CarStatus | null;
  editCarData: {
    service: string;
    addons: string[];
    carType: string;
    status: "in-progress" | "completed" | "waiting";
  };
  setEditCarData: React.Dispatch<
    React.SetStateAction<{
      service: string;
      addons: string[];
      carType: string;
      status: "in-progress" | "completed" | "waiting";
    }>
  >;
  services: Service[];
  handleUpdateCar: (e: React.FormEvent) => void;
}

export const EditCarModal: React.FC<EditCarModalProps> = ({
  showEditCarModal,
  setShowEditCarModal,
  editingCar,
  editCarData,
  setEditCarData,
  services,
  handleUpdateCar,
}) => {
  if (!showEditCarModal || !editingCar) return null;

  const availableAddons = services.filter(
    (service) => service.type === "addon"
  );

  const toggleAddon = (addonName: string) => {
    setEditCarData((prev) => ({
      ...prev,
      addons: prev.addons.includes(addonName)
        ? prev.addons.filter((addon) => addon !== addonName)
        : [...prev.addons, addonName],
    }));
  };

  // Function to calculate total price based on selected service, addons, and car type
  const calculateTotalPrice = (
    selectedService: string,
    selectedAddons: string[],
    selectedCarType: string
  ) => {
    let totalPrice = 0;

    // Get base service price based on car type
    const baseService = services.find(
      (service) => service.name === selectedService
    );
    if (baseService) {
      // Use the appropriate pricing based on car type
      switch (selectedCarType) {
        case "sedan":
          totalPrice += baseService.pricing.sedan;
          break;
        case "suv":
          totalPrice += baseService.pricing.suv;
          break;
        case "4x4":
          totalPrice += baseService.pricing["4x4"];
          break;
        case "pickup":
          totalPrice += baseService.pricing.pickup;
          break;
        case "motorcycle":
          totalPrice += baseService.pricing.motorcycle;
          break;
        default:
          totalPrice += baseService.pricing.sedan; // Default to sedan pricing
      }
    }

    // Add addon prices based on car type
    selectedAddons.forEach((addonName) => {
      const addonService = services.find(
        (service) => service.name === addonName
      );
      if (addonService) {
        // Use the appropriate pricing based on car type
        switch (selectedCarType) {
          case "sedan":
            totalPrice += addonService.pricing.sedan;
            break;
          case "suv":
            totalPrice += addonService.pricing.suv;
            break;
          case "4x4":
            totalPrice += addonService.pricing["4x4"];
            break;
          case "pickup":
            totalPrice += addonService.pricing.pickup;
            break;
          case "motorcycle":
            totalPrice += addonService.pricing.motorcycle;
            break;
          default:
            totalPrice += addonService.pricing.sedan; // Default to sedan pricing
        }
      }
    });

    return totalPrice;
  };

  // Update price when service, addons, or car type change
  const handleServiceChange = (serviceName: string) => {
    const newPrice = calculateTotalPrice(
      serviceName,
      editCarData.addons,
      editCarData.carType
    );
    setEditCarData((prev) => ({
      ...prev,
      service: serviceName,
    }));
  };

  const handleAddonToggle = (addonName: string) => {
    const newAddons = editCarData.addons.includes(addonName)
      ? editCarData.addons.filter((addon) => addon !== addonName)
      : [...editCarData.addons, addonName];

    const newPrice = calculateTotalPrice(
      editCarData.service,
      newAddons,
      editCarData.carType
    );
    setEditCarData((prev) => ({
      ...prev,
      addons: newAddons,
    }));
  };

  const handleCarTypeChange = (carType: string) => {
    const newPrice = calculateTotalPrice(
      editCarData.service,
      editCarData.addons,
      carType
    );
    setEditCarData((prev) => ({
      ...prev,
      carType: carType,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-black">Edit Car Details</h3>
            <p className="text-gray-600 text-sm mt-1">
              Update service and status for {editingCar.carNumber}
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
            <h4 className="font-semibold text-black mb-2">Car Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Car Number:</span>
                <p className="font-medium text-black">{editingCar.carNumber}</p>
              </div>
              <div>
                <span className="text-gray-600">Site:</span>
                <p className="font-medium text-black">{editingCar.site}</p>
              </div>
              <div>
                <span className="text-gray-600">Timestamp:</span>
                <p className="font-medium text-black">{editingCar.timestamp}</p>
              </div>
              <div>
                <span className="text-gray-600">Payment Method:</span>
                <p className="font-medium text-black capitalize">
                  {editingCar.paymentMethod}
                </p>
              </div>
            </div>
          </div>

          {/* Car Type Display */}
          <div>
            <label className="block text-sm font-semibold text-black mb-3">
              Vehicle Type
            </label>
            <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center">
                {(() => {
                  const carType = carTypes.find(
                    (ct) => ct.id === editCarData.carType
                  );
                  const Icon = carType?.icon || SedanIcon;
                  return (
                    <>
                      <Icon className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {carType?.name || "Sedan"}
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-semibold text-black mb-3">
              Service Package
            </label>
            <select
              value={editCarData.service}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
            >
              <option value="">Select a service</option>
              {services
                .filter((service) => service.type === "package")
                .map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name} - {service.description}
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
              {availableAddons.map((addon) => (
                <label
                  key={addon.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={editCarData.addons.includes(addon.name)}
                    onChange={() => handleAddonToggle(addon.name)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-black">{addon.name}</div>
                    <div className="text-sm text-gray-600">
                      {addon.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {availableAddons.length === 0 && (
              <p className="text-gray-500 text-sm italic">
                No add-on services available
              </p>
            )}
          </div>

          {/* Price Display */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-black mb-2">Calculated Price</h4>
            <div className="text-2xl font-bold text-blue-600">
              AED{" "}
              {calculateTotalPrice(
                editCarData.service,
                editCarData.addons,
                editCarData.carType
              ).toFixed(2)}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Based on {editCarData.carType || "sedan"} pricing
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
  );
};
