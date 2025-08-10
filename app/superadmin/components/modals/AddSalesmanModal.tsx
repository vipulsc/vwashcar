import React from "react";
import { X, User, Mail, DollarSign } from "lucide-react";

interface AddSalesmanModalProps {
  showAddSalesmanModal: boolean;
  setShowAddSalesmanModal: (show: boolean) => void;
  newSalesmanData: {
    name: string;
    email: string;
  };
  setNewSalesmanData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
    }>
  >;
  handleAddSalesman: (e: React.FormEvent) => void;
}

export const AddSalesmanModal: React.FC<AddSalesmanModalProps> = ({
  showAddSalesmanModal,
  setShowAddSalesmanModal,
  newSalesmanData,
  setNewSalesmanData,
  handleAddSalesman,
}) => {
  if (!showAddSalesmanModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-black">Add New Salesman</h3>
            <p className="text-gray-600 text-sm mt-1">
              Create a new salesman account
            </p>
          </div>
          <button
            onClick={() => setShowAddSalesmanModal(false)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleAddSalesman} className="space-y-6">
          {/* Salesman Name */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </div>
            </label>
            <input
              type="text"
              placeholder="Enter salesman's full name"
              value={newSalesmanData.name}
              onChange={(e) =>
                setNewSalesmanData((prev) => ({
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
              placeholder="Enter salesman's email"
              value={newSalesmanData.email}
              onChange={(e) =>
                setNewSalesmanData((prev) => ({
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
              onClick={() => setShowAddSalesmanModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors duration-200"
            >
              Add Salesman
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
