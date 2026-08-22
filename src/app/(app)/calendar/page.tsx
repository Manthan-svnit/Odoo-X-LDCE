"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     const fetchTrips = async () => {
         try {
             const res = await fetch("/api/trips");
             if (res.ok) {
                 const data = await res.json();
                 setTrips(data.data || []);
             }
         } catch (e) {
             console.error("Failed to fetch trips for calendar", e);
         } finally {
             setIsLoading(false);
         }
     };
     fetchTrips();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () =>
    setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(year, month + 1, 1));

  // Build a map: dateStr -> activities
  const activityMap = new Map<
    string,
    { activity: any; tripName: string; city: string }[]
  >();
  // Also build a map: dateStr -> trip stop city
  const tripDayMap = new Map<string, { tripName: string; city: string }>();

  trips.forEach((trip) => {
    trip.stops?.forEach((stop: any) => {
      // Mark each day of the stop
      const start = new Date(stop.startDate);
      const end = new Date(stop.endDate);
      for (
        let d = new Date(start);
        d <= end;
        d.setDate(d.getDate() + 1)
      ) {
        const key = d.toISOString().split("T")[0];
        tripDayMap.set(key, { tripName: trip.name, city: stop.cityPlace?.name || "Unknown City" });
      }

      stop.activities?.forEach((activity: any) => {
        const key = new Date(activity.scheduledDate).toISOString().split("T")[0];
        if (!activityMap.has(key)) activityMap.set(key, []);
        activityMap.get(key)!.push({
          activity,
          tripName: trip.name,
          city: stop.cityPlace?.name || "Unknown City",
        });
      });
    });
  });

  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split("T")[0]);
  const selectedActivities = selectedDate
    ? activityMap.get(selectedDate) || []
    : [];
  const selectedTripDay = selectedDate ? tripDayMap.get(selectedDate) : null;

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Trip Calendar</h1>
        <p className="text-sm text-neutral-500 mt-1">
          View your trips and activities on a calendar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-4 md:p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-neutral-900">
              {monthName}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-neutral-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day Cells */}
          {isLoading ? (
             <div className="text-center py-12 text-neutral-500">Loading calendar data...</div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells before first day */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-20 md:h-24" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayActivities = activityMap.get(dateStr) || [];
                const tripDay = tripDayMap.get(dateStr);
                const isSelected = selectedDate === dateStr;
                const hasContent = tripDay || dayActivities.length > 0;
                const isToday =
                  new Date().toISOString().split("T")[0] === dateStr;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`
                      h-20 md:h-24 p-1.5 rounded-lg text-left border overflow-hidden
                      ${
                        isSelected
                          ? "border-primary bg-primary-50"
                          : hasContent
                          ? "border-neutral-200 bg-white hover:border-primary/40"
                          : "border-transparent hover:bg-neutral-50"
                      }
                      ${isToday ? "ring-2 ring-primary/30" : ""}
                    `}
                  >
                    <span
                      className={`text-xs font-medium ${
                        isToday
                          ? "text-primary"
                          : hasContent
                          ? "text-neutral-900"
                          : "text-neutral-400"
                      }`}
                    >
                      {day}
                    </span>
                    {tripDay && (
                      <p className="text-[10px] text-primary font-medium mt-1 truncate">
                        {tripDay.city}
                      </p>
                    )}
                    {dayActivities.length > 0 && (
                      <div className="mt-0.5 space-y-0.5">
                        {dayActivities.slice(0, 2).map(({ activity }) => (
                          <p
                            key={activity.id}
                            className="text-[10px] text-neutral-500 truncate"
                          >
                            • {activity.place?.name}
                          </p>
                        ))}
                        {dayActivities.length > 2 && (
                          <p className="text-[10px] text-neutral-400">
                            +{dayActivities.length - 2} more
                          </p>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar: Selected Day Details */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 md:p-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">
            {selectedDate
              ? new Date(selectedDate + "T00:00:00").toLocaleDateString(
                  "en-IN",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )
              : "Select a date"}
          </h3>

          {selectedDate && selectedTripDay && (
            <div className="flex items-center gap-2 mb-4 p-2 bg-primary-50 rounded-lg">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-primary">
                  {selectedTripDay.city}
                </p>
                <p className="text-[10px] text-primary/70">
                  {selectedTripDay.tripName}
                </p>
              </div>
            </div>
          )}

          {selectedActivities.length > 0 ? (
            <div className="space-y-3">
              {selectedActivities.map(({ activity }) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg"
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
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {activity.place?.name}
                    </p>
                    {activity.startTime && (
                      <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(activity.startTime).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                        {activity.endTime && ` – ${new Date(activity.endTime).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}`}
                      </p>
                    )}
                    {activity.estimatedCost !== undefined &&
                      activity.estimatedCost !== null &&
                      activity.estimatedCost > 0 && (
                        <p className="text-xs text-neutral-500 mt-0.5">
                          ${activity.estimatedCost.toLocaleString()}
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          ) : selectedDate ? (
            <p className="text-sm text-neutral-400 text-center py-8">
              No activities on this day
            </p>
          ) : (
            <p className="text-sm text-neutral-400 text-center py-8">
              Click a date to see activities
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
