"use client";
import React from "react";
import { Car, ShoppingBag, CreditCard, CheckCircle, Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { id: 1, title: "Vehicle", icon: Car },
  { id: 2, title: "Services", icon: ShoppingBag },
  { id: 3, title: "Payment", icon: CreditCard },
  { id: 4, title: "Review", icon: CheckCircle },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex justify-between items-center mb-8 px-2">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? "bg-blue-500 text-white"
                    : isActive
                    ? "bg-blue-100 text-blue-600 border-2 border-blue-500"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium text-center ${
                  isActive
                    ? "text-blue-600"
                    : isCompleted
                    ? "text-blue-500"
                    : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 sm:mx-2 ${
                  currentStep > step.id ? "bg-blue-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
