import React from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import TripCard from "@/components/trips/TripCard";
import DestinationCard from "@/components/destinations/DestinationCard";
import { mockTrips, mockCities, formatCurrency, getBudgetSummary } from "@/lib/mockData";

export default function DashboardPage() {
  const upcomingTrips = mockTrips.filter((t) => t.status === "planned");
  const recentTrips = mockTrips.slice(0, 3);
  const recommendedCities = mockCities.slice(0, 4);
  const budgetSummary = getBudgetSummary("trip-1");

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Good morning, Nisarg 👋
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Ready for your next adventure?
          </p>
        </div>
        <Link
          href="/trips/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Plan New Trip
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          placeholder="Search destinations, activities, or trips..."
          className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-neutral-200 bg-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          readOnly
        />
      </div>

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
              {formatCurrency(budgetSummary.total)}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500 mb-1">Cities Planned</p>
            <p className="text-xl font-bold text-neutral-900">
              {upcomingTrips.reduce((sum, t) => sum + t.stops.length, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500 mb-1">Activities</p>
            <p className="text-xl font-bold text-neutral-900">
              {upcomingTrips.reduce(
                (sum, t) =>
                  sum + t.stops.reduce((s, stop) => s + stop.activities.length, 0),
                0
              )}
            </p>
          </div>
        </div>
      )}

      {/* Upcoming Trip */}
      {upcomingTrips.length > 0 && (
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
                  {upcomingTrips[0].stops
                    .map((s) => s.place.name)
                    .join(" • ")}
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

      {/* Recent Trips */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Recent Trips
          </h2>
          <Link
            href="/trips"
            className="text-sm text-primary hover:text-primary-dark font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </section>
    </div>
  );
}
