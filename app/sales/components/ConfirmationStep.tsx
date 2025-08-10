"use client";
import React from "react";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface ConfirmationStepProps {
  bookingId: string;
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
  onBackToReview: () => void;
  onNewBooking: () => void;
  onGoHome: () => void;
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
  { id: "basic", name: "Basic" },
  { id: "jack", name: "Jack" },
  { id: "extreme", name: "Extreme" },
];

export default function ConfirmationStep({
  bookingId,
  formData,
  totalPrice,
  onBackToReview,
  onNewBooking,
  onGoHome,
}: ConfirmationStepProps) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-12 h-12 text-green-500" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-gray-600">
          Your service has been scheduled successfully
        </p>
        <div className="bg-green-50 p-3 rounded-lg mt-4">
          <p className="text-sm text-gray-600">Booking ID</p>
          <p className="text-xl font-bold text-green-600">{bookingId}</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg text-left space-y-3 text-sm">
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
        <div className="flex justify-between">
          <span className="text-gray-600">Package:</span>
          <span className="font-semibold text-gray-900">
            {servicePackages.find((p) => p.id === formData.selectedPackage)
              ?.name || "Not selected"}
          </span>
        </div>
        {formData.addOns.length > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Add-ons:</span>
            <span className="font-semibold text-gray-900">
              {formData.addOns.length} selected
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Payment:</span>
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

      <p className="text-sm text-gray-500">
        Confirmation SMS sent to your mobile with booking ID:{" "}
        <span className="font-semibold">{bookingId}</span>
      </p>

      <div className="flex flex-col gap-3 pt-4">
        <button
          onClick={onBackToReview}
          className="flex items-center justify-center px-6 py-3 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Edit Booking
        </button>

        <div className="flex gap-3">
          <button
            onClick={onGoHome}
            className="flex-1 flex items-center justify-center px-6 py-3 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Go to Home
          </button>
          <button
            onClick={onNewBooking}
            className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium"
          >
            New Booking
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
