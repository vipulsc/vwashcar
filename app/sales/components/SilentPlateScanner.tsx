"use client";

import { useState, useRef, useEffect } from "react";

interface SilentPlateScannerProps {
  isActive: boolean;
  onPlateDetected: (plateNumber: string) => void;
  onError: (error: string) => void;
}

export default function SilentPlateScanner({
  isActive,
  onPlateDetected,
  onError,
}: SilentPlateScannerProps) {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        onError("Camera not supported on this device");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);

        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
          }
        };
      }
    } catch (error) {
      console.error("Camera error:", error);
      onError("Failed to access camera");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
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
    if (isProcessing) return; // Prevent multiple simultaneous requests
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.plateText && data.plateText !== "Not Detected") {
        onPlateDetected(data.plateText);
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startAutoDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(async () => {
      if (isCameraActive && !isProcessing) {
        const capturedFile = await captureFrame();
        if (capturedFile) {
          processImage(capturedFile);
        }
      }
    }, 2000); // Scan every 2 seconds
  };

  const stopAutoDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  useEffect(() => {
    if (isCameraActive && isActive) {
      startAutoDetection();
    } else {
      stopAutoDetection();
    }

    return () => {
      stopAutoDetection();
    };
  }, [isCameraActive, isActive]);

  // Hidden video and canvas elements for silent operation
  return (
    <div style={{ display: 'none' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        controls={false}
      />
      <canvas ref={canvasRef} />
    </div>
  );
}
