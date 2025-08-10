import React, { useState } from "react";
import {
  UserCheck,
  Key,
  Edit,
  Trash2,
  Search,
  AlertTriangle,
} from "lucide-react";
import { Salesman } from "./types";

interface SalesmenManagementProps {
  salesmen: Salesman[];
  setShowAddSalesmanModal: (show: boolean) => void;
  handleEditSalesman: (salesman: Salesman) => void;
  deleteSalesman: (salesmanId: number) => void;
  handleGenerateCredentials: (
    person: Salesman,
    type: "coordinator" | "salesman"
  ) => void;
}

export const SalesmenManagement: React.FC<SalesmenManagementProps> = ({
  salesmen,
  setShowAddSalesmanModal,
  handleEditSalesman,
  deleteSalesman,
  handleGenerateCredentials,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSalesman, setSelectedSalesman] = useState<Salesman | null>(
    null
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-bold" style={{ color: "#1e293b" }}>
          Salesman Management
        </h2>
        <button
          onClick={() => setShowAddSalesmanModal(true)}
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
          <UserCheck className="h-4 w-4 mr-2" />
          Add Salesman
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
          placeholder="Search salesmen..."
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

      {/* Salesmen List */}
      <div className="space-y-4">
        {salesmen
          .filter(
            (salesman) =>
              salesman.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              salesman.email.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((salesman) => (
            <div
              key={salesman.id}
              className="p-6 rounded-lg border transition-all duration-200 shadow-sm"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderWidth: "1px",
              }}
            >
              {/* Salesman Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3
                    className="font-semibold text-lg mb-1"
                    style={{ color: "#1e293b" }}
                  >
                    {salesman.name}
                  </h3>
                  <p className="text-sm" style={{ color: "#64748b" }}>
                    {salesman.email}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleGenerateCredentials(salesman, "salesman")
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
                    onClick={() => handleEditSalesman(salesman)}
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
                      setSelectedSalesman(salesman);
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

              {/* Salesman Details */}
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
                    {salesman.sites.length > 0 ? (
                      salesman.sites.map((site, index) => (
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
                    {salesman.lastLogin}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedSalesman && (
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

            <p className="text-sm mb-6" style={{ color: "#64748b" }}>
              Are you sure you want to delete the salesman{" "}
              <span className="font-semibold" style={{ color: "#1e293b" }}>
                &ldquo;{selectedSalesman.name}&rdquo;
              </span>
              ?
            </p>

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
                  deleteSalesman(selectedSalesman.id);
                  setShowDeleteModal(false);
                  setSelectedSalesman(null);
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
