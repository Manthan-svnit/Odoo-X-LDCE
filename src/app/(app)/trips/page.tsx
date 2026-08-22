"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import TripCard from "@/components/trips/TripCard";
import EmptyState from "@/components/ui/EmptyState";
import { mockTrips } from "@/lib/mockData";

type TabFilter = "all" | "upcoming" | "ongoing" | "completed" | "draft";

const tabs: { key: TabFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "draft", label: "Drafts" },
  { key: "completed", label: "Completed" },
];

export default function MyTripsPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTrips = mockTrips.filter((trip) => {
    // Filter by tab
    if (activeTab === "upcoming" && trip.status !== "planned") return false;
    if (activeTab === "draft" && trip.status !== "draft") return false;
    if (activeTab === "completed" && trip.status !== "completed") return false;

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        trip.name.toLowerCase().includes(q) ||
        trip.stops.some((s) => s.place.name.toLowerCase().includes(q))
      );
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-neutral-900">My Trips</h1>
        <Link
          href="/trips/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Plan New Trip
        </Link>
      </div>

      {/* Search + Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-80 pl-10 pr-4 py-2 text-sm rounded-lg border border-neutral-300 bg-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex gap-1 border-b border-neutral-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-4 py-2 text-sm font-medium border-b-2 -mb-px
                ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-500 hover:text-neutral-700"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trip Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            searchQuery
              ? "No trips found"
              : activeTab !== "all"
              ? `No ${activeTab} trips yet`
              : "No trips yet"
          }
          description={
            searchQuery
              ? "Try a different search term."
              : "Start planning your first adventure."
          }
          actionLabel={!searchQuery ? "+ Plan New Trip" : undefined}
          onAction={!searchQuery ? () => (window.location.href = "/trips/new") : undefined}
        />
      )}
    </div>
  );
}
