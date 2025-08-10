import React from "react";
import { X, User, Mail, MapPin } from "lucide-react";

interface AddCoordinatorModalProps {
  showAddCoordinatorModal: boolean;
  setShowAddCoordinatorModal: (show: boolean) => void;
  newCoordinatorData: {
    name: string;
    email: string;
  };
  setNewCoordinatorData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
    }>
  >;
  handleAddCoordinator: (e: React.FormEvent) => void;
}

export const AddCoordinatorModal: React.FC<AddCoordinatorModalProps> = ({
  showAddCoordinatorModal,
  setShowAddCoordinatorModal,
  newCoordinatorData,
  setNewCoordinatorData,
  handleAddCoordinator,
}) => {
  if (!showAddCoordinatorModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-black">
              Add New Coordinator
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Create a new coordinator account
            </p>
          </div>
          <button
            onClick={() => setShowAddCoordinatorModal(false)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleAddCoordinator} className="space-y-6">
          {/* Coordinator Name */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </div>
            </label>
            <input
              type="text"
              placeholder="Enter coordinator's full name"
              value={newCoordinatorData.name}
              onChange={(e) =>
                setNewCoordinatorData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500 text-black"
              required
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </div>
            </label>
            <input
              type="email"
              placeholder="Enter coordinator's email"
              value={newCoordinatorData.email}
              onChange={(e) =>
                setNewCoordinatorData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500 text-black"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowAddCoordinatorModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors duration-200"
            >
              Add Coordinator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
