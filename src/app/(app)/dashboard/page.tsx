"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import TripCard from "@/components/trips/TripCard";
import DestinationCard from "@/components/destinations/DestinationCard";
import FilterBar from "@/components/ui/FilterBar";
import FAB from "@/components/ui/FAB";
import { useAuthStore } from "@/stores/authStore";
import { formatCurrency } from "@/lib/mockData"; // We can still use formatCurrency, or move it to utils

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [trips, setTrips] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Still use some mock for destinations as there's no personalized recommender yet
  const [recommendedCities, setRecommendedCities] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tripsRes, citiesRes] = await Promise.all([
          fetch("/api/trips"),
          // Fetch some popular cities (hardcoded query for now to simulate recommendations)
          fetch("/api/places/cities/search?q=popular")
        ]);

        if (tripsRes.ok) {
           const data = await tripsRes.json();
           setTrips(data.data || []);
        }

        if (citiesRes.ok) {
           const data = await citiesRes.json();
           setRecommendedCities(data.data?.slice(0, 4) || []);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const upcomingTrips = trips.filter((t) => new Date(t.startDate) > new Date() && t.status !== "COMPLETED");
  const recentTrips = trips.slice(0, 3);
  
  // Fake total budget sum just for UI display
  const totalBudget = trips.reduce((sum, trip) => {
     return sum + (trip.budgets?.reduce((s: number, b: any) => s + b.limitAmount, 0) || 0);
  }, 0);

  const filteredTrips = trips.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Good morning, {user?.name?.split(' ')[0] || "Traveler"} 👋
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Ready for your next adventure?
          </p>
        </div>
        <Link
          href="/trips/new"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Plan New Trip
        </Link>
      </div>

      <FilterBar 
         searchValue={searchQuery}
         onSearchChange={setSearchQuery}
         searchPlaceholder="Search your trips..."
      />

      {/* Budget Quick Stats */}
      {upcomingTrips.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500 mb-1">Upcoming Trips</p>
            <p className="text-xl font-bold text-neutral-900">{upcomingTrips.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500 mb-1">Total Budget</p>
            <p className="text-xl font-bold text-neutral-900">
              ${totalBudget.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500 mb-1">Cities Planned</p>
            <p className="text-xl font-bold text-neutral-900">
              {upcomingTrips.reduce((sum, t) => sum + (t.stops?.length || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500 mb-1">Activities</p>
            <p className="text-xl font-bold text-neutral-900">
              {upcomingTrips.reduce(
                (sum, t) =>
                  sum + (t.stops?.reduce((s: number, stop: any) => s + (stop.activities?.length || 0), 0) || 0),
                0
              )}
            </p>
          </div>
        </div>
      )}

      {/* Upcoming Trip */}
      {upcomingTrips.length > 0 && !searchQuery && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              Upcoming Trip
            </h2>
            <Link
              href="/trips"
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 shadow-card overflow-hidden">
            <div className="relative h-48 md:h-56">
              {upcomingTrips[0].coverPhotoUrl && (
                <img
                  src={upcomingTrips[0].coverPhotoUrl}
                  alt={upcomingTrips[0].name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold mb-1">
                  {upcomingTrips[0].name}
                </h3>
                <p className="text-sm text-white/80">
                  {upcomingTrips[0].stops?.map((s: any) => s.cityPlace?.name).filter(Boolean).join(" • ") || "No destinations added"}
                </p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="text-sm text-neutral-500">
                {new Date(upcomingTrips[0].startDate).toLocaleDateString(
                  "en-IN",
                  { day: "numeric", month: "short" }
                )}{" "}
                →{" "}
                {new Date(upcomingTrips[0].endDate).toLocaleDateString(
                  "en-IN",
                  { day: "numeric", month: "short" }
                )}
              </div>
              <Link
                href={`/trips/${upcomingTrips[0].id}/view`}
                className="text-sm font-medium text-primary hover:text-primary-dark"
              >
                View Trip →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recommended Destinations */}
      {!searchQuery && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              Recommended Destinations
            </h2>
            <Link
              href="/discover"
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              Explore all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendedCities.map((city) => (
              <DestinationCard key={city.id} place={city} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Trips */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            {searchQuery ? "Search Results" : "Recent Trips"}
          </h2>
          {!searchQuery && (
            <Link
              href="/trips"
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              View all →
            </Link>
          )}
        </div>
        
        {isLoading ? (
          <div className="text-center py-12 text-neutral-500">Loading trips...</div>
        ) : filteredTrips.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 bg-white rounded-xl border border-neutral-200">
            No trips found. <Link href="/trips/new" className="text-primary font-medium">Create one</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(searchQuery ? filteredTrips : recentTrips).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>

      <FAB href="/trips/new" label="Plan New Trip" />
    </div>
  );
}
