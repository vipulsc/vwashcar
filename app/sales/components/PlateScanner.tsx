"use client";

import { useState, useRef, useEffect } from "react";
import { X, Camera, RotateCcw } from "lucide-react";

interface PlateScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onPlateDetected: (plateNumber: string) => void;
}

export default function PlateScanner({
  isOpen,
  onClose,
  onPlateDetected,
}: PlateScannerProps) {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [autoDetect, setAutoDetect] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showPermissionModal, setShowPermissionModal] =
    useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<string>("");
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">(
    "environment"
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(
          userAgent
        );
      const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      setIsMobile(isMobileDevice || isTablet || isTouchDevice);
    };

    checkMobile();
  }, []);

  // Enhanced permission monitoring
  useEffect(() => {
    const checkPermissions = async () => {
      if ("permissions" in navigator) {
        try {
          const permission = await navigator.permissions.query({
            name: "camera" as PermissionName,
          });
          setPermissionStatus(permission.state);

          permission.onchange = () => {
            setPermissionStatus(permission.state);
            if (permission.state === "granted") {
              setShowPermissionModal(false);
            }
          };
        } catch (err) {
          console.log("Permission API not fully supported:", err);
        }
      }
    };

    checkPermissions();
  }, []);

  const requestCameraPermission = async () => {
    try {
      setPermissionStatus("requesting");
      setError("");
      setLoading(true);

      // Enhanced browser compatibility check with polyfills
      const getUserMedia =
        navigator.mediaDevices?.getUserMedia ||
        (navigator as unknown as { getUserMedia?: Function }).getUserMedia ||
        (navigator as unknown as { webkitGetUserMedia?: Function })
          .webkitGetUserMedia ||
        (navigator as unknown as { mozGetUserMedia?: Function })
          .mozGetUserMedia ||
        (navigator as unknown as { msGetUserMedia?: Function }).msGetUserMedia;

      if (!getUserMedia) {
        // Try to polyfill mediaDevices
        if (navigator.mediaDevices === undefined) {
          (navigator as unknown as { mediaDevices: any }).mediaDevices = {};
        }

        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = function (constraints) {
            const legacyGetUserMedia =
              (navigator as unknown as { getUserMedia?: Function })
                .getUserMedia ||
              (navigator as unknown as { webkitGetUserMedia?: Function })
                .webkitGetUserMedia ||
              (navigator as unknown as { mozGetUserMedia?: Function })
                .mozGetUserMedia;

            if (!legacyGetUserMedia) {
              return Promise.reject(
                new Error(
                  "Camera not supported in this browser. Please try Chrome, Firefox, Safari, or Edge."
                )
              );
            }

            return new Promise((resolve, reject) => {
              legacyGetUserMedia.call(navigator, constraints, resolve, reject);
            });
          };
        }
      }

      let stream: MediaStream | null = null;

      // Enhanced camera configurations with better mobile support
      const cameraConfigs = [
        // Configuration 1: Modern API with environment camera
        {
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280, max: 1920, min: 320 },
            height: { ideal: 720, max: 1080, min: 240 },
          },
          audio: false,
        },
        // Configuration 2: Basic environment camera
        {
          video: {
            facingMode: "environment",
          },
          audio: false,
        },
        // Configuration 3: User camera
        {
          video: {
            facingMode: "user",
          },
          audio: false,
        },
        // Configuration 4: Basic constraints for older browsers
        {
          video: {
            width: 640,
            height: 480,
          },
          audio: false,
        },
        // Configuration 5: Most basic - just video (works on most browsers)
        {
          video: true,
          audio: false,
        },
        // Configuration 6: Ultra basic for very old browsers
        {
          video: {},
        },
      ];

      let lastError: Error | null = null;

      for (let i = 0; i < cameraConfigs.length; i++) {
        try {
          console.log(`Trying camera config ${i + 1}:`, cameraConfigs[i]);

          // Use the polyfilled or native getUserMedia
          const getUserMediaFunc = navigator.mediaDevices.getUserMedia.bind(
            navigator.mediaDevices
          );
          stream = await getUserMediaFunc(cameraConfigs[i]);

          if (stream) {
            console.log(`Camera config ${i + 1} successful`);

            // Set camera facing based on successful config
            if (i <= 1) {
              setCameraFacing("environment");
            } else if (i === 2) {
              setCameraFacing("user");
            }

            break;
          }
        } catch (err) {
          console.log(`Camera config ${i + 1} failed:`, err);
          lastError = err as Error;

          // If it's a constraint error, continue to next config
          // If it's a permission error, we might want to stop
          if ((err as Error).name === "NotAllowedError") {
            // Don't continue if user denied permission
            break;
          }
          continue;
        }
      }

      if (!stream) {
        throw lastError || new Error("All camera configurations failed");
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(false); // Will be set to true when video loads
        setError("");
        setShowPermissionModal(false);
        setPermissionStatus("granted");

        // Enhanced video loading
        const video = videoRef.current;

        const handleLoadedMetadata = () => {
          console.log("Video metadata loaded");
          video
            .play()
            .then(() => {
              console.log("Video playing successfully");
              setIsCameraActive(true);
              setLoading(false);
            })
            .catch((playError) => {
              console.error("Video play failed:", playError);
              setError("Failed to start video playback");
              setLoading(false);
            });
        };

        const handleError = (videoError: Event) => {
          console.error("Video error:", videoError);
          setError("Video playback error occurred");
          setLoading(false);
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("error", handleError);

        // Cleanup listeners
        return () => {
          video.removeEventListener("loadedmetadata", handleLoadedMetadata);
          video.removeEventListener("error", handleError);
        };
      }
    } catch (err: unknown) {
      console.error("Camera error:", err);
      setLoading(false);
      const error = err as Error;

      let errorMessage = "Camera access failed";
      let newPermissionStatus = "error";

      if (error.name === "NotAllowedError") {
        errorMessage = "Camera permission denied. Please allow camera access.";
        newPermissionStatus = "denied";
        setShowPermissionModal(true);
      } else if (error.name === "NotFoundError") {
        errorMessage = "No camera detected on this device.";
        newPermissionStatus = "not-found";
      } else if (error.name === "NotSupportedError") {
        errorMessage =
          "Camera not supported. Please try a different browser (Chrome, Firefox, Safari, or Edge).";
        newPermissionStatus = "not-supported";
      } else if (error.name === "NotReadableError") {
        errorMessage =
          "Camera is being used by another app. Please close other camera apps.";
        newPermissionStatus = "in-use";
      } else if (error.name === "OverconstrainedError") {
        errorMessage = "Camera constraints not supported. Trying basic mode...";
        newPermissionStatus = "overconstrained";
        // Auto-retry with basic constraints
        setTimeout(() => {
          const basicConfig = { video: true, audio: false };
          navigator.mediaDevices
            .getUserMedia(basicConfig)
            .then((stream) => {
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsCameraActive(true);
                setError("");
                setPermissionStatus("granted");
              }
            })
            .catch((retryErr) => {
              console.error("Retry failed:", retryErr);
              setError("Camera initialization failed completely");
            });
        }, 1000);
      } else {
        errorMessage = error.message || "Unknown camera error occurred";
      }

      setError(errorMessage);
      setPermissionStatus(newPermissionStatus);
    }
  };

  const startCamera = async () => {
    setLoading(true);
    await requestCameraPermission();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log("Camera track stopped:", track.kind);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setLoading(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const switchCamera = async () => {
    if (!isMobile) return;

    stopCamera();
    setCameraFacing(cameraFacing === "environment" ? "user" : "environment");

    // Small delay before starting new camera
    setTimeout(() => {
      startCamera();
    }, 500);
  };

  const captureFrame = async (): Promise<File | null> => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return null;

    // Use video's actual dimensions
    const videoWidth = video.videoWidth || video.clientWidth;
    const videoHeight = video.videoHeight || video.clientHeight;

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    context.drawImage(video, 0, 0, videoWidth, videoHeight);

    return new Promise<File | null>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], "capture.jpg", {
              type: "image/jpeg",
            });
            resolve(file);
          } else {
            resolve(null);
          }
        },
        "image/jpeg",
        0.8
      ); // Added quality parameter
    });
  };

  const processImage = async (imageFile: File) => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data);
        throw new Error(data.error || "Upload failed");
      }

      if (data.plateText && data.plateText !== "Not Detected") {
        onPlateDetected(data.plateText);
        if (autoDetect) {
          stopCamera();
          onClose();
        }
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Processing failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoDetect = () => {
    setAutoDetect(!autoDetect);
  };

  const handleManualCapture = async () => {
    if (!isCameraActive) {
      setError("Camera not ready. Please wait for camera to start.");
      return;
    }

    const capturedFile = await captureFrame();
    if (capturedFile) {
      processImage(capturedFile);
    } else {
      setError("Failed to capture image. Please try again.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        startCamera();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Auto-detect functionality
  useEffect(() => {
    if (isCameraActive && autoDetect && !loading) {
      intervalRef.current = setInterval(async () => {
        if (!loading) {
          // Prevent overlapping requests
          const capturedFile = await captureFrame();
          if (capturedFile) {
            processImage(capturedFile);
          }
        }
      }, 3000); // Increased to 3 seconds to reduce load
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isCameraActive, autoDetect, loading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          controls={false}
          className="w-full h-full object-cover"
          style={{
            transform:
              isMobile && cameraFacing === "user" ? "scaleX(-1)" : "scaleX(1)",
          }}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Header Controls */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            {isMobile && (
              <button
                onClick={switchCamera}
                disabled={!isCameraActive || loading}
                className="p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-200 disabled:opacity-50"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Loading/Starting State */}
        {(!isCameraActive || loading) && !showPermissionModal && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center text-white max-w-sm mx-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                {loading ? (
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Camera className="w-8 h-8" />
                )}
              </div>
              <p className="text-xl font-medium mb-2">
                {loading ? "Starting camera..." : "Camera initializing..."}
              </p>
              <p className="text-sm opacity-75 mb-4">
                {permissionStatus === "requesting"
                  ? "Please allow camera access when prompted"
                  : permissionStatus === "not-supported"
                  ? "Try using Chrome, Firefox, Safari, or Edge browser"
                  : "Setting up camera connection..."}
              </p>
              {!loading && (
                <>
                  <button
                    onClick={startCamera}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-3 block mx-auto"
                  >
                    Retry Camera
                  </button>
                  <p className="text-xs opacity-60">
                    Having issues? Try refreshing the page or using a different
                    browser
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Permission Modal */}
        {showPermissionModal && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-red-600" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Camera Access Required
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                  To scan license plates, this application needs access to your
                  device's camera.
                </p>

                {permissionStatus === "not-supported" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-red-900 mb-2">
                      Browser Compatibility Issue
                    </h4>
                    <p className="text-sm text-red-800">
                      Your current browser doesn't support camera access. Please
                      try:
                    </p>
                    <ul className="text-xs text-red-800 text-left mt-2 space-y-1">
                      <li>• Google Chrome (recommended)</li>
                      <li>• Mozilla Firefox</li>
                      <li>• Apple Safari</li>
                      <li>• Microsoft Edge</li>
                    </ul>
                  </div>
                )}

                {isMobile && permissionStatus !== "not-supported" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Mobile Instructions:
                    </h4>
                    <ul className="text-xs text-blue-800 text-left space-y-1">
                      <li>• Allow camera access when prompted</li>
                      <li>• Check browser settings if blocked</li>
                      <li>• Try refreshing the page</li>
                      <li>• Ensure no other apps are using the camera</li>
                    </ul>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={requestCameraPermission}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? "Requesting Access..." : "Allow Camera Access"}
                  </button>

                  <button
                    onClick={() => {
                      setShowPermissionModal(false);
                      onClose();
                    }}
                    className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Camera Active Overlay */}
        {isCameraActive && !showPermissionModal && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Scanning Frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-80 h-24 border-2 border-white/30 rounded-lg relative">
                  <div className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan-line"></div>

                  {/* Corner indicators */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-blue-400 rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-blue-400 rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-blue-400 rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-blue-400 rounded-br-lg"></div>
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="absolute top-20 right-4 space-y-2">
              <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white font-medium">Active</span>
              </div>

              {autoDetect && !loading && (
                <div className="bg-blue-500/80 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-xs text-white font-medium">
                    Auto-scan
                  </span>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="absolute bottom-8 left-4 right-4">
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4 text-center">
                <p className="text-white text-sm font-medium">
                  Position license plate within the frame
                </p>
                <p className="text-white/70 text-xs mt-1">
                  {autoDetect
                    ? "Scanning automatically..."
                    : "Tap capture when ready"}
                </p>

                {!autoDetect && (
                  <button
                    onClick={handleManualCapture}
                    disabled={loading}
                    className="mt-3 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors pointer-events-auto"
                  >
                    {loading ? "Processing..." : "Capture"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="absolute top-24 left-4 right-4 z-10">
            <div className="bg-red-500/90 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{error}</p>
                  <button
                    onClick={() => setError("")}
                    className="mt-2 text-xs text-white/80 hover:text-white underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {loading && isCameraActive && (
          <div className="absolute top-32 left-4 right-4 z-10">
            <div className="bg-blue-500/90 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <p className="text-sm text-white font-medium">
                  Processing image...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes scan-line {
          0% {
            top: 0;
            opacity: 1;
          }
          50% {
            top: 50%;
            opacity: 0.8;
          }
          100% {
            top: 100%;
            opacity: 1;
          }
        }
        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
