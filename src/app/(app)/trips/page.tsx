"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, MapPin, Calendar } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import FilterBar from "@/components/ui/FilterBar";
import FAB from "@/components/ui/FAB";

type TabFilter = "all" | "upcoming" | "ongoing" | "completed" | "draft";

export default function MyTripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("/api/trips");
        if (res.ok) {
           const data = await res.json();
           setTrips(data.data || []);
        }
      } catch (error) {
        console.error("Fetch trips error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter((trip) => {
    // Filter by tab
    if (activeTab === "upcoming" && (trip.status !== "PLANNED" && new Date(trip.startDate) > new Date())) return false;
    if (activeTab === "draft" && trip.status !== "DRAFT") return false;
    if (activeTab === "completed" && trip.status !== "COMPLETED") return false;
    if (activeTab === "ongoing" && trip.status !== "ONGOING") return false;

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        trip.name.toLowerCase().includes(q) ||
        trip.stops?.some((s: any) => s.cityPlace?.name.toLowerCase().includes(q))
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
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Plan New Trip
        </Link>
      </div>

      {/* Filter Bar */}
      <FilterBar 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name or destination..."
        filterOptions={[
            { label: "All Status", value: "all" },
            { label: "Upcoming", value: "upcoming" },
            { label: "Ongoing", value: "ongoing" },
            { label: "Drafts", value: "draft" },
            { label: "Completed", value: "completed" },
        ]}
        filterValue={activeTab}
        onFilterChange={(v) => setActiveTab(v as TabFilter)}
      />

      {/* Trip List View */}
      {isLoading ? (
         <div className="text-center py-12 text-neutral-500">Loading trips...</div>
      ) : filteredTrips.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredTrips.map((trip) => (
            <Link key={trip.id} href={`/trips/${trip.id}/view`} className="group">
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col md:flex-row h-full md:h-32">
                {/* Cover Image */}
                <div className="w-full md:w-48 h-32 md:h-full flex-shrink-0 relative bg-neutral-100">
                    {trip.coverPhotoUrl ? (
                        <img src={trip.coverPhotoUrl} alt={trip.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                           <MapPin className="w-8 h-8 opacity-20" />
                        </div>
                    )}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-semibold text-neutral-900">
                        {trip.status}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary transition-colors">
                        {trip.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-neutral-500 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">
                          {trip.stops?.length > 0 
                            ? trip.stops.map((s: any) => s.cityPlace?.name).filter(Boolean).join(" • ")
                            : "No destinations added"}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-neutral-500 mt-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                            {new Date(trip.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} - {new Date(trip.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                    </div>
                </div>

                <div className="hidden md:flex p-4 items-center justify-end text-neutral-400 group-hover:text-primary transition-colors">
                    <span className="text-sm font-medium">View details &rarr;</span>
                </div>
              </div>
            </Link>
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

      <FAB href="/trips/new" label="Plan New Trip" />
    </div>
  );
}
