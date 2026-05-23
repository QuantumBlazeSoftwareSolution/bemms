"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, AlertCircle, Camera, Loader2 } from "lucide-react";

export function ClinicalQRScanner() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scannedId, setScannedId] = useState("");
  const qrInstanceRef = useRef<any>(null);
  const hasScannedRef = useRef(false);
  const router = useRouter();

  const stopScanner = (instance: any) => {
    const activeInstance = instance || qrInstanceRef.current;
    if (activeInstance && activeInstance.isScanning) {
      activeInstance.stop().then(() => {
        console.log("Scanner stopped successfully");
      }).catch((e: any) => {
        console.warn("Error stopping scanner", e);
      });
    }
  };

  // Handle QR scanner initialization and shutdown
  useEffect(() => {
    let html5Qrcode: any = null;

    if (scannerOpen) {
      setScanError("");
      setScannedId("");
      hasScannedRef.current = false;
      
      // Dynamic import to prevent SSR crashes
      import("html5-qrcode").then(({ Html5Qrcode }) => {
        try {
          html5Qrcode = new Html5Qrcode("reader");
          qrInstanceRef.current = html5Qrcode;

          html5Qrcode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 220, height: 220 },
            },
            (decodedText: string) => {
              // Prevent duplicate scanning triggers
              if (hasScannedRef.current) return;
              hasScannedRef.current = true;

              const assetId = decodedText.trim();
              setScannedId(assetId);
              
              if (html5Qrcode && html5Qrcode.isScanning) {
                html5Qrcode.stop().then(() => {
                  setScannerOpen(false);
                  router.push(`/fault-report?assetId=${assetId}`);
                  router.refresh();
                }).catch((err: any) => {
                  console.warn("Failed to stop scanner gracefully:", err);
                  setScannerOpen(false);
                  router.push(`/fault-report?assetId=${assetId}`);
                });
              } else {
                setScannerOpen(false);
                router.push(`/fault-report?assetId=${assetId}`);
              }
            },
            (errorMessage: string) => {
              // Verbose scanning logs - can ignore
            }
          ).catch((err: any) => {
            console.error("Camera access failed", err);
            setScanError("Failed to access camera. Please check camera permissions.");
          });
        } catch (e: any) {
          setScanError("Failed to initialize QR scanner.");
        }
      });
    }

    return () => {
      if (html5Qrcode) {
        stopScanner(html5Qrcode);
      }
    };
  }, [scannerOpen]);

  return (
    <>
      {/* Interactive Trigger Card */}
      <div 
        onClick={() => setScannerOpen(true)}
        className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl bg-slate-800 text-white cursor-pointer hover:bg-slate-700 transition-all shadow-lg active:scale-95 text-center select-none"
      >
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
          <QrCode className="w-7 h-7" />
        </div>
        <div>
          <div className="font-bold text-lg">Scan Equipment QR</div>
          <div className="text-sm text-white/80 mt-0.5">Instant report via QR code</div>
        </div>
      </div>

      {/* QR Code Scanner Dialog Modal */}
      <Dialog open={scannerOpen} onOpenChange={(open) => {
        if (!open) {
          stopScanner(null);
        }
        setScannerOpen(open);
      }}>
        <DialogContent className="sm:max-w-md text-left">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-bold text-slate-900">
              <QrCode className="w-5 h-5 text-primary" />
              <span>Scan Equipment QR Code</span>
            </DialogTitle>
          </DialogHeader>
          
          {scanError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 mb-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{scanError}</span>
            </div>
          )}

          <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-lg min-h-[300px] overflow-hidden relative">
            {/* Target element for html5-qrcode video tag */}
            <div id="reader" className="w-full max-w-[280px] h-[280px] overflow-hidden rounded-xl border-4 border-slate-800" />
            <p className="mt-4 text-xs text-center text-slate-400">
              Position the equipment barcode/QR code within the frame. We will automatically decode it and load the fault report form.
            </p>
          </div>
          
          <div className="flex justify-end gap-2 mt-2">
            <Button 
              variant="outline" 
              onClick={() => {
                stopScanner(null);
                setScannerOpen(false);
              }}
              className="border-slate-200"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
