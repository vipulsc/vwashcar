import React, { useState } from "react";
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";
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
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showFinalDeleteConfirmation, setShowFinalDeleteConfirmation] =
    useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);

  const handleDeleteClick = (site: Site) => {
    setSiteToDelete(site);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirmation(false);
    setShowFinalDeleteConfirmation(true);
  };

  const handleFinalConfirmDelete = () => {
    if (siteToDelete) {
      deleteSite(siteToDelete.id);
      setShowFinalDeleteConfirmation(false);
      setSiteToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setSiteToDelete(null);
  };

  const handleCancelFinalDelete = () => {
    setShowFinalDeleteConfirmation(false);
    setSiteToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-bold" style={{ color: "#1e293b" }}>
          Site Management
        </h2>
        <button
          onClick={() => setShowAddSiteModal(true)}
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
          <Plus className="h-4 w-4 mr-2" />
          Add Site
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
          placeholder="Search sites..."
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

      {/* Sites List */}
      <div className="space-y-4">
        {sites
          .filter(
            (site) =>
              site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              site.location.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((site) => (
            <div
              key={site.id}
              className="p-6 rounded-lg border transition-all duration-200 shadow-sm"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderWidth: "1px",
              }}
            >
              {/* Site Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3
                    className="font-semibold text-lg mb-1"
                    style={{ color: "#1e293b" }}
                  >
                    {site.name}
                  </h3>
                  <p className="text-sm" style={{ color: "#64748b" }}>
                    {site.location}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedSite(site);
                      setShowVisibilityModal(true);
                    }}
                    className="p-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: site.isActive
                        ? "var(--auth-success)"
                        : "var(--auth-error)",
                      color: "white",
                    }}
                  >
                    {site.isActive ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEditSite(site)}
                    className="p-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "white",
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(site)}
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

              {/* Site Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Coordinator */}
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
                    Coordinator
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#1e293b" }}
                  >
                    {site.coordinator}
                  </p>
                </div>

                {/* Salesmen */}
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
                    Salesmen
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#1e293b" }}
                  >
                    {site.salesmen.length === 0
                      ? "Unassigned"
                      : site.salesmen.join(", ")}
                  </p>
                </div>

                {/* Total Cars */}
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
                    Total Cars
                  </p>
                  <p className="text-lg font-bold" style={{ color: "#1e293b" }}>
                    {site.totalCars.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Revenue */}
              <div
                className="mt-4 p-3 rounded-lg border shadow-sm"
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
                  Total Revenue
                </p>
                <p className="text-xl font-bold" style={{ color: "#1e293b" }}>
                  AED {site.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Visibility Confirmation Modal */}
      {showVisibilityModal && selectedSite && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white bg-opacity-80 backdrop-blur-lg rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border"
            style={{ borderColor: "#e2e8f0", borderWidth: "1px" }}
          >
            <div className="flex items-center mb-4">
              <div
                className="p-2 rounded-full mr-3"
                style={{
                  backgroundColor: selectedSite.isActive
                    ? "#fef3c7"
                    : "#fef2f2",
                  color: selectedSite.isActive ? "#d97706" : "#dc2626",
                }}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "#1e293b" }}
              >
                Confirm Site{" "}
                {selectedSite.isActive ? "Deactivation" : "Activation"}
              </h3>
            </div>

            <p className="text-sm mb-6" style={{ color: "#64748b" }}>
              Are you sure you want to{" "}
              {selectedSite.isActive ? "deactivate" : "activate"} the site{" "}
              <span className="font-semibold" style={{ color: "#1e293b" }}>
                &ldquo;{selectedSite.name}&rdquo;
              </span>
              ?
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowVisibilityModal(false)}
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
                  toggleSiteVisibility(selectedSite.id);
                  setShowVisibilityModal(false);
                  setSelectedSite(null);
                }}
                className="flex-1 px-4 py-2 rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: selectedSite.isActive
                    ? "#dc2626"
                    : "#10b981",
                  color: "white",
                }}
              >
                {selectedSite.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && siteToDelete && (
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
                Delete Site
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-sm mb-3" style={{ color: "#64748b" }}>
                Are you sure you want to permanently delete the site{" "}
                <span className="font-semibold" style={{ color: "#1e293b" }}>
                  &ldquo;{siteToDelete.name}&rdquo;
                </span>
                ?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-red-700 font-medium mb-1">
                  ⚠️ This action cannot be undone
                </p>
                <p className="text-xs text-red-600">
                  This will permanently remove the site and all associated data
                  including:
                </p>
                <ul className="text-xs text-red-600 mt-1 ml-4 list-disc">
                  <li>Site configuration and settings</li>
                  <li>Revenue and transaction history</li>
                  <li>Coordinator and salesman assignments</li>
                  <li>All car wash records</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancelDelete}
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
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                }}
              >
                Delete Site
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Delete Confirmation Modal */}
      {showFinalDeleteConfirmation && siteToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white bg-opacity-80 backdrop-blur-lg rounded-lg p-4 max-w-sm w-full mx-4 shadow-xl border"
            style={{ borderColor: "#e2e8f0", borderWidth: "1px" }}
          >
            <div className="text-center">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#1e293b" }}
              >
                Are you sure?
              </h3>
              <p className="text-sm mb-6" style={{ color: "#64748b" }}>
                Delete site &ldquo;{siteToDelete.name}&rdquo;?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelFinalDelete}
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
                  onClick={handleFinalConfirmDelete}
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
        </div>
      )}
    </div>
  );
};
