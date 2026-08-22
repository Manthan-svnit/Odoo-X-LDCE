"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Trash2,
  GripVertical,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { getTrip, formatDateShort, formatCurrency, mockActivities } from "@/lib/mockData";
import { TripStop, TripActivity } from "@/types";

export default function ItineraryBuilderPage({
  params,
}: {
  params: { tripId: string };
}) {
  const trip = getTrip(params.tripId);
  const [expandedStops, setExpandedStops] = useState<Set<string>>(
    new Set(trip?.stops.map((s) => s.id) || [])
  );
  const [showActivitySearch, setShowActivitySearch] = useState<string | null>(null);

  if (!trip) {
    return (
      <div className="max-w-4xl mx-auto">
        <EmptyState
          title="Trip not found"
          description="This trip doesn't exist or has been deleted."
          actionLabel="Back to My Trips"
          onAction={() => (window.location.href = "/trips")}
        />
      </div>
    );
  }

  const toggleStop = (stopId: string) => {
    setExpandedStops((prev) => {
      const next = new Set(prev);
      if (next.has(stopId)) next.delete(stopId);
      else next.add(stopId);
      return next;
    });
  };

  const getStopCost = (stop: TripStop) =>
    stop.activities.reduce((sum, a) => sum + (a.estimatedCost || 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/trips"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          My Trips
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{trip.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDateShort(trip.startDate)} → {formatDateShort(trip.endDate)}
              </span>
              <Badge variant="info">
                {trip.stops.length} {trip.stops.length === 1 ? "stop" : "stops"}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/trips/${trip.id}/view`}>
              <Button variant="secondary" size="sm">
                View Itinerary
              </Button>
            </Link>
            <Link href={`/trips/${trip.id}/budget`}>
              <Button variant="secondary" size="sm">
                Budget
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stops */}
      {trip.stops.length > 0 ? (
        <div className="space-y-4">
          {trip.stops.map((stop, index) => (
            <div
              key={stop.id}
              className="bg-white rounded-xl border border-neutral-200 shadow-card overflow-hidden"
            >
              {/* Stop Header */}
              <button
                onClick={() => toggleStop(stop.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-neutral-50 text-left"
              >
                <GripVertical className="w-4 h-4 text-neutral-300 flex-shrink-0 cursor-grab" />
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900">
                      {stop.place.name}
                    </h3>
                    <span className="text-xs text-neutral-400">
                      {stop.place.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDateShort(stop.startDate)} →{" "}
                      {formatDateShort(stop.endDate)}
                    </span>
                    <span>
                      {stop.activities.length}{" "}
                      {stop.activities.length === 1
                        ? "activity"
                        : "activities"}
                    </span>
                    <span className="text-primary font-medium">
                      {formatCurrency(getStopCost(stop))}
                    </span>
                  </div>
                </div>
                {expandedStops.has(stop.id) ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                )}
              </button>

              {/* Activities */}
              {expandedStops.has(stop.id) && (
                <div className="border-t border-neutral-100 px-4 pb-4">
                  {stop.activities.length > 0 ? (
                    <div className="space-y-2 mt-3">
                      {stop.activities.map((activity) => (
                        <ActivityItem
                          key={activity.id}
                          activity={activity}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-400 py-4 text-center">
                      No activities yet. Add some below!
                    </p>
                  )}
                  <button
                    onClick={() => setShowActivitySearch(stop.id)}
                    className="mt-3 flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Activity
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No stops yet"
          description="Add your first destination to start building your itinerary."
          actionLabel="+ Add First Stop"
          onAction={() => (window.location.href = "/discover")}
        />
      )}

      {/* Add Stop */}
      <div className="flex justify-center">
        <Link href="/discover">
          <Button variant="secondary" icon={<Plus className="w-4 h-4" />}>
            Add Another Stop
          </Button>
        </Link>
      </div>

      {/* Activity Search Modal (simplified inline) */}
      {showActivitySearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setShowActivitySearch(null)}
          />
          <div className="relative bg-white rounded-xl shadow-modal w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Activity</h3>
              <button
                onClick={() => setShowActivitySearch(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-3">
              {mockActivities.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    {act.imageUrl && (
                      <img
                        src={act.imageUrl}
                        alt={act.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900">
                      {act.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {act.category} · {act.country}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      alert(`Added ${act.name}!`);
                      setShowActivitySearch(null);
                    }}
                    className="text-xs font-medium text-primary hover:text-primary-dark"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Activity Item ─────────────────────────────────────────────
function ActivityItem({ activity }: { activity: TripActivity }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-neutral-50 group">
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0">
        {activity.place.imageUrl && (
          <img
            src={activity.place.imageUrl}
            alt={activity.place.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">
          {activity.place.name}
        </p>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          {activity.startTime && activity.endTime && (
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {activity.startTime} – {activity.endTime}
            </span>
          )}
          {activity.place.category && (
            <Badge variant="default">{activity.place.category}</Badge>
          )}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        {activity.estimatedCost !== undefined && activity.estimatedCost > 0 ? (
          <span className="text-sm font-medium text-neutral-700">
            {formatCurrency(activity.estimatedCost)}
          </span>
        ) : (
          <span className="text-xs text-neutral-400">Free</span>
        )}
      </div>
      <button
        className="p-1 text-neutral-300 hover:text-error opacity-0 group-hover:opacity-100"
        aria-label={`Remove ${activity.place.name}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
