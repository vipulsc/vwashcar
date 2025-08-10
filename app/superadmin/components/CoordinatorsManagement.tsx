import React from "react";
import { UserPlus, Key, Edit, Trash2 } from "lucide-react";
import { Coordinator } from "./types";

interface CoordinatorsManagementProps {
  coordinators: Coordinator[];
  setShowAddCoordinatorModal: (show: boolean) => void;
  handleEditCoordinator: (coordinator: Coordinator) => void;
  deleteCoordinator: (coordinatorId: number) => void;
  handleGenerateCredentials: (
    person: Coordinator,
    type: "coordinator" | "salesman"
  ) => void;
}

export const CoordinatorsManagement: React.FC<CoordinatorsManagementProps> = ({
  coordinators,
  setShowAddCoordinatorModal,
  handleEditCoordinator,
  deleteCoordinator,
  handleGenerateCredentials,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900">
          Coordinator Management
        </h2>
        <button
          onClick={() => setShowAddCoordinatorModal(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold text-sm"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Coordinator
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200">
          {coordinators.map((coordinator) => (
            <div key={coordinator.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {coordinator.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {coordinator.email}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          handleGenerateCredentials(coordinator, "coordinator")
                        }
                        className="p-2 text-green-600 bg-green-50 rounded-lg"
                      >
                        <Key className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditCoordinator(coordinator)}
                        className="p-2 text-green-600 bg-green-50 rounded-lg"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteCoordinator(coordinator.id)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                      Assigned Sites
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {coordinator.sites.length > 0 ? (
                        coordinator.sites.map((site, index) => (
                          <span
                            key={index}
                            className="inline-flex px-3 py-2 text-sm font-semibold bg-green-50 text-green-700 rounded-full border border-green-200"
                          >
                            {site}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex px-3 py-2 text-sm font-semibold bg-gray-50 text-gray-600 rounded-full border border-gray-200">
                          No sites assigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">
                    Last Login
                  </p>
                  <p className="text-sm text-gray-700 font-medium">
                    {coordinator.lastLogin}
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
