import React, { useState } from "react";
import {
  UserPlus,
  Key,
  Edit,
  Trash2,
  Search,
  AlertTriangle,
} from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] =
    useState<Coordinator | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-bold" style={{ color: "#1e293b" }}>
          Coordinator Management
        </h2>
        <button
          onClick={() => setShowAddCoordinatorModal(true)}
          className="flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200"
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary)";
          }}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Coordinator
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="h-4 w-4 absolute left-3 top-3"
          style={{ color: "#64748b" }}
        />
        <input
          type="text"
          placeholder="Search coordinators..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm transition-all duration-200"
          style={{
            backgroundColor: "#f8fafc",
            borderColor: "#e2e8f0",
            color: "#1e293b",
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Coordinators List */}
      <div className="space-y-4">
        {coordinators
          .filter(
            (coordinator) =>
              coordinator.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              coordinator.email.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((coordinator) => (
            <div
              key={coordinator.id}
              className="p-6 rounded-lg border transition-all duration-200 shadow-sm"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderWidth: "1px",
              }}
            >
              {/* Coordinator Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3
                    className="font-semibold text-lg mb-1"
                    style={{ color: "#1e293b" }}
                  >
                    {coordinator.name}
                  </h3>
                  <p className="text-sm" style={{ color: "#64748b" }}>
                    {coordinator.email}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleGenerateCredentials(coordinator, "coordinator")
                    }
                    className="p-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: "var(--auth-info)",
                      color: "white",
                    }}
                  >
                    <Key className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditCoordinator(coordinator)}
                    className="p-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "white",
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCoordinator(coordinator);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: "var(--auth-error)",
                      color: "white",
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Coordinator Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Assigned Sites */}
                <div
                  className="p-3 rounded-lg border shadow-sm"
                  style={{
                    borderColor: "#e2e8f0",
                    borderWidth: "1px",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-wider font-medium mb-2"
                    style={{ color: "#64748b" }}
                  >
                    Assigned Sites
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {coordinator.sites.length > 0 ? (
                      coordinator.sites.map((site, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          style={{
                            color: "#1e293b",
                          }}
                        >
                          {site}
                        </span>
                      ))
                    ) : (
                      <span
                        className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        style={{
                          backgroundColor: "#f1f5f9",
                          color: "#64748b",
                        }}
                      >
                        No sites assigned
                      </span>
                    )}
                  </div>
                </div>

                {/* Last Login */}
                <div
                  className="p-3 rounded-lg border shadow-sm"
                  style={{
                    borderColor: "#e2e8f0",
                    borderWidth: "1px",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-wider font-medium mb-1"
                    style={{ color: "#64748b" }}
                  >
                    Last Login
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#1e293b" }}
                  >
                    {coordinator.lastLogin}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCoordinator && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white bg-opacity-80 backdrop-blur-lg rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border"
            style={{ borderColor: "#e2e8f0", borderWidth: "1px" }}
          >
            <div className="flex items-center mb-4">
              <div
                className="p-2 rounded-full mr-3"
                style={{
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                }}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "#1e293b" }}
              >
                Confirm Deletion
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-sm mb-3" style={{ color: "#64748b" }}>
                Are you sure you want to permanently delete the coordinator{" "}
                <span className="font-semibold" style={{ color: "#1e293b" }}>
                  "{selectedCoordinator.name}"
                </span>
                ?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-red-700 font-medium mb-1">
                  ⚠️ This action cannot be undone
                </p>
                <p className="text-xs text-red-600">
                  This will permanently remove the coordinator and all
                  associated data including:
                </p>
                <ul className="text-xs text-red-600 mt-1 ml-4 list-disc">
                  <li>Coordinator account and login credentials</li>
                  <li>Site management assignments</li>
                  <li>Access to all managed sites</li>
                  <li>All operational permissions</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border transition-all duration-200"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteCoordinator(selectedCoordinator.id);
                  setShowDeleteModal(false);
                  setSelectedCoordinator(null);
                }}
                className="flex-1 px-4 py-2 rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
