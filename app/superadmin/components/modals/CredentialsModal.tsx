import React from "react";
import { X, Save, AlertCircle } from "lucide-react";

interface CredentialsModalProps {
  showCredentialsModal: boolean;
  setShowCredentialsModal: (show: boolean) => void;
  generatedCredentials: {
    loginId: string;
    password: string;
  } | null;
  setGeneratedCredentials: React.Dispatch<React.SetStateAction<{
    loginId: string;
    password: string;
  } | null>>;
}

export const CredentialsModal: React.FC<CredentialsModalProps> = ({
  showCredentialsModal,
  setShowCredentialsModal,
  generatedCredentials,
  setGeneratedCredentials,
}) => {
  if (!showCredentialsModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Login Credentials Generated
          </h3>
          <button
            onClick={() => setShowCredentialsModal(false)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {generatedCredentials && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Login ID
                  </label>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <span className="font-mono text-gray-900">
                      {generatedCredentials.loginId}
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          generatedCredentials.loginId
                        )
                      }
                      className="text-green-600 hover:text-green-700 p-1"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <span className="font-mono text-gray-900">
                      {generatedCredentials.password}
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          generatedCredentials.password
                        )
                      }
                      className="text-green-600 hover:text-green-700 p-1"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Save these credentials securely. They will be needed for
                dashboard access.
              </p>
            </div>

            <button
              onClick={() => {
                setShowCredentialsModal(false);
                setGeneratedCredentials(null);
              }}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
