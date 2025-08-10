import React from "react";
import { X } from "lucide-react";
import { Coordinator } from "../types";

interface EditCoordinatorModalProps {
  showEditCoordinatorModal: boolean;
  setShowEditCoordinatorModal: (show: boolean) => void;
  editingCoordinator: Coordinator | null;
  editCoordinatorData: {
    name: string;
    email: string;
  };
  setEditCoordinatorData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
    }>
  >;
  handleUpdateCoordinator: (e: React.FormEvent) => void;
}

export const EditCoordinatorModal: React.FC<EditCoordinatorModalProps> = ({
  showEditCoordinatorModal,
  setShowEditCoordinatorModal,
  editingCoordinator,
  editCoordinatorData,
  setEditCoordinatorData,
  handleUpdateCoordinator,
}) => {
  if (!showEditCoordinatorModal || !editingCoordinator) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-black">Edit Coordinator</h3>
            <p className="text-gray-600 text-sm mt-1">
              Update coordinator information
            </p>
          </div>
          <button
            onClick={() => setShowEditCoordinatorModal(false)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleUpdateCoordinator} className="space-y-6">
          {/* Coordinator Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-black mb-2">
              Current Information
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Current Name:</span>
                <p className="font-medium text-black">
                  {editingCoordinator.name}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Current Email:</span>
                <p className="font-medium text-black">
                  {editingCoordinator.email}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Sites:</span>
                <p className="font-medium text-black">
                  {editingCoordinator.sites.length > 0
                    ? editingCoordinator.sites.join(", ")
                    : "No sites assigned"}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <p className="font-medium text-black capitalize">
                  {editingCoordinator.status}
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Name
            </label>
            <input
              type="text"
              value={editCoordinatorData.name}
              onChange={(e) =>
                setEditCoordinatorData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="Enter coordinator name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Email
            </label>
            <input
              type="email"
              value={editCoordinatorData.email}
              onChange={(e) =>
                setEditCoordinatorData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="Enter email address"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowEditCoordinatorModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Coordinator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
