"use client";
import React from "react";
import { Check, CreditCard, DollarSign } from "lucide-react";

interface PaymentStepProps {
  formData: {
    paymentMethod: string;
  };
  setFormData: (data: any) => void;
  totalPrice: number;
}

export default function PaymentStep({ formData, setFormData, totalPrice }: PaymentStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Payment Method
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          How would you like to pay?
        </p>
      </div>

      {/* Current Total */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900">
            Total Amount:
          </span>
          <span className="text-xl font-bold text-blue-600">
            AED {totalPrice}
          </span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">
          Select Payment Method
        </h3>
        <div
          onClick={() =>
            setFormData((prev: any) => ({ ...prev, paymentMethod: "cash" }))
          }
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
            formData.paymentMethod === "cash"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  Cash Payment
                </h4>
                <p className="text-sm text-gray-600">
                  Pay when service is completed
                </p>
              </div>
            </div>
            {formData.paymentMethod === "cash" && (
              <Check className="w-6 h-6 text-blue-500" />
            )}
          </div>
        </div>

        <div
          onClick={() =>
            setFormData((prev: any) => ({ ...prev, paymentMethod: "card" }))
          }
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
            formData.paymentMethod === "card"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  Card Payment
                </h4>
                <p className="text-sm text-gray-600">
                  Secure online payment
                </p>
              </div>
            </div>
            {formData.paymentMethod === "card" && (
              <Check className="w-6 h-6 text-blue-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
