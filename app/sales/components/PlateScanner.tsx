"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCamera = async () => {
    try {
      setError("");

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera not supported on this device");
        return;
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
          }
        };
      }
    } catch (err: unknown) {
      console.error("Camera error:", err);
      const error = err as Error;

      if (error.name === "NotAllowedError") {
        setError("Camera access denied. Please allow camera permissions.");
      } else if (error.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else if (error.name === "NotSupportedError") {
        setError("Camera not supported on this device.");
      } else {
        setError("Failed to access camera. Please check permissions.");
      }
    }
  };

  const stopCamera = () => {
    // Stop all camera tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log("Camera track stopped:", track.kind);
      });
      streamRef.current = null;
    }

    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Reset states
    setIsCameraActive(false);
    setLoading(false);
    setError("");

    // Clear auto-detection interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    console.log("Camera stopped and cleaned up");
  };

  const captureFrame = async (): Promise<File | null> => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise<File | null>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
          resolve(file);
        } else {
          resolve(null);
        }
      }, "image/jpeg");
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
        stopCamera();
        onClose();
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        startCamera();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      stopCamera();
    }
  }, [isOpen]);

  // Cleanup camera when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Start auto-detection when camera becomes active
  useEffect(() => {
    if (isCameraActive) {
      // Start periodic capture every 2 seconds
      intervalRef.current = setInterval(async () => {
        if (!loading) {
          const capturedFile = await captureFrame();
          if (capturedFile) {
            processImage(capturedFile);
          }
        }
      }, 2000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isCameraActive, loading, processImage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Full-screen camera view */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          controls={false}
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Close button */}
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-4 left-4 z-10 p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-200"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Loading overlay */}
        {!isCameraActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
              <p className="text-xl font-medium">Starting camera...</p>
              <p className="text-sm opacity-75 mt-2">
                Please allow camera permissions
              </p>
              <button
                onClick={startCamera}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Scanning overlay */}
        {isCameraActive && (
          <div className="absolute inset-0">
            {/* Scanning frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Outer frame */}
                <div className="w-80 h-24 border-2 border-white/30 rounded-lg relative">
                  {/* Moving scanning line */}
                  <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-scan-line"></div>

                  {/* Corner indicators */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-white rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-white rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-white rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-white rounded-br-lg"></div>
                </div>
              </div>
            </div>

            {/* Status indicator */}
            <div className="absolute top-4 right-4">
              <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white font-medium">Scanning</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-8 left-4 right-4">
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4 text-center">
                <p className="text-white text-sm font-medium">
                  Point camera at license plate
                </p>
                <p className="text-white/70 text-xs mt-1">
                  Auto-detecting every 2 seconds
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="absolute top-20 left-4 right-4">
            <div className="bg-red-500/90 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-sm text-white font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute top-32 left-4 right-4">
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

      {/* Custom CSS for scanning animation */}
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
