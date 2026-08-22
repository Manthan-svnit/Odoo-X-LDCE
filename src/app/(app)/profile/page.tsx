"use client";

import React, { useState } from "react";
import {
  MapPin,
  Save,
  Camera,
  Trash2,
  LogOut,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { currentUser } from "@/lib/mockData";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: currentUser.name.split(" ")[0] || "",
    lastName: currentUser.name.split(" ").slice(1).join(" ") || "",
    email: currentUser.email,
    phone: currentUser.phone || "",
    city: currentUser.city || "",
    country: currentUser.country || "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((res) => setTimeout(res, 600));
    setIsSaving(false);
    setIsEditing(false);
  };

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Profile</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your account settings.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center text-primary text-2xl font-bold">
              {initials}
            </div>
            <button
              className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 shadow-sm"
              aria-label="Change avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold text-neutral-900">
              {currentUser.name}
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              {currentUser.email}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-xs text-neutral-500">
              {currentUser.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {currentUser.city}, {currentUser.country}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Member since{" "}
              {new Date(currentUser.createdAt).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Edit Toggle */}
          <Button
            variant={isEditing ? "ghost" : "secondary"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
      </div>

      {/* Details Form */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-sm font-semibold text-neutral-900 mb-5">
          Personal Information
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label="First Name"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            disabled={!isEditing}
          />

          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            disabled={!isEditing}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              disabled={!isEditing}
            />
            <Input
              label="Country"
              value={form.country}
              onChange={(e) => updateField("country", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                isLoading={isSaving}
                onClick={handleSave}
                icon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-sm font-semibold text-neutral-900 mb-5">
          Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900">
                Language
              </p>
              <p className="text-xs text-neutral-500">
                Choose your preferred language
              </p>
            </div>
            <select
              className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
              defaultValue="en"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="gu">Gujarati</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900">
                Currency
              </p>
              <p className="text-xs text-neutral-500">
                Default currency for trip budgets
              </p>
            </div>
            <select
              className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
              defaultValue="INR"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900">
                Public Profile
              </p>
              <p className="text-xs text-neutral-500">
                Allow others to see your public trips
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h3 className="text-sm font-semibold text-error mb-1">Danger Zone</h3>
        <p className="text-xs text-neutral-500 mb-4">
          Irreversible and destructive actions.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="ghost" size="sm" icon={<LogOut className="w-4 h-4" />}>
            Log Out
          </Button>
          <Button
            variant="destructive"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
