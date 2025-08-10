import React from "react";
import { X } from "lucide-react";
import { Site, Coordinator, Salesman } from "../types";

interface EditSiteModalProps {
  showEditSiteModal: boolean;
  setShowEditSiteModal: (show: boolean) => void;
  editingSite: Site | null;
  editSiteData: {
    name: string;
    location: string;
    coordinator: string;
    salesmen: string[];
  };
  setEditSiteData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      location: string;
      coordinator: string;
      salesmen: string[];
    }>
  >;
  coordinators: Coordinator[];
  salesmen: Salesman[];
  handleUpdateSite: (e: React.FormEvent) => void;
}

export const EditSiteModal: React.FC<EditSiteModalProps> = ({
  showEditSiteModal,
  setShowEditSiteModal,
  editingSite,
  editSiteData,
  setEditSiteData,
  coordinators,
  salesmen,
  handleUpdateSite,
}) => {
  if (!showEditSiteModal || !editingSite) return null;

  const toggleSalesman = (salesmanName: string) => {
    setEditSiteData((prev) => ({
      ...prev,
      salesmen: prev.salesmen.includes(salesmanName)
        ? prev.salesmen.filter((name) => name !== salesmanName)
        : [...prev.salesmen, salesmanName],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-black">Edit Site</h3>
            <p className="text-gray-600 text-sm mt-1">
              Update site information and assignments
            </p>
          </div>
          <button
            onClick={() => setShowEditSiteModal(false)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleUpdateSite} className="space-y-6">
          {/* Site Name */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={editSiteData.name}
              onChange={(e) =>
                setEditSiteData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="Enter site name"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Location
            </label>
            <input
              type="text"
              value={editSiteData.location}
              onChange={(e) =>
                setEditSiteData((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="Enter location"
              required
            />
          </div>

          {/* Coordinator Selection */}
          <div>
            <label className="block text-sm font-semibold text-black mb-3">
              Coordinator
            </label>
            <select
              value={editSiteData.coordinator}
              onChange={(e) =>
                setEditSiteData((prev) => ({
                  ...prev,
                  coordinator: e.target.value,
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="">Select a coordinator</option>
              {coordinators.map((coordinator) => (
                <option key={coordinator.id} value={coordinator.name}>
                  {coordinator.name} ({coordinator.email})
                </option>
              ))}
            </select>
          </div>

          {/* Salesmen Selection */}
          <div>
            <label className="block text-sm font-semibold text-black mb-3">
              Salesmen
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {salesmen.map((salesman) => (
                <label
                  key={salesman.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={editSiteData.salesmen.includes(salesman.name)}
                    onChange={() => toggleSalesman(salesman.name)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-black">
                      {salesman.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {salesman.email}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {salesmen.length === 0 && (
              <p className="text-gray-500 text-sm italic">
                No salesmen available
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowEditSiteModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
