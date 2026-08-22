"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function CreateTripPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
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

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
         const file = e.target.files[0];
         setCoverPhoto(file);
         setCoverPreview(URL.createObjectURL(file));
     }
  }

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
    try {
        let coverPhotoUrl = "";
        
        if (coverPhoto) {
            const formData = new FormData();
            formData.append("file", coverPhoto);
            const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
            if (uploadRes.ok) {
                const uploadData = await uploadRes.json();
                coverPhotoUrl = uploadData.data.url;
            }
        }

        const res = await fetch("/api/trips", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                coverPhotoUrl: coverPhotoUrl || undefined,
            })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
           throw new Error(data.error?.message || "Failed to create trip");
        }

        router.push(`/trips/${data.data.id}/view`);
    } catch (error: any) {
        console.error("Create trip error:", error);
        alert(error.message);
    } finally {
        setIsLoading(false);
    }
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

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Cover Photo</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-neutral-300 rounded-xl bg-neutral-50 hover:bg-neutral-100 cursor-pointer overflow-hidden transition-colors"
            >
              {coverPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-neutral-500">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium">Click to upload cover photo</p>
                  <p className="text-xs">SVG, PNG, JPG or GIF</p>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handlePhotoSelect}
              />
            </div>
          </div>

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
