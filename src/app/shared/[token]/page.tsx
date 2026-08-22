"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Calendar,
  MapPin,
  Clock,
  Copy,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useAuthStore } from "@/stores/authStore";

export default function SharedTripPage({
  params,
}: {
  params: { token: string };
}) {
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
     const fetchTrip = async () => {
         try {
             const res = await fetch(`/api/shared/${params.token}`);
             if (res.ok) {
                 const data = await res.json();
                 setTrip(data.data);
             }
         } catch (e) {
             console.error("Fetch shared trip error:", e);
         } finally {
             setIsLoading(false);
         }
     };
     fetchTrip();
  }, [params.token]);

  const copyTrip = async () => {
      if (!trip) return;
      try {
          const res = await fetch(`/api/trips/${trip.id}/copy`, {
              method: "POST"
          });
          if (res.ok) {
              alert(`Trip "${trip.name}" copied successfully! Check 'My Trips' or Dashboard.`);
          } else {
              alert("Failed to copy trip. Ensure you are logged in.");
          }
      } catch (e) {
          console.error("Copy trip error:", e);
      }
  };

  if (isLoading) {
      return (
          <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
             <div className="text-center text-neutral-500">Loading trip details...</div>
          </div>
      );
  }

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

  const routeString = trip.stops?.map((s: any) => s.cityPlace?.name).filter(Boolean).join(" → ") || "No stops added";
  
  const totalCost = trip.stops?.reduce((sum: number, stop: any) => {
     return sum + (stop.activities?.reduce((s: number, a: any) => s + (a.estimatedCost || 0), 0) || 0);
  }, 0) || 0;

  const totalActivities = trip.stops?.reduce((sum: number, stop: any) => sum + (stop.activities?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-neutral-900">
              GlobeTrotter
            </span>
          </Link>
          <button
            onClick={copyTrip}
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
              {new Date(trip.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} – {new Date(trip.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
            <MapPin className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xs text-neutral-500">Cities</p>
            <p className="text-sm font-semibold text-neutral-900">
              {trip.stops?.length || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
            <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xs text-neutral-500">Activities</p>
            <p className="text-sm font-semibold text-neutral-900">
              {totalActivities}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
            <span className="text-primary text-lg font-bold block mb-0.5">
              $
            </span>
            <p className="text-xs text-neutral-500">Est. Cost</p>
            <p className="text-sm font-semibold text-neutral-900">
              {totalCost.toLocaleString()}
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
          {trip.stops?.map((stop: any, index: number) => (
            <div key={stop.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="flex items-center gap-3 p-4 bg-neutral-50 border-b border-neutral-200">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    {stop.cityPlace?.name}
                    <span className="text-neutral-400 font-normal ml-1.5 text-sm">
                      {stop.cityPlace?.country}
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {new Date(stop.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} →{" "}
                    {new Date(stop.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-2">
                {stop.activities?.length > 0 ? (
                  stop.activities.map((activity: any) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg"
                    >
                      {activity.place?.imageUrl && (
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
                          {activity.place?.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {activity.startTime &&
                            `${new Date(activity.startTime).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}${activity.endTime ? ` – ${new Date(activity.endTime).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}` : ""} · `}
                          {new Date(activity.scheduledDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <span className="text-sm text-neutral-600 flex-shrink-0">
                        {activity.estimatedCost
                          ? `$${activity.estimatedCost.toLocaleString()}`
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
            onClick={copyTrip}
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
