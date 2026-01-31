"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { processCheckIn } from "@/lib/firebase-actions";
import { Camera, Scan, Video, VideoOff } from "lucide-react";

export default function QrScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [isDetectorSupported, setIsDetectorSupported] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!("BarcodeDetector" in window)) {
      setIsDetectorSupported(false);
    }
  }, []);

  const stopScan = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const detectCode = async () => {
      if (isScanning && videoRef.current && videoRef.current.readyState === 4) {
        try {
          // @ts-ignore - BarcodeDetector is not in all TS lib versions
          const barcodeDetector = new window.BarcodeDetector({ formats: ["qr_code"] });
          const barcodes = await barcodeDetector.detect(videoRef.current);
          if (barcodes.length > 0) {
            const userId = barcodes[0].rawValue;
            stopScan();
            toast({ title: "QR Code Detected!", description: `Processing check-in for user: ${userId}` });
            const result = await processCheckIn(userId);
            if (result.success) {
              toast({ variant: "default", title: "Check-in Confirmed", description: `${result.userName} - ${result.message}` });
            } else {
              toast({ variant: "destructive", title: "Check-in Failed", description: result.message });
            }
          }
        } catch (error) {
          console.error("Barcode detection failed: ", error);
        }
      }
      if (isScanning) {
        animationFrameId = requestAnimationFrame(detectCode);
      }
    };

    if (isScanning) {
      animationFrameId = requestAnimationFrame(detectCode);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (isScanning) {
        stopScan();
      }
    };
  }, [isScanning, stopScan, toast]);

  const startScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsScanning(true);
      }
    } catch (err) {
      console.error("Failed to get camera access:", err);
      toast({ variant: "destructive", title: "Camera Error", description: "Could not access camera. Please check permissions." });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Scanner</CardTitle>
        <CardDescription>Scan a user's QR code to check them in.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <div className="w-full max-w-sm aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${!isScanning && "hidden"}`}
            playsInline
          />
          {!isScanning && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Camera className="h-16 w-16" />
              <p>Camera is off</p>
            </div>
          )}
          {isScanning && (
            <div className="absolute inset-0 border-4 border-primary/50 rounded-lg animate-pulse"></div>
          )}
        </div>
        {!isDetectorSupported ? (
          <p className="text-destructive text-center text-sm">QR code scanning is not supported on this browser. Please use a modern browser like Chrome or Safari.</p>
        ) : isScanning ? (
          <Button onClick={stopScan} variant="destructive" className="w-full max-w-sm">
            <VideoOff className="mr-2 h-4 w-4" /> Stop Scanning
          </Button>
        ) : (
          <Button onClick={startScan} className="w-full max-w-sm">
            <Scan className="mr-2 h-4 w-4" /> Enable QR Scanning
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
