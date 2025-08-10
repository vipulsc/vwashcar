import React from "react";
import {
  DollarSign,
  Car,
  Clock,
  Activity,
  TrendingUp,
  Users,
} from "lucide-react";
import { DashboardProps } from "./types";
import { StatCard, RevenueStatCard, SmallStatCard } from "./StatCards";

export const Dashboard: React.FC<DashboardProps> = ({
  todayRevenue,
  todayStats,
  queue,
  servicePackages,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
    }).format(amount);
  };

  // Filter queue to show only today's data
  const todayQueue = queue.filter(() => {
    // Since arrivalTime is just a time string (e.g., "09:30 AM"),
    // we'll show all cars for now. In a real app, you'd have full dates.
    // For demo purposes, we'll show all cars in the queue
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-700 bg-green-50 border-green-200";
      case "waiting":
        return "text-red-700 bg-red-50 border-red-200";
      case "in-progress":
        return "text-orange-700 bg-orange-50 border-orange-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Car}
          title="Cars in Queue"
          value={todayQueue
            .filter((car) => car.status !== "completed")
            .length.toString()}
          subtitle={`${
            todayQueue.filter((car) => car.status === "waiting").length
          } waiting`}
          color="purple"
          iconColor="text-purple-600"
        />
        <StatCard
          icon={Activity}
          title="In Progress"
          value={todayQueue
            .filter((car) => car.status === "in-progress")
            .length.toString()}
          subtitle="Currently being washed"
          color="orange"
          iconColor="text-orange-600"
        />
        <StatCard
          icon={Clock}
          title="Completed Today"
          value={todayQueue
            .filter((car) => car.status === "completed")
            .length.toString()}
          subtitle="Services finished"
          color="green"
          iconColor="text-green-600"
        />
        <RevenueStatCard
          icon={DollarSign}
          title="Today's Revenue"
          totalValue={formatCurrency(todayRevenue.total)}
          cashValue={formatCurrency(todayRevenue.cash)}
          cardValue={formatCurrency(todayRevenue.card)}
          subtitle="Today's earnings"
          iconColor="text-green-600"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SmallStatCard
          icon={TrendingUp}
          title="Active Cars"
          value={queue
            .filter((car) => car.status !== "completed")
            .length.toString()}
          color="yellow"
          iconColor="text-yellow-600"
        />
        <SmallStatCard
          icon={Users}
          title="Total Customers"
          value={todayStats.totalCustomers.toString()}
          color="blue"
          iconColor="text-blue-600"
        />
        <SmallStatCard
          icon={Activity}
          title="Services Completed"
          value={todayStats.servicesCompleted.toString()}
          color="green"
          iconColor="text-green-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Today&apos;s Activity
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Recent car wash activities and status updates
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {todayQueue.slice(0, 5).map((car) => (
              <div
                key={car.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Car className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {car.plateNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      {servicePackages.find((p) => p.id === car.servicePackage)
                        ?.name || "Unknown"}{" "}
                      • {car.vehicleType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                      car.status
                    )}`}
                  >
                    {car.status.replace("-", " ")}
                  </span>
                  <span className="text-xs text-gray-500">
                    {car.arrivalTime}
                  </span>
                </div>
              </div>
            ))}
            {todayQueue.length === 0 && (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">
                  No cars in queue today
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Cars will appear here once they join the queue
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
