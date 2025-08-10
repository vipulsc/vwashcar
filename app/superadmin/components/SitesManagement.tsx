import React, { useState } from "react";
import { Plus, Search, Eye, EyeOff, Edit, Trash2, Banknote, CreditCard } from "lucide-react";
import { Site } from "./types";

interface SitesManagementProps {
  sites: Site[];
  setSites: React.Dispatch<React.SetStateAction<Site[]>>;
  coordinators: Array<{ id: number; name: string; status: string }>;
  salesmen: Array<{ id: number; name: string; status: string }>;
  setShowAddSiteModal: (show: boolean) => void;
  handleEditSite: (site: Site) => void;
  deleteSite: (siteId: number) => void;
  toggleSiteVisibility: (siteId: number) => void;
}

export const SitesManagement: React.FC<SitesManagementProps> = ({
  sites,
  coordinators,
  salesmen,
  setShowAddSiteModal,
  handleEditSite,
  deleteSite,
  toggleSiteVisibility,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900">Site Management</h2>
        <button
          onClick={() => setShowAddSiteModal(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Site
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search sites..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {sites
            .filter(
              (site) =>
                site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                site.location.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((site) => (
              <div key={site.id} className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {site.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {site.location}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleSiteVisibility(site.id)}
                      className={`p-2 rounded-lg ${
                        site.isActive
                          ? "text-green-600 bg-green-50"
                          : "text-red-600 bg-red-50"
                      }`}
                    >
                      {site.isActive ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEditSite(site)}
                      className="p-2 text-green-600 bg-green-50 rounded-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteSite(site.id)}
                      className="p-2 text-red-600 bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-xs text-gray-600 uppercase tracking-wider font-medium mb-2">
                      Coordinator
                    </p>
                    <span
                      className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${
                        site.coordinator === "Unassigned"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-green-100 text-green-800 border border-green-300"
                      }`}
                    >
                      {site.coordinator}
                    </span>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-600 uppercase tracking-wider font-medium mb-2">
                      Salesman
                    </p>
                    <span
                      className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${
                        site.salesmen.length === 0
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-blue-100 text-blue-800 border border-blue-300"
                      }`}
                    >
                      {site.salesmen.length === 0
                        ? "Unassigned"
                        : site.salesmen.join(", ")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">
                      Total Cars
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {site.totalCars.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">
                      Revenue Breakdown
                    </p>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-gray-900">
                        AED {site.totalRevenue.toLocaleString()}
                      </p>
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
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
