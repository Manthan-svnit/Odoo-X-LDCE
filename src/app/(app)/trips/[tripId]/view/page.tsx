"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  List,
  LayoutGrid,
  Share2,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { getTrip, formatDateShort, formatCurrency, formatDate } from "@/lib/mockData";
import { TripActivity } from "@/types";

type ViewMode = "day" | "city";

export default function ItineraryViewPage({
  params,
}: {
  params: { tripId: string };
}) {
  const trip = getTrip(params.tripId);
  const [viewMode, setViewMode] = useState<ViewMode>("day");

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

  // Group activities by day
  const activitiesByDay = new Map<string, { activity: TripActivity; city: string }[]>();
  trip.stops.forEach((stop) => {
    stop.activities.forEach((activity) => {
      const date = activity.scheduledDate;
      if (!activitiesByDay.has(date)) activitiesByDay.set(date, []);
      activitiesByDay.get(date)!.push({ activity, city: stop.place.name });
    });
  });

  const sortedDays = Array.from(activitiesByDay.keys()).sort();

  const routeString = trip.stops.map((s) => s.place.name).join(" → ");

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
            <p className="text-sm text-neutral-500 mt-1">
              {routeString}
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
              <Calendar className="w-4 h-4" />
              {formatDateShort(trip.startDate)} → {formatDateShort(trip.endDate)}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/trips/${trip.id}/builder`}>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </Link>
            <Link href={`/trips/${trip.id}/budget`}>
              <Button variant="secondary" size="sm">
                Budget
              </Button>
            </Link>
            <Button variant="secondary" size="sm" icon={<Share2 className="w-3.5 h-3.5" />}>
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setViewMode("day")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md ${
            viewMode === "day"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          <List className="w-4 h-4" />
          By Day
        </button>
        <button
          onClick={() => setViewMode("city")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md ${
            viewMode === "city"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          By City
        </button>
      </div>

      {/* Timeline */}
      {viewMode === "day" ? (
        sortedDays.length > 0 ? (
          <div className="space-y-6">
            {sortedDays.map((date, dayIndex) => {
              const dayActivities = activitiesByDay.get(date) || [];
              const dayCost = dayActivities.reduce(
                (sum, { activity }) => sum + (activity.estimatedCost || 0),
                0
              );

              return (
                <div key={date}>
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          D{dayIndex + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">
                          Day {dayIndex + 1}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatDate(date)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-neutral-600">
                      {formatCurrency(dayCost)}
                    </span>
                  </div>

                  {/* Activities */}
                  <div className="ml-5 border-l-2 border-neutral-200 pl-6 space-y-3">
                    {dayActivities.map(({ activity, city }) => (
                      <div
                        key={activity.id}
                        className="relative bg-white rounded-lg border border-neutral-200 p-4"
                      >
                        {/* Dot on timeline */}
                        <div className="absolute -left-[33px] top-5 w-3 h-3 bg-primary rounded-full border-2 border-white" />

                        <div className="flex items-start gap-3">
                          {activity.place.imageUrl && (
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                              <img
                                src={activity.place.imageUrl}
                                alt={activity.place.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-neutral-900">
                              {activity.place.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                              {activity.startTime && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {activity.startTime}
                                  {activity.endTime && ` – ${activity.endTime}`}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {city}
                              </span>
                            </div>
                            {activity.place.category && (
                              <Badge variant="default" className="mt-2">
                                {activity.place.category}
                              </Badge>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            {activity.estimatedCost !== undefined &&
                            activity.estimatedCost > 0 ? (
                              <span className="text-sm font-medium text-neutral-700">
                                {formatCurrency(activity.estimatedCost)}
                              </span>
                            ) : (
                              <span className="text-xs text-neutral-400">
                                Free
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Nothing scheduled yet"
            description="Go to the Itinerary Builder to add activities."
            actionLabel="Open Builder"
            onAction={() =>
              (window.location.href = `/trips/${trip.id}/builder`)
            }
          />
        )
      ) : (
        /* By City View */
        trip.stops.length > 0 ? (
          <div className="space-y-6">
            {trip.stops.map((stop) => {
              const stopCost = stop.activities.reduce(
                (sum, a) => sum + (a.estimatedCost || 0),
                0
              );

              return (
                <div
                  key={stop.id}
                  className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 bg-neutral-50 border-b border-neutral-200">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="font-semibold text-neutral-900">
                          {stop.place.name}
                        </h3>
                        <p className="text-xs text-neutral-500">
                          {formatDateShort(stop.startDate)} →{" "}
                          {formatDateShort(stop.endDate)} ·{" "}
                          {stop.place.country}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-primary">
                      {formatCurrency(stopCost)}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    {stop.activities.length > 0 ? (
                      stop.activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50"
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
                                `${activity.startTime}${
                                  activity.endTime
                                    ? ` – ${activity.endTime}`
                                    : ""
                                } · `}
                              {formatDate(activity.scheduledDate)}
                            </p>
                          </div>
                          <span className="text-sm text-neutral-600">
                            {activity.estimatedCost
                              ? formatCurrency(activity.estimatedCost)
                              : "Free"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-neutral-400 text-center py-3">
                        No activities planned
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No stops yet"
            description="Add destinations in the Itinerary Builder."
            actionLabel="Open Builder"
            onAction={() =>
              (window.location.href = `/trips/${trip.id}/builder`)
            }
          />
        )
      )}
    </div>
  );
}
