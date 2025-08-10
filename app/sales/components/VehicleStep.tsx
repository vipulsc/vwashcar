"use client";
import React, { useRef, useState } from "react";
import {
  Camera,
  Phone,
  Car as SedanIcon,
  Truck as PickupIcon,
  Bike as MotorcycleIcon,
  Car,
  Truck,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import SilentPlateScanner from "./SilentPlateScanner";

interface VehicleStepProps {
  formData: {
    plateNumber: string;
    carType: string;
    phone: string;
    countryCode: string;
  };
  setFormData: (data: any) => void;
}

const carTypes = [
  { id: "sedan", name: "Sedan", icon: SedanIcon },
  { id: "suv", name: "SUV", icon: Car },
  { id: "4x4", name: "4x4", icon: Truck },
  { id: "pickup", name: "Pick Up", icon: PickupIcon },
  { id: "motorcycle", name: "Motorcycle", icon: MotorcycleIcon },
  { id: "other", name: "Other", icon: HelpCircle },
];

const countryCodes = [
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+86", country: "China", flag: "🇨🇳" },
];

export default function VehicleStep({
  formData,
  setFormData,
}: VehicleStepProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    formData.countryCode || "+971"
  );
  const [isSilentScannerActive, setIsSilentScannerActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePlateCapture = () => {
    setIsSilentScannerActive(true);
  };

  const handlePlateDetected = (plateNumber: string) => {
    setFormData((prev: any) => ({
      ...prev,
      plateNumber: plateNumber.toUpperCase(),
    }));
    setIsSilentScannerActive(false);
  };

  const handleScannerError = (error: string) => {
    console.error("Scanner error:", error);
    setIsSilentScannerActive(false);
  };

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev: any) => ({ ...prev, plateImage: file }));
      // Process the uploaded image for plate recognition
      processUploadedImage(file);
    }
  };

  const processUploadedImage = async (file: File) => {
    setIsCapturing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.plateText && data.plateText !== "Not Detected") {
        setFormData((prev: any) => ({
          ...prev,
          plateNumber: data.plateText.toUpperCase(),
        }));
      }
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    setFormData((prev: any) => ({ ...prev, countryCode }));
    setIsCountryDropdownOpen(false);
  };

  const getFullPhoneNumber = () => {
    return selectedCountryCode + " " + (formData.phone || "");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Vehicle & Contact Details
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Enter your vehicle details and contact information
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plate Number
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.plateNumber}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  plateNumber: e.target.value.toUpperCase(),
                }))
              }
              placeholder="e.g., ABC 1234"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono tracking-wider text-center text-gray-900"
            />
            <button
              onClick={handlePlateCapture}
              disabled={isCapturing || isSilentScannerActive}
              className="px-4 py-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 relative"
              title="Scan plate with camera"
            >
              {isCapturing || isSilentScannerActive ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <span className="text-sm">
                    {isSilentScannerActive ? "Scanning..." : "Processing..."}
                  </span>
                </div>
              ) : (
                <Camera className="w-5 h-5" />
              )}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageCapture}
            className="hidden"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Vehicle Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {carTypes.map((carType) => {
              const Icon = carType.icon;
              const isSelected = formData.carType === carType.id;
              return (
                <button
                  key={carType.id}
                  onClick={() =>
                    setFormData((prev: any) => ({
                      ...prev,
                      carType: carType.id,
                    }))
                  }
                  className={`p-3 border-2 rounded-lg transition-all duration-200 flex flex-col items-center ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium text-center leading-tight">
                    {carType.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="flex gap-2">
            {/* Country Code Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="flex items-center px-3 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors min-w-[100px]"
              >
                <span className="text-lg mr-2">
                  {
                    countryCodes.find((c) => c.code === selectedCountryCode)
                      ?.flag
                  }
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedCountryCode}
                </span>
                <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
              </button>

              {isCountryDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {countryCodes.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleCountrySelect(country.code)}
                      className="w-full flex items-center px-4 py-2 hover:bg-gray-50 text-left"
                    >
                      <span className="text-lg mr-3">{country.flag}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {country.code}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {country.country}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Phone Number Input */}
            <div className="flex-1 relative">
              <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                placeholder="50 123 4567"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          {/* Display Full Phone Number */}
          {formData.phone && (
            <div className="mt-2 text-sm text-gray-600">
              Full number:{" "}
              <span className="font-medium">{getFullPhoneNumber()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Silent Plate Scanner */}
      <SilentPlateScanner
        isActive={isSilentScannerActive}
        onPlateDetected={handlePlateDetected}
        onError={handleScannerError}
      />
    </div>
  );
}
