"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { X } from "lucide-react";

interface PlateScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onPlateDetected: (plateNumber: string) => void;
}

const PlateScanner = memo(function PlateScanner({
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
  const processingRef = useRef<boolean>(false);

  const startCamera = useCallback(async () => {
    try {
      setError("");

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera not supported on this device");
        return;
      }

      // Request camera access with optimized settings
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera
          width: { ideal: 1280, min: 640, max: 1920 },
          height: { ideal: 720, min: 480, max: 1080 },
          frameRate: { ideal: 30, max: 30 }, // Limit frame rate for performance
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
  }, []);

  const stopCamera = useCallback(() => {
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
    processingRef.current = false;

    // Clear auto-detection interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    console.log("Camera stopped and cleaned up");
  }, []);

  const captureFrame = useCallback(async (): Promise<File | null> => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) {
      return null;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) {
        console.error("Could not get canvas context");
        return null;
      }

      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob with optimized quality
      return new Promise((resolve) => {
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
          0.8 // Optimize quality for performance
        );
      });
    } catch (error) {
      console.error("Error capturing frame:", error);
      return null;
    }
  }, [isCameraActive]);

  const processImage = useCallback(
    async (imageFile: File) => {
      if (processingRef.current || loading) {
        return; // Prevent multiple simultaneous requests
      }

      processingRef.current = true;
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", imageFile);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

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
        if (err instanceof Error && err.name === "AbortError") {
          setError("Request timed out. Please try again.");
        } else {
          const errorMessage =
            err instanceof Error ? err.message : "An error occurred";
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
        processingRef.current = false;
      }
    },
    [loading, onPlateDetected, stopCamera, onClose]
  );

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
  }, [isOpen, startCamera, stopCamera]);

  // Cleanup camera when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Start auto-detection when camera becomes active
  useEffect(() => {
    if (isCameraActive) {
      // Start periodic capture every 3 seconds (reduced frequency for performance)
      intervalRef.current = setInterval(async () => {
        if (!loading && !processingRef.current) {
          const capturedFile = await captureFrame();
          if (capturedFile) {
            processImage(capturedFile);
          }
        }
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isCameraActive, loading, captureFrame, processImage]);

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
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <span>Scanning for license plate...</span>
              )}
            </div>

            {/* Error display */}
            {error && (
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg max-w-sm text-center">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default PlateScanner;
