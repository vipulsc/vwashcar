"use client";
import React from "react";

interface ReviewStepProps {
  formData: {
    plateNumber: string;
    carType: string;
    phone: string;
    countryCode: string;
    selectedPackage: string;
    addOns: string[];
    paymentMethod: string;
    manualPricing: {
      basePackagePrice: number;
      addOnPrices: { [key: string]: number };
    };
  };
  totalPrice: number;
  onConfirm: () => void;
}

const carTypes = [
  { id: "sedan", name: "Sedan" },
  { id: "suv", name: "SUV" },
  { id: "4x4", name: "4x4" },
  { id: "pickup", name: "Pick Up" },
  { id: "motorcycle", name: "Motorcycle" },
  { id: "other", name: "Other" },
];

const servicePackages = [
  { id: "basic", name: "Basic", price: 25, description: "Exterior wash & dry" },
  {
    id: "jack",
    name: "Jack",
    price: 45,
    description: "Exterior wash, interior vacuum",
  },
  {
    id: "extreme",
    name: "Extreme",
    price: 85,
    description: "Complete wash, wax, interior detail",
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

export default function ReviewStep({
  formData,
  totalPrice,
  onConfirm,
}: ReviewStepProps) {
  const isOtherVehicle = formData.carType === "other";

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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Review Your Booking
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Please review your details before confirming
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Vehicle:</span>
          <span className="font-semibold text-gray-900">
            {formData.plateNumber || "Not provided"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Vehicle Type:</span>
          <span className="font-semibold text-gray-900">
            {carTypes.find((ct) => ct.id === formData.carType)?.name ||
              "Not selected"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Contact:</span>
          <span className="font-semibold text-gray-900">
            {formData.phone
              ? `${formData.countryCode || "+971"} ${formData.phone}`
              : "Not provided"}
          </span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Service Package:</span>
            <span className="font-semibold text-gray-900">
              {servicePackages.find((p) => p.id === formData.selectedPackage)
                ?.name || "Not selected"}
            </span>
          </div>
          {formData.selectedPackage && (
            <div className="flex justify-between text-sm py-1">
              <span className="text-gray-600">
                {
                  servicePackages.find((p) => p.id === formData.selectedPackage)
                    ?.description
                }
              </span>
              <span className="text-gray-900">AED {getBasePrice()}</span>
            </div>
          )}

          {formData.addOns.length > 0 && (
            <div className="mt-3">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Add-ons:</span>
                <span className="font-semibold text-gray-900">
                  {formData.addOns.length} items
                </span>
              </div>
              {formData.addOns.map((addOnId) => {
                const addOn = addOnServices.find((a) => a.id === addOnId);
                return addOn ? (
                  <div
                    key={addOnId}
                    className="flex justify-between text-sm py-1"
                  >
                    <span className="text-gray-600">{addOn.name}</span>
                    <span className="text-gray-900">+AED {addOn.price}</span>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>

        <div className="border-t pt-3 flex justify-between">
          <span className="text-gray-600">Payment Method:</span>
          <span className="font-semibold capitalize text-gray-900">
            {formData.paymentMethod || "Not selected"}
          </span>
        </div>

        <div className="border-t pt-3 flex justify-between">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-lg font-bold text-blue-600">
            AED {totalPrice}
          </span>
        </div>
      </div>

      <button
        onClick={onConfirm}
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold text-lg"
      >
        Confirm Booking
      </button>
    </div>
  );
}
