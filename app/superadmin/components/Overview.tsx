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
        <SmallStatCard
          icon={Target}
          title="Peak Hours"
          value="2-5 PM"
          color="orange"
          iconColor="text-red-500"
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
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Site Performance Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sites.map((site) => (
            <div key={site.id} className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      site.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{site.name}</h4>
                    <p className="text-sm text-gray-600">{site.location}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">
                    Revenue Breakdown
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-900">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        AED {site.totalRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Banknote className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-xs text-gray-600">Cash:</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        AED {site.totalCashRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <CreditCard className="h-3 w-3 text-blue-600 mr-1" />
                        <span className="text-xs text-gray-600">Card:</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        AED {site.totalCardRevenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                    Total Cars
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {site.totalCars.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
