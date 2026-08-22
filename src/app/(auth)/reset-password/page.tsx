"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Globe } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
        setError("Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error?.message || "Reset failed");
      }
      
      setSuccess(true);
      setTimeout(() => {
         router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-6 py-12 bg-neutral-50">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-neutral-900">
            GlobeTrotter
          </span>
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 mb-2 text-center">
          Create new password
        </h2>
        <p className="text-neutral-500 text-sm mb-8 text-center">
          Please enter your new password below.
        </p>

        {error && (
          <div className="mb-4 p-3 text-sm text-error bg-red-50 rounded-lg text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 text-sm text-primary-dark bg-primary/10 rounded-lg text-center">
            Password has been reset successfully. Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={!token || success}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={!token || success}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
            disabled={!token || success}
          >
            Reset Password
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link
            href="/login"
            className="text-primary hover:text-primary-dark font-medium"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
