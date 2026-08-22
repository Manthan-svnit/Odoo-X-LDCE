"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, MapPin, Plane } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { useAuthStore } from "@/stores/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    country: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.firstName || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const name = `${form.firstName} ${form.lastName}`.trim();
      const additionalInfo = {
         phone: form.phone,
         city: form.city,
         country: form.country,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           name,
           email: form.email,
           password: form.password,
           additionalInfo: JSON.stringify(additionalInfo),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Registration failed");
      }

      await fetchMe();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Left — Illustration Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-teal-900" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">GlobeTrotter</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
            Start your
            <br />
            journey today
          </h1>
          <p className="text-lg text-teal-100 max-w-md mb-8">
            Join thousands of travelers who plan smarter with GlobeTrotter.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-teal-100">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span>Search destinations & activities</span>
            </div>
            <div className="flex items-center gap-3 text-teal-100">
              <Plane className="w-5 h-5 flex-shrink-0" />
              <span>Track budgets & share trips</span>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute top-20 -right-10 w-40 h-40 bg-white/5 rounded-full" />
      </div>

      {/* Right — Form Side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-neutral-900">
              GlobeTrotter
            </span>
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 mb-1">
            Create your account
          </h2>
          <p className="text-neutral-500 text-sm mb-8">
            Start planning unforgettable trips.
          </p>

          {error && (
            <div className="mb-4 p-3 text-sm text-error bg-red-50 rounded-lg" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                required
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              helperText="Must be at least 6 characters"
              required
            />

            <Input
              label="Phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City"
                placeholder="Ahmedabad"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
              <Input
                label="Country"
                placeholder="India"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
