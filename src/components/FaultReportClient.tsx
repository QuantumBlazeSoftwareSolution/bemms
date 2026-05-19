"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, Camera, UploadCloud, Loader2, CheckCircle2 } from "lucide-react";
import { reportFaultAction } from "@/lib/actions/faults";

interface Asset {
  id: string;
  name: string;
  brand: string;
  model: string;
  department: string;
}

interface FaultReportClientProps {
  assets: Asset[];
}

export function FaultReportClient({ assets }: FaultReportClientProps) {
  const [selectedAsset, setSelectedAsset] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Simplified image path
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!selectedAsset || !category || !description) {
      setError("Please select the asset, issue category, and enter a description.");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("assetId", selectedAsset);
    formData.append("category", category);
    formData.append("priority", priority.toUpperCase());
    formData.append("description", description);
    formData.append("imageUrl", imageUrl || "None");

    const result = await reportFaultAction(formData);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    } else {
      setError(result.error || "Failed to submit fault report.");
    }
  };

  if (success) {
    return (
      <Card className="shadow-lg border-emerald-200 bg-emerald-50/20 max-w-xl mx-auto p-6 text-center">
        <CardContent className="pt-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Fault Submitted Successfully!</h3>
          <p className="text-slate-600 text-sm max-w-sm mx-auto">
            Our **Automated Allocation Algorithm** has analyzed your reported issue and successfully assigned an eligible technician. Redirecting to workspace...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100">
        <CardTitle>Fault Details</CardTitle>
        <CardDescription>Provide as much information as possible to help technicians.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="asset">
              Equipment / Asset <span className="text-destructive">*</span>
            </Label>
            <Select onValueChange={(val) => setSelectedAsset(val ?? "")} value={selectedAsset} disabled={loading}>
              <SelectTrigger id="asset">
                <SelectValue placeholder="Select equipment..." />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name} ({asset.id}) — {asset.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">
              Issue Category <span className="text-destructive">*</span>
            </Label>
            <Select onValueChange={(val) => setCategory(val ?? "")} value={category} disabled={loading}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Power / Electrical">Power / Electrical</SelectItem>
                <SelectItem value="Mechanical Failure">Mechanical Failure</SelectItem>
                <SelectItem value="Software / Digital Screen">Software / Digital Screen</SelectItem>
                <SelectItem value="Calibration Deviation">Calibration Deviation</SelectItem>
                <SelectItem value="Other Structural Damage">Other Structural Damage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Priority Level</Label>
          <RadioGroup
            defaultValue="MEDIUM"
            value={priority}
            onValueChange={(val) => setPriority(val)}
            className="flex flex-col sm:flex-row gap-4 pt-2"
            disabled={loading}
          >
            <div className="flex items-center space-x-2 border p-3 rounded-md flex-1 cursor-pointer hover:bg-slate-50">
              <RadioGroupItem value="LOW" id="LOW" />
              <Label htmlFor="LOW" className="cursor-pointer">
                Low (Routine)
              </Label>
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-md border-amber-200 bg-amber-50/30 flex-1 cursor-pointer hover:bg-amber-50/50">
              <RadioGroupItem value="MEDIUM" id="MEDIUM" />
              <Label htmlFor="MEDIUM" className="cursor-pointer font-medium text-amber-700">
                Medium
              </Label>
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-md border-destructive/20 bg-destructive/5 flex-1 cursor-pointer hover:bg-destructive/10">
              <RadioGroupItem value="CRITICAL" id="CRITICAL" />
              <Label
                htmlFor="CRITICAL"
                className="cursor-pointer font-medium text-destructive flex items-center gap-1"
              >
                High / Critical <AlertCircle className="w-3 h-3 animate-pulse" />
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Describe the issue in detail. What happened? Are there any error codes? (e.g., MRI machine won't boot, Defibrillator won't hold charge)"
            className="min-h-[120px] resize-y"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label>Photo / Evidence</Label>
          <div 
            onClick={() => setImageUrl("/uploads/evidence.jpg")}
            className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-slate-200 transition-colors">
              <Camera className="w-6 h-6 text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              {imageUrl ? "📸 Evidence photo linked successfully" : "Click to mock-upload photo"}
            </p>
            <p className="text-xs text-slate-500 mt-1">or drag and drop (Auto-handles compression)</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3 p-6">
        <Button variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="flex items-center gap-2 shadow-sm" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Allocating Tech...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" /> Submit Report & Allocate
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
