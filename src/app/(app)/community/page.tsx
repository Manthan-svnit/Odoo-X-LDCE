"use client";

import React, { useState } from "react";
import { Search, Users, Calendar, MapPin, Copy, Eye } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { mockCommunityTrips, mockTrips, formatDateShort } from "@/lib/mockData";
import { Trip } from "@/types";

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Combine community trips + public user trips
  const publicTrips = [
    ...mockTrips.filter((t) => t.isPublic),
    ...mockCommunityTrips,
  ];

  const filteredTrips = publicTrips.filter((trip) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      trip.name.toLowerCase().includes(q) ||
      trip.description?.toLowerCase().includes(q) ||
      trip.stops.some((s) => s.place.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Community</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Explore and copy public trips from fellow travelers.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search public trips..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-96 pl-10 pr-4 py-2.5 text-sm rounded-lg border border-neutral-300 bg-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-neutral-500">
        <span className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          {filteredTrips.length} public{" "}
          {filteredTrips.length === 1 ? "trip" : "trips"}
        </span>
      </div>

      {/* Trip Feed */}
      {filteredTrips.length > 0 ? (
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <CommunityTripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No trips found"
          description={
            searchQuery
              ? "Try a different search term."
              : "No one has shared any trips yet."
          }
        />
      )}
    </div>
  );
}

function CommunityTripCard({ trip }: { trip: Trip }) {
  const cityNames =
    trip.stops.map((s) => s.place.name).join(" • ") || "Multiple destinations";

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const days =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-card hover:shadow-card-hover overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-64 h-44 sm:h-auto flex-shrink-0 bg-neutral-100">
          {trip.coverPhotoUrl ? (
            <img
              src={trip.coverPhotoUrl}
              alt={trip.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white/60" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="success">Public</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              {trip.name}
            </h3>
            {trip.description && (
              <p className="text-sm text-neutral-500 line-clamp-2 mb-3">
                {trip.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDateShort(trip.startDate)} →{" "}
                {formatDateShort(trip.endDate)}
              </span>
              <span>{days} days</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {cityNames}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <a
              href={`/shared/${trip.shareToken || trip.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary-50"
            >
              <Eye className="w-3.5 h-3.5" />
              View Trip
            </a>
            <button
              onClick={() => alert(`Trip "${trip.name}" copied to your trips!`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent border border-accent/30 rounded-lg hover:bg-orange-50"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
