"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QrCode, ScanLine } from "lucide-react"

export function QRScannerModal() {
  const [scanning, setScanning] = useState(false)

  return (
    <Dialog onOpenChange={(open) => setScanning(open)}>
      <DialogTrigger 
        render={<Button variant="outline" className="flex items-center gap-2" />}
      >
        <QrCode className="w-4 h-4" /> Scan Asset QR
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Asset QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 min-h-[300px]">
          {scanning ? (
            <div className="relative w-48 h-48 border-4 border-primary/50 rounded-xl overflow-hidden flex items-center justify-center bg-black/5">
              <ScanLine className="w-16 h-16 text-primary animate-pulse" />
              <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-scan" />
            </div>
          ) : (
            <QrCode className="w-16 h-16 text-slate-300" />
          )}
          <p className="mt-6 text-sm text-center text-slate-500">
            {scanning ? "Position the QR code within the frame to scan." : "Camera access required."}
          </p>
        </div>
        <div className="flex justify-center mt-2">
          <Button variant={scanning ? "destructive" : "default"} onClick={() => setScanning(!scanning)}>
            {scanning ? "Stop Scanning" : "Start Camera"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
