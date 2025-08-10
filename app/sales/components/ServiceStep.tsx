"use client";
import React from "react";
import { Check } from "lucide-react";

interface ServiceStepProps {
  formData: {
    plateNumber: string;
    carType: string;
    phone: string;
    countryCode: string;
    selectedPackage: string;
    addOns: string[];
    paymentMethod: string;
    plateImage: File | null;
    manualPricing: {
      basePackagePrice: number;
      addOnPrices: { [key: string]: number };
    };
  };
  setFormData: React.Dispatch<
    React.SetStateAction<ServiceStepProps["formData"]>
  >;
}

const servicePackages = [
  {
    id: "basic",
    name: "Basic",
    price: 25,
    description: "Exterior wash & dry",
    color: "bg-blue-50 border-blue-200 text-blue-600",
  },
  {
    id: "jack",
    name: "Jack",
    price: 45,
    description: "Exterior wash, interior vacuum",
    color: "bg-green-50 border-green-200 text-green-600",
  },
  {
    id: "extreme",
    name: "Extreme",
    price: 85,
    description: "Complete wash, wax, interior detail",
    color: "bg-purple-50 border-purple-200 text-purple-600",
  },
];

const addOnServices = [
  { id: "wax", name: "Ceramic Wax", price: 35 },
  { id: "polish", name: "Paint Polish", price: 25 },
  { id: "engine", name: "Engine Clean", price: 40 },
  { id: "interior", name: "Deep Interior Clean", price: 30 },
  { id: "wheels", name: "Wheel Detail", price: 20 },
  { id: "protection", name: "Paint Protection", price: 50 },
];

export default function ServiceStep({
  formData,
  setFormData,
}: ServiceStepProps) {
  const isOtherVehicle = formData.carType === "other";

  const selectPackage = (packageId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedPackage: packageId,
    }));
  };

  const toggleAddOn = (addOnId: string) => {
    setFormData((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter((id: string) => id !== addOnId)
        : [...prev.addOns, addOnId],
    }));
  };

  const updateManualBasePrice = (price: number) => {
    setFormData((prev) => ({
      ...prev,
      manualPricing: {
        ...prev.manualPricing,
        basePackagePrice: price,
      },
    }));
  };

  const updateManualAddOnPrice = (addOnId: string, price: number) => {
    setFormData((prev) => ({
      ...prev,
      manualPricing: {
        ...prev.manualPricing,
        addOnPrices: {
          ...prev.manualPricing.addOnPrices,
          [addOnId]: price,
        },
      },
    }));
  };

  const getBasePrice = () => {
    if (isOtherVehicle && formData.manualPricing.basePackagePrice > 0) {
      return formData.manualPricing.basePackagePrice;
    }
    const selectedPackage = servicePackages.find(
      (p) => p.id === formData.selectedPackage
    );
    return selectedPackage?.price || 0;
  };

  const getAddOnsPrice = () => {
    return formData.addOns.reduce((total, addOnId) => {
      if (isOtherVehicle && formData.manualPricing.addOnPrices[addOnId]) {
        return total + formData.manualPricing.addOnPrices[addOnId];
      }
      const addOn = addOnServices.find((a) => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
  };

  const getTotalPrice = () => {
    return getBasePrice() + getAddOnsPrice();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Select Service Package
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Choose a base package and add optional services
        </p>
      </div>

      {/* Service Packages */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Base Package
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {servicePackages.map((pkg) => {
            const isSelected = formData.selectedPackage === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => selectPackage(pkg.id)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 relative ${
                  isSelected
                    ? `border-blue-500 bg-blue-50 shadow-md`
                    : `border-gray-200 hover:border-blue-300 hover:shadow-sm ${pkg.color}`
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {pkg.name}
                    </h4>
                    <p className="text-sm text-gray-600">{pkg.description}</p>
                  </div>
                  <div className="text-right">
                    {isOtherVehicle && isSelected ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">AED</span>
                        <input
                          type="number"
                          value={formData.manualPricing.basePackagePrice || ""}
                          onChange={(e) =>
                            updateManualBasePrice(Number(e.target.value) || 0)
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center font-bold text-blue-600 text-xl"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    ) : (
                      <p className="font-bold text-blue-600 text-xl">
                        AED {pkg.price}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add-ons */}
      {formData.selectedPackage && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Add-ons (Optional)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {addOnServices.map((addOn) => {
              const isSelected = formData.addOns.includes(addOn.id);
              return (
                <div
                  key={addOn.id}
                  onClick={() => toggleAddOn(addOn.id)}
                  className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 relative ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-2">
                      {addOn.name}
                    </h4>
                    {isOtherVehicle && isSelected ? (
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-xs text-gray-500">+AED</span>
                        <input
                          type="number"
                          value={
                            formData.manualPricing.addOnPrices[addOn.id] || ""
                          }
                          onChange={(e) =>
                            updateManualAddOnPrice(
                              addOn.id,
                              Number(e.target.value) || 0
                            )
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-16 px-1 py-1 border border-gray-300 rounded text-center font-bold text-blue-600 text-sm"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    ) : (
                      <p className="font-bold text-blue-600 text-sm">
                        +AED {addOn.price}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Total */}
      {formData.selectedPackage && (
        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Base Package:</span>
            <span className="font-semibold text-gray-900">
              AED {getBasePrice()}
            </span>
          </div>
          {formData.addOns.length > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Add-ons:</span>
              <span className="font-semibold text-gray-900">
                AED {getAddOnsPrice()}
              </span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total Amount:</span>
            <span className="text-xl font-bold text-blue-600">
              AED {getTotalPrice()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
