"use client";
import React, { useState } from "react";
import { ChevronRight, ChevronLeft, LogOut } from "lucide-react";
import VehicleStep from "./components/VehicleStep";
import ServiceStep from "./components/ServiceStep";
import PaymentStep from "./components/PaymentStep";
import ReviewStep from "./components/ReviewStep";
import ConfirmationStep from "./components/ConfirmationStep";
import QueueSection from "./components/QueueSection";
import StepIndicator from "./components/StepIndicator";
import ProgressBar from "./components/ProgressBar";

interface BookingFormData {
  plateNumber: string;
  carType: string;
  phone: string;
  countryCode: string;
  selectedPackage: string;
  addOns: string[];
  paymentMethod: string;
  plateImage: File | null;
}

interface QueueItem {
  id: string;
  plateNumber: string;
  servicePackage: string;
  status: "waiting" | "in-progress" | "completed";
  arrivalTime: string;
  phoneNumber?: string;
  vehicleType?: string;
  estimatedTime: number;
  priority: number;
}

export default function SalesPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"booking" | "queue">("booking");
  const [queueFilter, setQueueFilter] = useState<
    "all" | "waiting" | "in-progress" | "completed"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<BookingFormData>({
    plateNumber: "",
    carType: "",
    phone: "",
    countryCode: "",
    selectedPackage: "",
    addOns: [],
    paymentMethod: "",
    plateImage: null,
  });
  const [bookingId, setBookingId] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Sample queue data
  const [queueItems, setQueueItems] = useState<QueueItem[]>([
    {
      id: "1",
      plateNumber: "A-12345",
      servicePackage: "jack",
      status: "waiting",
      arrivalTime: "09:30 AM",
      phoneNumber: "+971 50 123 4567",
      vehicleType: "suv",
      estimatedTime: 15,
      priority: 1,
    },
    {
      id: "2",
      plateNumber: "B-67890",
      servicePackage: "basic",
      status: "in-progress",
      arrivalTime: "09:45 AM",
      phoneNumber: "+971 55 234 5678",
      vehicleType: "sedan",
      estimatedTime: 10,
      priority: 2,
    },
    {
      id: "3",
      plateNumber: "C-11111",
      servicePackage: "extreme",
      status: "waiting",
      arrivalTime: "10:00 AM",
      phoneNumber: "+971 52 345 6789",
      vehicleType: "truck",
      estimatedTime: 25,
      priority: 3,
    },
  ]);

  const generateBookingId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "CW";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirmBooking = () => {
    const id = generateBookingId();
    setBookingId(id);
    setIsConfirmed(true);
  };

  const handleNewBooking = () => {
    setCurrentStep(1);
    setFormData({
      plateNumber: "",
      carType: "",
      phone: "",
      countryCode: "",
      selectedPackage: "",
      addOns: [],
      paymentMethod: "",
      plateImage: null,
    });
    setIsConfirmed(false);
    setBookingId("");
  };

  const handleBackToReview = () => {
    setIsConfirmed(false);
  };

  const handleGoHome = () => {
    setCurrentStep(1);
    setFormData({
      plateNumber: "",
      carType: "",
      phone: "",
      countryCode: "",
      selectedPackage: "",
      addOns: [],
      paymentMethod: "",
      plateImage: null,
    });
    setIsConfirmed(false);
    setBookingId("");
  };

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("userToken");
      sessionStorage.clear();
      window.location.href = "/";
    }
  };

  // Queue management functions
  const updateQueueStatus = (
    id: string,
    status: "waiting" | "in-progress" | "completed"
  ) => {
    setQueueItems((prev) => {
      if (status === "completed") {
        // Remove completed cars from the queue
        return prev.filter((item) => item.id !== id);
      } else {
        // Update status for waiting and in-progress cars
        return prev.map((item) =>
          item.id === id ? { ...item, status } : item
        );
      }
    });
  };

  // Calculate total price
  const getBasePrice = () => {
    const servicePackages = [
      { id: "basic", price: 25 },
      { id: "jack", price: 45 },
      { id: "extreme", price: 85 },
    ];
    const selectedPackage = servicePackages.find(
      (p) => p.id === formData.selectedPackage
    );
    return selectedPackage?.price || 0;
  };

  const getAddOnsPrice = () => {
    const addOnServices = [
      { id: "wax", price: 35 },
      { id: "polish", price: 25 },
      { id: "engine", price: 40 },
      { id: "interior", price: 30 },
      { id: "wheels", price: 20 },
      { id: "protection", price: 50 },
    ];
    return formData.addOns.reduce((total, addOnId) => {
      const addOn = addOnServices.find((a) => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
  };

  const getTotalPrice = () => {
    return getBasePrice() + getAddOnsPrice();
  };

  const renderStep = () => {
    if (isConfirmed) {
      return (
        <ConfirmationStep
          bookingId={bookingId}
          formData={formData}
          totalPrice={getTotalPrice()}
          onBackToReview={handleBackToReview}
          onNewBooking={handleNewBooking}
          onGoHome={handleGoHome}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return <VehicleStep formData={formData} setFormData={setFormData} />;
      case 2:
        return <ServiceStep formData={formData} setFormData={setFormData} />;
      case 3:
        return (
          <PaymentStep
            formData={formData}
            setFormData={setFormData}
            totalPrice={getTotalPrice()}
          />
        );
      case 4:
        return (
          <ReviewStep
            formData={formData}
            totalPrice={getTotalPrice()}
            onConfirm={handleConfirmBooking}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Empty div for spacing */}
            </div>

            {/* User Avatar and Sign Out */}
            <div className="relative">
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--auth-purple)" }}
                >
                  <span className="text-white text-sm font-medium">S</span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    Sales Staff
                  </p>
                </div>
                <LogOut className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-6">
        {/* Tab Navigation - Admin Style with Shifting Animation */}
        <div className="mb-4 sm:mb-8">
          <div className="flex justify-center items-center py-2 sm:py-4 lg:py-6">
            <div
              className="flex rounded-2xl p-1 sm:p-2 relative overflow-hidden backdrop-blur-md w-full max-w-md"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Animated Background Slider */}
              <div
                className={`absolute top-2 bottom-2 rounded-xl transition-all duration-500 ease-out ${
                  activeTab === "booking"
                    ? "left-2 w-[calc(50%-0.5rem)]"
                    : "left-[calc(50%+0.5rem)] w-[calc(50%-0.5rem)]"
                }`}
                style={{
                  backgroundColor: "rgba(37, 99, 235, 0.9)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
                }}
              />

              {[
                { id: "booking", label: "New Booking" },
                { id: "queue", label: "Queue" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "booking" | "queue")}
                  className={`flex items-center justify-center px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 whitespace-nowrap relative z-10 flex-1 ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <span className="text-center leading-tight">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {activeTab === "booking" && (
            <div className="animate-fadeIn">
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
                  {activeTab === "booking" && (
                    <>
                      <ProgressBar currentStep={currentStep} totalSteps={4} />
                      <StepIndicator currentStep={currentStep} />
                    </>
                  )}

                  {renderStep()}
                  {!isConfirmed && (
                    <div className="flex justify-between mt-6 pt-4 border-t">
                      {currentStep > 1 && (
                        <button
                          onClick={handleBack}
                          className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Back
                        </button>
                      )}

                      {currentStep < 4 && (
                        <button
                          onClick={handleNext}
                          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ml-auto font-medium"
                        >
                          Continue
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "queue" && (
            <div className="animate-fadeIn">
              <QueueSection
                queueItems={queueItems}
                queueFilter={queueFilter}
                searchTerm={searchTerm}
                setQueueFilter={setQueueFilter}
                setSearchTerm={setSearchTerm}
                updateQueueStatus={updateQueueStatus}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
