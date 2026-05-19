"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Stethoscope, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { signUpAction } from "@/lib/actions/auth";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !role || !password || !confirm) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("name", `${firstName} ${lastName}`.trim());
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    
    // Default specialties for technicians
    if (role === "technician") {
      formData.append("specialty", specialty || "General Electronics & Monitoring");
    }

    const result = await signUpAction(null, formData);

    if (result.success) {
      // Redirect based on role
      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "technician") {
        router.push("/dashboard/technician");
      } else if (role === "clinical") {
        router.push("/dashboard/clinical");
      } else {
        router.push("/dashboard/admin");
      }
      router.refresh();
    } else {
      setError(result.error || "Failed to create account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-slate-200/60 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg shadow-primary/25 mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">BEMMS</h1>
          <p className="text-sm text-slate-500 mt-1">
            Biomedical Equipment Maintenance System
          </p>
        </div>

        <Card className="shadow-xl border-slate-200/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-900">
              Create an account
            </CardTitle>
            <CardDescription>
              Register your hospital staff profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Kamal"
                  className="h-11"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Silva"
                  className="h-11"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@hospital.lk"
                className="h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(val) => setRole(val ?? "")} value={role} disabled={loading}>
                <SelectTrigger id="role" className="h-11">
                  <SelectValue placeholder="Select your role..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator / Manager</SelectItem>
                  <SelectItem value="technician">
                    Biomedical Engineer / Technician
                  </SelectItem>
                  <SelectItem value="clinical">
                    Clinical User (Doctor / Nurse)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "technician" && (
              <div className="space-y-2">
                <Label htmlFor="specialty">Engineering Specialty</Label>
                <Select onValueChange={(val) => setSpecialty(val ?? "")} value={specialty} disabled={loading}>
                  <SelectTrigger id="specialty" className="h-11">
                    <SelectValue placeholder="Select specialty field..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Radiology & Imaging Equipment">Radiology & Imaging Equipment</SelectItem>
                    <SelectItem value="Life Support Systems">Life Support Systems</SelectItem>
                    <SelectItem value="General Electronics & Monitoring">General Electronics & Monitoring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  className="h-11 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  className="h-11 pr-10"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={loading}
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              onClick={handleSignup}
              className="w-full h-11 text-sm font-semibold mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Registering Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Secured for Sri Lankan Hospital Use · BEMMS v1.0</span>
        </div>
      </div>
    </div>
  );
}
