import React from "react";
import { Banknote, CreditCard } from "lucide-react";
import { StatCardProps, RevenueStatCardProps, SmallStatCardProps } from "./types";

export const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color = "green",
}: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-center mb-4">
      <Icon className={`h-6 w-6 text-${color}-600 mr-3`} />
      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
        {title}
      </p>
    </div>
    <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
  </div>
);

export const RevenueStatCard = ({
  icon: Icon,
  title,
  totalValue,
  cashValue,
  cardValue,
  subtitle,
}: RevenueStatCardProps) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-center mb-4">
      <Icon className="h-6 w-6 text-green-600 mr-3" />
      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
        {title}
      </p>
    </div>
    <p className="text-2xl font-bold text-gray-900 mb-3">{totalValue}</p>
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Banknote className="h-4 w-4 text-green-600 mr-2" />
          <span className="text-sm text-gray-600">Cash:</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {cashValue}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CreditCard className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-sm text-gray-600">Card:</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {cardValue}
        </span>
      </div>
    </div>
    {subtitle && <p className="text-xs text-gray-500 mt-3">{subtitle}</p>}
  </div>
);

export const SmallStatCard = ({
  icon: Icon,
  title,
  value,
  color = "green",
}: SmallStatCardProps) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
      <Icon className={`h-5 w-5 text-${color}-600`} />
    </div>
  </div>
);
