import React from "react";
import Link from "next/link";
import {
  Globe,
  Calendar,
  MapPin,
  Clock,
  Copy,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import { mockTrips, formatDate, formatDateShort, formatCurrency } from "@/lib/mockData";

export default function SharedTripPage({
  params,
}: {
  params: { token: string };
}) {
  // Find trip by shareToken
  const trip = mockTrips.find(
    (t) => t.shareToken === params.token || t.id === params.token
  );

  if (!trip) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-neutral-400" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">
            Trip Not Found
          </h1>
          <p className="text-sm text-neutral-500 mb-6">
            This shared link is invalid or the trip is no longer public.
          </p>
          <Link
            href="/login"
            className="text-sm font-medium text-primary hover:text-primary-dark"
          >
            Go to GlobeTrotter →
          </Link>
        </div>
      </div>
    );
  }

  const routeString = trip.stops.map((s) => s.place.name).join(" → ");
  const totalCost = trip.stops
    .flatMap((s) => s.activities)
    .reduce((sum, a) => sum + (a.estimatedCost || 0), 0);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/login" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-neutral-900">
              GlobeTrotter
            </span>
          </Link>
          <button
            onClick={() =>
              alert(`Trip "${trip.name}" copied to your trips!`)
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-lg"
          >
            <Copy className="w-4 h-4" />
            Copy Trip
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-60 md:h-72 bg-neutral-200">
        {trip.coverPhotoUrl && (
          <img
            src={trip.coverPhotoUrl}
            alt={trip.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-4xl mx-auto px-4">
            <Badge variant="success" className="mb-2">
              Public Trip
            </Badge>
            <h1 className="text-3xl font-bold text-white mb-1">{trip.name}</h1>
            <p className="text-white/80 text-sm">{routeString}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Trip Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
            <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xs text-neutral-500">Dates</p>
            <p className="text-sm font-semibold text-neutral-900">
              {formatDateShort(trip.startDate)} – {formatDateShort(trip.endDate)}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
            <MapPin className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xs text-neutral-500">Cities</p>
            <p className="text-sm font-semibold text-neutral-900">
              {trip.stops.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
            <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xs text-neutral-500">Activities</p>
            <p className="text-sm font-semibold text-neutral-900">
              {trip.stops.reduce((s, stop) => s + stop.activities.length, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
            <span className="text-primary text-lg font-bold block mb-0.5">
              ₹
            </span>
            <p className="text-xs text-neutral-500">Est. Cost</p>
            <p className="text-sm font-semibold text-neutral-900">
              {formatCurrency(totalCost)}
            </p>
          </div>
        </div>

        {trip.description && (
          <p className="text-sm text-neutral-600">{trip.description}</p>
        )}

        {/* Stops Timeline */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            Itinerary
          </h2>
          {trip.stops.map((stop, index) => (
            <div key={stop.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="flex items-center gap-3 p-4 bg-neutral-50 border-b border-neutral-200">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    {stop.place.name}
                    <span className="text-neutral-400 font-normal ml-1.5 text-sm">
                      {stop.place.country}
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {formatDateShort(stop.startDate)} →{" "}
                    {formatDateShort(stop.endDate)}
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-2">
                {stop.activities.length > 0 ? (
                  stop.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg"
                    >
                      {activity.place.imageUrl && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0">
                          <img
                            src={activity.place.imageUrl}
                            alt={activity.place.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900">
                          {activity.place.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {activity.startTime &&
                            `${activity.startTime}${activity.endTime ? ` – ${activity.endTime}` : ""} · `}
                          {formatDate(activity.scheduledDate)}
                        </p>
                      </div>
                      <span className="text-sm text-neutral-600 flex-shrink-0">
                        {activity.estimatedCost
                          ? formatCurrency(activity.estimatedCost)
                          : "Free"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-400 text-center py-3">
                    No activities listed
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center py-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-500 mb-4">
            Inspired? Copy this trip and make it your own.
          </p>
          <button
            onClick={() =>
              alert(`Trip "${trip.name}" copied to your trips!`)
            }
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-lg"
          >
            <Copy className="w-4 h-4" />
            Copy Trip to My Trips
          </button>
        </div>
      </div>
    </div>
  );
}
