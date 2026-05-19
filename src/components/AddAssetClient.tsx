"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Camera, CheckCircle2, Loader2, QrCode } from "lucide-react";
import { createAssetAction } from "@/lib/actions/assets";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function AddAssetClient() {
  const [scannedId, setScannedId] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [customDepartment, setCustomDepartment] = useState("");
  const [supplier, setSupplier] = useState("");
  const [frequency, setFrequency] = useState("Monthly");
  const [nextCalibration, setNextCalibration] = useState("");

  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanError, setScanError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  const qrInstanceRef = useRef<any>(null);
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
      // Dynamic import to prevent SSR crashes
      import("html5-qrcode").then(({ Html5Qrcode }) => {
        try {
          html5Qrcode = new Html5Qrcode("reader");
          qrInstanceRef.current = html5Qrcode;

          html5Qrcode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 200, height: 200 },
            },
            (decodedText: string) => {
              // Successfully decoded
              setScannedId(decodedText.trim());
              setScannerOpen(false);
              stopScanner(html5Qrcode);
            },
            (errorMessage: string) => {
              // Verbose scanning logs - can ignore
            }
          ).catch((err: any) => {
            console.error("Camera access failed", err);
            setScanError("Failed to access camera. Please check your camera permissions.");
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedId) {
      setSubmitError("You must scan a QR code first to generate the Asset ID.");
      return;
    }
    if (!name || !brand || !model || !serialNumber || !department || !supplier) {
      setSubmitError("Please fill out all required fields.");
      return;
    }

    setSubmitError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("id", scannedId);
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("model", model);
    formData.append("serialNumber", serialNumber);
    formData.append("department", department === "Other" ? customDepartment : department);
    formData.append("supplier", supplier);
    formData.append("maintenanceFrequency", frequency);
    formData.append("lastMaintenance", new Date().toISOString().split("T")[0]);
    formData.append("nextCalibration", nextCalibration || new Date().toISOString().split("T")[0]);

    const result = await createAssetAction(formData);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/assets");
        router.refresh();
      }, 2000);
    } else {
      setSubmitError(result.error || "Failed to register new asset.");
    }
  };

  if (success) {
    return (
      <Card className="shadow-lg border-emerald-200 bg-emerald-50/20 max-w-xl mx-auto p-6 text-center">
        <CardContent className="pt-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Asset Registered Successfully!</h3>
          <p className="text-slate-600 text-sm max-w-sm mx-auto">
            Biomedical machine **{scannedId}** has been committed to Neon. QR parameters and routing structures are generated.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-slate-200 w-full">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100">
        <CardTitle>Asset Parameters</CardTitle>
        <CardDescription>Scan a barcode/QR code and input metadata parameters.</CardDescription>
      </CardHeader>
      <form onSubmit={handleFormSubmit}>
        <CardContent className="space-y-6 pt-6">
          {submitError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* QR Scan Section */}
          <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-1">
              <span className="text-sm font-semibold text-slate-900 block">QR Asset ID Verification</span>
              <span className="text-xs text-slate-500 block">
                {scannedId ? `✅ Scanned Scancode: ${scannedId}` : "⚠️ No QR Code scanned yet."}
              </span>
            </div>
            <Button
              type="button"
              onClick={() => {
                setScanError("");
                setScannerOpen(true);
              }}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm w-full sm:w-auto"
            >
              <Camera className="w-4 h-4" /> Scan QR Code
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="id">Asset ID (Auto-populated by QR Scanner) <span className="text-destructive">*</span></Label>
              <Input
                id="id"
                placeholder="Scan QR to populate..."
                value={scannedId}
                readOnly
                className="bg-slate-50/50 border-slate-200 font-mono font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Equipment Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                placeholder="e.g. Infusion Pump, MRI"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand / Manufacturer <span className="text-destructive">*</span></Label>
              <Input
                id="brand"
                placeholder="e.g. Philips, GE Healthcare"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model Specification <span className="text-destructive">*</span></Label>
              <Input
                id="model"
                placeholder="e.g. MAC 2000, Lumina"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number <span className="text-destructive">*</span></Label>
              <Input
                id="serialNumber"
                placeholder="e.g. SN-89320-A"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Clinical Department <span className="text-destructive">*</span></Label>
              <Select onValueChange={(val) => setDepartment(val ?? "")} value={department}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Radiology">Radiology</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="ICU">ICU (Intensive Care)</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="OT">OT (Operation Theater)</SelectItem>
                  <SelectItem value="Other">Other (Specify)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {department === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="customDepartment">Custom Department Name <span className="text-destructive">*</span></Label>
                <Input
                  id="customDepartment"
                  placeholder="e.g. OPD, Dental Ward, Pediatric"
                  value={customDepartment}
                  onChange={(e) => setCustomDepartment(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier / Vendor Partner <span className="text-destructive">*</span></Label>
              <Input
                id="supplier"
                placeholder="e.g. Philips Lanka, Siemens Healthineers"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Maintenance Frequency <span className="text-destructive">*</span></Label>
              <Select onValueChange={(val) => setFrequency(val ?? "Monthly")} value={frequency}>
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily Checks</SelectItem>
                  <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly Cycle</SelectItem>
                  <SelectItem value="Quarterly">Quarterly Cycle</SelectItem>
                  <SelectItem value="Annually">Annually Cycle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextCalibration">Next Scheduled Calibration</Label>
              <Input
                id="nextCalibration"
                type="date"
                value={nextCalibration}
                onChange={(e) => setNextCalibration(e.target.value)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3 p-6">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" className="flex items-center gap-2 shadow-sm bg-primary hover:bg-primary/95 text-white" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Save Asset & Generate QR"
            )}
          </Button>
        </CardFooter>
      </form>

      {/* QR Code Scanner Dialog Modal */}
      <Dialog open={scannerOpen} onOpenChange={(open) => {
        if (!open) {
          stopScanner(null);
        }
        setScannerOpen(open);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Asset QR Code</DialogTitle>
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
              Position the QR code/barcode within the frame. We will automatically decode it.
            </p>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => {
              stopScanner(null);
              setScannerOpen(false);
            }}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
