"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error?.message || "Request failed");
      }
      
      setSuccess(true);
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
          Reset password
        </h2>
        <p className="text-neutral-500 text-sm mb-8 text-center">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {error && (
          <div className="mb-4 p-3 text-sm text-error bg-red-50 rounded-lg text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 text-sm text-primary-dark bg-primary/10 rounded-lg text-center">
            If an account exists, a reset link has been sent to your email.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            Send reset link
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary-dark font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
