import React from "react";
import Link from "next/link";
import { Calendar, MapPin, MoreHorizontal } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { Trip } from "@/types";
import { formatDateShort } from "@/lib/mockData";

interface TripCardProps {
  trip: Trip;
  showActions?: boolean;
}

const statusVariant: Record<string, "draft" | "info" | "success"> = {
  draft: "draft",
  planned: "info",
  completed: "success",
};

export default function TripCard({ trip, showActions = true }: TripCardProps) {
  const cityNames = trip.stops.map((s) => s.place.name).join(" • ") || "No stops yet";

  return (
    <div className="group bg-white rounded-xl border border-neutral-200 shadow-card hover:shadow-card-hover overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-40 bg-neutral-100 overflow-hidden">
        {trip.coverPhotoUrl ? (
          <img
            src={trip.coverPhotoUrl}
            alt={trip.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-white/60" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant={statusVariant[trip.status] || "draft"}>
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </Badge>
        </div>
        {showActions && (
          <button
            className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Trip options"
          >
            <MoreHorizontal className="w-4 h-4 text-neutral-600" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 mb-1 truncate">
          {trip.name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {formatDateShort(trip.startDate)} → {formatDateShort(trip.endDate)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{cityNames}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            {trip.stops.length} {trip.stops.length === 1 ? "stop" : "stops"}
          </span>
          <Link
            href={`/trips/${trip.id}/view`}
            className="text-xs font-medium text-primary hover:text-primary-dark"
          >
            View Trip →
          </Link>
        </div>
      </div>
    </div>
  );
}
