import React from "react";
import { X } from "lucide-react";

interface AddSiteModalProps {
  showAddSiteModal: boolean;
  setShowAddSiteModal: (show: boolean) => void;
  newSiteData: {
    name: string;
    location: string;
    coordinator: string;
    salesmen: string[];
  };
  setNewSiteData: React.Dispatch<React.SetStateAction<{
    name: string;
    location: string;
    coordinator: string;
    salesmen: string[];
  }>>;
  coordinators: Array<{ id: number; name: string; status: string }>;
  salesmen: Array<{ id: number; name: string; status: string }>;
  handleAddSite: (e: React.FormEvent) => void;
}

export const AddSiteModal: React.FC<AddSiteModalProps> = ({
  showAddSiteModal,
  setShowAddSiteModal,
  newSiteData,
  setNewSiteData,
  coordinators,
  salesmen,
  handleAddSite,
}) => {
  if (!showAddSiteModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Add New Site</h3>
            <p className="text-gray-600 text-sm mt-1">
              Create a new car wash location
            </p>
          </div>
          <button
            onClick={() => setShowAddSiteModal(false)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleAddSite} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              placeholder="Enter site name"
              value={newSiteData.name}
              onChange={(e) =>
                setNewSiteData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="Enter location address"
              value={newSiteData.location}
              onChange={(e) =>
                setNewSiteData((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Coordinator
            </label>
            <select
              value={newSiteData.coordinator}
              onChange={(e) =>
                setNewSiteData((prev) => ({
                  ...prev,
                  coordinator: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-black"
            >
              <option value="">Select coordinator (optional)</option>
              {coordinators
                .filter((coord) => coord.status === "active")
                .map((coord) => (
                  <option key={coord.id} value={coord.name}>
                    {coord.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Salesmen (multiple selection allowed)
            </label>
            <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto">
              {salesmen.filter((sales) => sales.status === "active").length ===
              0 ? (
                <p className="text-gray-500 text-sm">
                  No active salesmen available
                </p>
              ) : (
                salesmen
                  .filter((sales) => sales.status === "active")
                  .map((sales) => (
                    <label
                      key={sales.id}
                      className="flex items-center space-x-2 py-1"
                    >
                      <input
                        type="checkbox"
                        checked={newSiteData.salesmen.includes(sales.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewSiteData((prev) => ({
                              ...prev,
                              salesmen: [...prev.salesmen, sales.name],
                            }));
                          } else {
                            setNewSiteData((prev) => ({
                              ...prev,
                              salesmen: prev.salesmen.filter(
                                (name) => name !== sales.name
                              ),
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">
                        {sales.name}
                      </span>
                    </label>
                  ))
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddSiteModal(false);
                setNewSiteData({
                  name: "",
                  location: "",
                  coordinator: "",
                  salesmen: [],
                });
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm"
            >
              Add Site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
