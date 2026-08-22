import React from "react";
import {
  Users,
  Map,
  MapPin,
  Activity,
  TrendingUp,
} from "lucide-react";
import { mockTrips, mockCities, mockCommunityTrips } from "@/lib/mockData";

export default function AdminPage() {
  const totalUsers = 3; // Mock
  const totalTrips = mockTrips.length + mockCommunityTrips.length;
  const totalCities = mockCities.length;
  const totalActivities = mockTrips.reduce(
    (sum, t) =>
      sum + t.stops.reduce((s, stop) => s + stop.activities.length, 0),
    0
  );

  // Top cities by usage
  const cityCount: Record<string, number> = {};
  mockTrips.forEach((trip) => {
    trip.stops.forEach((stop) => {
      const name = stop.place.name;
      cityCount[name] = (cityCount[name] || 0) + 1;
    });
  });
  const topCities: [string, number][] = Object.entries(cityCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Platform overview and statistics.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">{totalUsers}</p>
          <p className="text-xs text-neutral-500 mt-0.5">Total Users</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-3">
            <Map className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">{totalTrips}</p>
          <p className="text-xs text-neutral-500 mt-0.5">Total Trips</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5 text-accent" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">{totalCities}</p>
          <p className="text-xs text-neutral-500 mt-0.5">Cities</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-3">
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">
            {totalActivities}
          </p>
          <p className="text-xs text-neutral-500 mt-0.5">Activities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cities */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Popular Cities
          </h3>
          <div className="space-y-3">
            {topCities.map(([city, count], index) => (
              <div
                key={city}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-neutral-100 rounded-full flex items-center justify-center text-xs font-medium text-neutral-600">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-neutral-900">
                    {city}
                  </span>
                </div>
                <span className="text-sm text-neutral-500">
                  {count} {count === 1 ? "trip" : "trips"}
                </span>
              </div>
            ))}
            {topCities.length === 0 && (
              <p className="text-sm text-neutral-400">No data yet</p>
            )}
          </div>
        </div>

        {/* Recent Trips */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">
            Recent Trips
          </h3>
          <div className="space-y-3">
            {mockTrips.slice(0, 5).map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {trip.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {trip.stops.map((s) => s.place.name).join(", ") ||
                      "No stops"}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    trip.status === "completed"
                      ? "bg-green-50 text-green-700"
                      : trip.status === "planned"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {trip.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
