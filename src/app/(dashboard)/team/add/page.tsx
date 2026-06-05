"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { registerTechnicianByAdminAction } from "@/lib/actions/auth";

export default function AddTechnicianPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !specialty || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("name", `${firstName} ${lastName}`.trim());
    formData.append("email", email);
    formData.append("password", password);
    formData.append("specialty", specialty);

    const result = await registerTechnicianByAdminAction(null, formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/team");
        router.refresh();
      }, 1500);
    } else {
      setError(result.error || "Failed to add technician. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/team">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <span className="text-sm font-medium text-slate-500">Back to Team List</span>
      </div>

      <Card className="shadow-lg border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 text-primary font-bold">
            <UserPlus className="w-5 h-5" />
            <CardTitle className="text-xl">Add New Technician</CardTitle>
          </div>
          <CardDescription>
            Register a qualified biomedical engineer to the hospital maintenance roster.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Technician registered successfully! Redirecting...</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Rohan"
                className="h-10"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading || success}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Perera"
                className="h-10"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading || success}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="rohan@hospital.lk"
              className="h-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || success}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="specialty">Engineering Specialty</Label>
            <Select onValueChange={(val) => setSpecialty(val ?? "")} value={specialty} disabled={loading || success}>
              <SelectTrigger id="specialty" className="h-10">
                <SelectValue placeholder="Select specialty field..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Radiology & Imaging Equipment">Radiology & Imaging Equipment</SelectItem>
                <SelectItem value="Life Support Systems">Life Support Systems</SelectItem>
                <SelectItem value="General Electronics & Monitoring">General Electronics & Monitoring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Login Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 6 characters"
              className="h-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || success}
            />
          </div>

          <Button
            onClick={handleRegister}
            className="w-full h-11 text-sm font-semibold mt-4 shadow-sm"
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Registering Technician...
              </>
            ) : (
              "Add Technician"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
