"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function CreateTripPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Trip name is required.";
    if (!form.startDate) errs.startDate = "Start date is required.";
    if (!form.endDate) errs.endDate = "End date is required.";
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      errs.endDate = "End date must be on or after start date.";
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    // Mock create trip — replace with real API
    await new Promise((res) => setTimeout(res, 600));
    setIsLoading(false);
    // Redirect to builder for the new trip
    router.push("/trips/trip-1/builder");
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">Plan a New Trip</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Give your trip a name and dates to get started.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5">
          <Input
            label="Trip Name"
            placeholder="e.g., Europe Adventure 2026"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            error={errors.name}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
              error={errors.startDate}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
              error={errors.endDate}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="description"
              className="text-sm font-medium text-neutral-700"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="A short description of your trip..."
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/dashboard">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
            Create & Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
