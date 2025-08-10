import React, { useState } from "react";
import { X, AlertCircle, Edit } from "lucide-react";

interface CredentialsModalProps {
  showCredentialsModal: boolean;
  setShowCredentialsModal: (show: boolean) => void;
  generatedCredentials: {
    password: string;
    email: string;
  } | null;
  setGeneratedCredentials: React.Dispatch<
    React.SetStateAction<{
      password: string;
      email: string;
    } | null>
  >;
}

// Function to generate a strong password
const generateStrongPassword = () => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";

  let password = "";

  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest with random characters
  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = 4; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

export const CredentialsModal: React.FC<CredentialsModalProps> = ({
  showCredentialsModal,
  setShowCredentialsModal,
  generatedCredentials,
  setGeneratedCredentials,
}) => {
  const [editablePassword, setEditablePassword] = useState("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Update editable password when credentials change
  React.useEffect(() => {
    if (generatedCredentials) {
      setEditablePassword(generatedCredentials.password);
    }
  }, [generatedCredentials]);

  const handleGenerateNewPassword = () => {
    const newPassword = generateStrongPassword();
    setEditablePassword(newPassword);
    if (generatedCredentials) {
      setGeneratedCredentials({
        ...generatedCredentials,
        password: newPassword,
      });
    }
  };

  const handlePasswordChange = (newPassword: string) => {
    setEditablePassword(newPassword);
    if (generatedCredentials) {
      setGeneratedCredentials({
        ...generatedCredentials,
        password: newPassword,
      });
    }
  };

  const handleEditPassword = () => {
    setIsEditingPassword(true);
    setEditablePassword(""); // Clear the field when entering edit mode
  };

  const handleSaveClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmSave = () => {
    setShowCredentialsModal(false);
    setGeneratedCredentials(null);
    setShowConfirmation(false);
  };

  const handleCancelSave = () => {
    setShowConfirmation(false);
  };

  if (!showCredentialsModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Login Credentials</h3>
          <button
            onClick={() => setShowCredentialsModal(false)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {generatedCredentials && (
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="p-3 bg-white rounded-lg border">
                    <span className="font-mono text-gray-900">
                      {generatedCredentials.email}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                    <input
                      type="text"
                      value={editablePassword}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className="font-mono text-gray-900 bg-transparent border-none outline-none flex-1"
                      placeholder={
                        isEditingPassword
                          ? "Enter custom password"
                          : "Click to generate password"
                      }
                      readOnly={!isEditingPassword}
                      onClick={
                        !isEditingPassword
                          ? handleGenerateNewPassword
                          : undefined
                      }
                      style={{ cursor: isEditingPassword ? "text" : "pointer" }}
                      autoFocus={isEditingPassword}
                    />
                    <button
                      onClick={handleEditPassword}
                      className="text-purple-600 hover:text-purple-700 p-1"
                      title={
                        isEditingPassword
                          ? "Save custom password"
                          : "Edit password manually"
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveClick}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-sm"
            >
              Save
            </button>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Confirm Password Change
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to save this password? This will change
                  the login credentials.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelSave}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmSave}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-sm"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
