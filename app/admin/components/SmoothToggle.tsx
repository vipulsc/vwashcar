import React from "react";

interface SmoothToggleProps {
  isActive: boolean;
  onToggle: () => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export const SmoothToggle: React.FC<SmoothToggleProps> = ({
  isActive,
  onToggle,
  label,
  size = "md",
  disabled = false,
}) => {
  const sizeClasses = {
    sm: "w-8 h-4",
    md: "w-12 h-6",
    lg: "w-16 h-8",
  };

  const knobSizeClasses = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  const knobTranslateClasses = {
    sm: "translate-x-4",
    md: "translate-x-6",
    lg: "translate-x-8",
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`
          relative inline-flex items-center rounded-full transition-smooth-slow
          ${sizeClasses[size]}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${
            isActive
              ? "bg-purple-600 shadow-lg shadow-purple-200"
              : "bg-gray-200 hover:bg-gray-300"
          }
        `}
      >
        <span
          className={`
            inline-block rounded-full bg-white shadow-md transition-smooth-slow
            ${knobSizeClasses[size]}
            ${isActive ? knobTranslateClasses[size] : "translate-x-0.5"}
          `}
        />
      </button>
      {label && (
        <span
          className={`text-sm font-medium ${
            disabled ? "text-gray-400" : "text-gray-700"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
};

// Status Toggle Component
interface StatusToggleProps {
  status: "waiting" | "in-progress" | "completed";
  onStatusChange: (status: "waiting" | "in-progress" | "completed") => void;
  disabled?: boolean;
}

export const StatusToggle: React.FC<StatusToggleProps> = ({
  status,
  onStatusChange,
  disabled = false,
}) => {
  const getStatusColor = (currentStatus: string) => {
    switch (currentStatus) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "waiting":
        return "bg-red-100 text-red-800 border-red-200";
      case "in-progress":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNextStatus = (
    currentStatus: string
  ): "waiting" | "in-progress" | "completed" => {
    switch (currentStatus) {
      case "waiting":
        return "in-progress";
      case "in-progress":
        return "completed";
      case "completed":
        return "waiting";
      default:
        return "waiting";
    }
  };

  return (
    <button
      onClick={() => onStatusChange(getNextStatus(status))}
      disabled={disabled}
      className={`
        px-3 py-1 rounded-full text-xs font-medium border transition-smooth hover-lift
        ${getStatusColor(status)}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {status.replace("-", " ")}
    </button>
  );
};

// Animated Checkbox Component
interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`
          relative w-5 h-5 rounded border-2 transition-smooth-slow
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${
            checked
              ? "bg-purple-600 border-purple-600"
              : "bg-white border-gray-300 hover:border-purple-400"
          }
        `}
      >
        {checked && (
          <svg
            className="absolute inset-0 w-full h-full text-white transition-smooth-slow animate-scaleIn"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>
      {label && (
        <span
          className={`text-sm ${disabled ? "text-gray-400" : "text-gray-700"}`}
        >
          {label}
        </span>
      )}
    </div>
  );
};
