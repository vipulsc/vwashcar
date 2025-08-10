import React from "react";
import {
  MapPin,
  Users,
  UserCheck,
  DollarSign,
  Banknote,
  CreditCard,
  Plus,
  BarChart3,
  TrendingUp,
  Car,
  Clock,
  RefreshCw,
  Target,
  Activity,
  Award,
} from "lucide-react";
import { StatCard, RevenueStatCard, SmallStatCard } from "./StatCards";
import { Site, Coordinator, Salesman } from "./types";

interface OverviewProps {
  sites: Site[];
  coordinators: Coordinator[];
  salesmen: Salesman[];
  setShowAddSiteModal: (show: boolean) => void;
  setShowAddCoordinatorModal: (show: boolean) => void;
  setShowAddSalesmanModal: (show: boolean) => void;
  setActiveTab: (tab: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  sites,
  coordinators,
  salesmen,
  setShowAddSiteModal,
  setShowAddCoordinatorModal,
  setShowAddSalesmanModal,
  setActiveTab,
}) => {
  return (
    <div className="space-y-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={MapPin}
          title="Total Sites"
          value={sites.length.toString()}
          subtitle={`${
            sites.filter((s) => s.isActive).length
          } active locations`}
          iconColor="text-purple-800"
        />
        <StatCard
          icon={Users}
          title="Coordinators"
          value={coordinators.length.toString()}
          subtitle={`${
            coordinators.filter((c) => c.status === "active").length
          } active`}
          iconColor="text-purple-800"
        />
        <StatCard
          icon={UserCheck}
          title="Salesmen"
          value={salesmen.length.toString()}
          subtitle={`${
            salesmen.filter((s) => s.status === "active").length
          } active`}
          iconColor="text-purple-800"
        />
        <RevenueStatCard
          icon={DollarSign}
          title="Total Revenue"
          totalValue={`AED ${sites
            .reduce((sum, site) => sum + site.totalRevenue, 0)
            .toLocaleString()}`}
          cashValue={`AED ${sites
            .reduce((sum, site) => sum + site.totalCashRevenue, 0)
            .toLocaleString()}`}
          cardValue={`AED ${sites
            .reduce((sum, site) => sum + site.totalCardRevenue, 0)
            .toLocaleString()}`}
          subtitle="All time earnings"
          iconColor="text-green-600"
        />
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <SmallStatCard
          icon={TrendingUp}
          title="Monthly Growth"
          value="+12.5%"
          color="green"
          iconColor="text-purple-800"
        />
        <SmallStatCard
          icon={Car}
          title="Cars/Day Avg"
          value="24"
          color="blue"
          iconColor="text-purple-800"
        />
        <SmallStatCard
          icon={DollarSign}
          title="Today's Revenue"
          value={`AED ${sites
            .reduce((sum, site) => {
              const today = new Date().getDate() - 1; // Array is 0-indexed
              return sum + (site.dailyRevenue[today] || 0);
            }, 0)
            .toLocaleString()}`}
          color="green"
          iconColor="text-green-600"
        />
        <SmallStatCard
          icon={Award}
          title="Top Performer"
          value={
            sites.length > 0
              ? sites.reduce((maxSite, site) =>
                  site.totalRevenue > maxSite.totalRevenue ? site : maxSite
                ).name
              : "N/A"
          }
          color="purple"
          iconColor="text-purple-800"
        />
        <SmallStatCard
          icon={DollarSign}
          title="Revenue/Car"
          value="AED 78"
          color="green"
          iconColor="text-green-600"
        />
        <SmallStatCard
          icon={RefreshCw}
          title="Return Rate"
          value="68%"
          color="blue"
          iconColor="text-purple-800"
        />
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Payment Methods Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Banknote className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-900 font-semibold">
                  Cash Payments
                </span>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  AED{" "}
                  {sites
                    .reduce((sum, site) => sum + site.totalCashRevenue, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {(
                    (sites.reduce(
                      (sum, site) => sum + site.totalCashRevenue,
                      0
                    ) /
                      sites.reduce((sum, site) => sum + site.totalRevenue, 0)) *
                    100
                  ).toFixed(1)}
                  % of total
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-900 font-semibold">
                  Card Payments
                </span>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  AED{" "}
                  {sites
                    .reduce((sum, site) => sum + site.totalCardRevenue, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {(
                    (sites.reduce(
                      (sum, site) => sum + site.totalCardRevenue,
                      0
                    ) /
                      sites.reduce((sum, site) => sum + site.totalRevenue, 0)) *
                    100
                  ).toFixed(1)}
                  % of total
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowAddSiteModal(true)}
              className="flex flex-col items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <Plus className="h-6 w-6 mb-2" />
              <span className="font-semibold text-sm">Add Site</span>
            </button>
            <button
              onClick={() => setShowAddCoordinatorModal(true)}
              className="flex flex-col items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <Users className="h-6 w-6 mb-2" />
              <span className="font-semibold text-sm">Add Coordinator</span>
            </button>
            <button
              onClick={() => setShowAddSalesmanModal(true)}
              className="flex flex-col items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <UserCheck className="h-6 w-6 mb-2" />
              <span className="font-semibold text-sm">Add Salesman</span>
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className="flex flex-col items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <Plus className="h-6 w-6 mb-2" />
              <span className="font-semibold text-sm">Add Services</span>
            </button>
          </div>
        </div>
      </div>

      {/* Site Performance Overview */}
      <div className="bg-white p-8 rounded-lg border border-gray-200">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Site Performance Overview
          </h3>
          <p className="text-gray-600">
            Performance metrics across all locations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sites.map((site) => (
            <div
              key={site.id}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              {/* Site Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {site.name}
                  </h4>
                  <p className="text-sm text-gray-600">{site.location}</p>
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    site.isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
              </div>

              {/* Revenue */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">Total Revenue</span>
                  <span className="text-lg font-semibold text-gray-900">
                    AED {site.totalRevenue.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Banknote className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Cash</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      AED {site.totalCashRevenue.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Card</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      AED {site.totalCardRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Operations */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Car className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Total Cars</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {site.totalCars.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        {sites.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {sites.length}
                </p>
                <p className="text-sm text-gray-600">Total Sites</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  AED{" "}
                  {sites
                    .reduce((sum, site) => sum + site.totalRevenue, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Combined Revenue</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {sites
                    .reduce((sum, site) => sum + site.totalCars, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Cars</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {sites.filter((site) => site.isActive).length}
                </p>
                <p className="text-sm text-gray-600">Active Sites</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
