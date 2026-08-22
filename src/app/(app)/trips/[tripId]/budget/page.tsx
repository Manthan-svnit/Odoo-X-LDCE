"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  DollarSign,
  Plane,
  Home,
  Utensils,
  Ticket,
  MoreHorizontal,
  TrendingUp,
  Calendar,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CATEGORY_COLORS: Record<string, string> = {
  transport: "#3B82F6",
  stay: "#8B5CF6",
  activity: "#0F766E",
  meals: "#F97316",
  other: "#6B7280",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  transport: <Plane className="w-4 h-4" />,
  stay: <Home className="w-4 h-4" />,
  activity: <Ticket className="w-4 h-4" />,
  meals: <Utensils className="w-4 h-4" />,
  other: <MoreHorizontal className="w-4 h-4" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  transport: "Transportation",
  stay: "Accommodation",
  activity: "Activities",
  meals: "Food & Dining",
  other: "Other",
};

export default function BudgetPage({
  params,
}: {
  params: { tripId: string };
}) {
  const [trip, setTrip] = useState<any>(null);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBudgetInfo = async () => {
      try {
        const [tripRes, budgetRes] = await Promise.all([
          fetch(`/api/trips/${params.tripId}`),
          fetch(`/api/trips/${params.tripId}/budgets`),
        ]);

        if (tripRes.ok) {
           const data = await tripRes.json();
           setTrip(data.data);
        }
        if (budgetRes.ok) {
           const data = await budgetRes.json();
           setBudgets(data.data || []);
        }
      } catch (e) {
        console.error("Failed to load budget info:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBudgetInfo();
  }, [params.tripId]);

  if (isLoading) {
      return <div className="max-w-5xl mx-auto text-center py-12 text-neutral-500">Loading budget...</div>;
  }

  if (!trip) {
    return (
      <div className="max-w-4xl mx-auto">
        <EmptyState
          title="Trip not found"
          description="This trip doesn't exist."
          actionLabel="Back to My Trips"
          onAction={() => (window.location.href = "/trips")}
        />
      </div>
    );
  }

  // Calculate budget info
  const overallLimit = budgets.find(b => b.category === "overall")?.limitAmount || 0;
  
  const byCategory: Record<string, number> = {
      transport: 0,
      stay: 0,
      activity: 0,
      meals: 0,
      other: 0
  };

  const byDayMap = new Map<string, number>();

  let totalSpent = 0;

  if (trip.stops) {
      trip.stops.forEach((stop: any) => {
          if (stop.activities) {
              stop.activities.forEach((activity: any) => {
                  const cost = activity.estimatedCost || 0;
                  totalSpent += cost;

                  // Simple heuristic for mapping place category to budget category
                  const cat = activity.place?.category?.toLowerCase() || "other";
                  let mappedCat = "other";
                  if (cat.includes("flight") || cat.includes("transport") || cat.includes("train") || cat.includes("bus")) mappedCat = "transport";
                  else if (cat.includes("hotel") || cat.includes("hostel") || cat.includes("stay") || cat.includes("resort")) mappedCat = "stay";
                  else if (cat.includes("restaurant") || cat.includes("food") || cat.includes("cafe") || cat.includes("bar")) mappedCat = "meals";
                  else if (cat.includes("activity") || cat.includes("museum") || cat.includes("park") || cat.includes("attraction")) mappedCat = "activity";
                  else mappedCat = "other"; // Default all else to other, actually let's just use activity for everything else for now to show data
                  
                  byCategory[mappedCat] += cost;

                  const date = new Date(activity.scheduledDate).toISOString().split('T')[0];
                  if (!byDayMap.has(date)) byDayMap.set(date, 0);
                  byDayMap.set(date, byDayMap.get(date)! + cost);
              });
          }
      });
  }

  const isOverBudget = overallLimit > 0 && totalSpent > overallLimit;
  const remaining = overallLimit > 0 ? overallLimit - totalSpent : 0;

  // Pie chart data
  const pieData = Object.entries(byCategory)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: CATEGORY_LABELS[key] || key,
      value,
      color: CATEGORY_COLORS[key] || "#6B7280",
    }));

  // Bar chart data
  const barData = Array.from(byDayMap.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      amount,
    }));

  // Days count
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  const avgPerDay = days > 0 ? Math.round(totalSpent / days) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/trips/${trip.id}/view`}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {trip.name}
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">Trip Budget</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {new Date(trip.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} → {new Date(trip.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} ·{" "}
          {days} days
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
          </div>
          <p className="text-xs text-neutral-500">Total Estimated</p>
          <p className="text-xl font-bold text-neutral-900">
            ${totalSpent.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isOverBudget ? "bg-red-50" : "bg-green-50"}`}>
              <TrendingUp className={`w-4 h-4 ${isOverBudget ? "text-error" : "text-success"}`} />
            </div>
          </div>
          <p className="text-xs text-neutral-500">
            {isOverBudget ? "Over Budget" : "Remaining"}
          </p>
          <p className={`text-xl font-bold ${isOverBudget ? "text-error" : "text-success"}`}>
            {overallLimit > 0
              ? `$${Math.abs(remaining).toLocaleString()}`
              : "No limit set"}
          </p>
          {overallLimit > 0 && (
            <Badge variant={isOverBudget ? "error" : "success"} className="mt-1">
              {isOverBudget ? "Over budget" : "Within budget"}
            </Badge>
          )}
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-info" />
            </div>
          </div>
          <p className="text-xs text-neutral-500">Avg. Per Day</p>
          <p className="text-xl font-bold text-neutral-900">
            ${avgPerDay.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <Ticket className="w-4 h-4 text-accent" />
            </div>
          </div>
          <p className="text-xs text-neutral-500">Budget Limit</p>
          <p className="text-xl font-bold text-neutral-900">
            {overallLimit > 0 ? `$${overallLimit.toLocaleString()}` : "Not set"}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">
            Breakdown by Category
          </h3>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-6">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: unknown) => `$${Number(value).toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {pieData.map((entry) => (
                  <div
                    key={entry.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-neutral-600">{entry.name}</span>
                    </div>
                    <span className="font-medium text-neutral-900">
                      ${entry.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-400 text-center py-8">
              No cost data available
            </p>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">
            Spend per Day
          </h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  formatter={(value: unknown) => `$${Number(value).toLocaleString()}`}
                  labelStyle={{ color: "#111827", fontWeight: 600 }}
                />
                <Bar dataKey="amount" fill="#0F766E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-neutral-400 text-center py-8">
              No daily spend data
            </p>
          )}
        </div>
      </div>

      {/* Category Cards */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">
          Category Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(byCategory).map(([category, amount]) => {
            const limit = budgets.find(b => b.category === category)?.limitAmount || 0;
            const isOver = limit > 0 && amount > limit;
            const percentage = limit > 0 ? Math.min((amount / limit) * 100, 100) : 0;

            return (
              <div
                key={category}
                className="bg-white rounded-xl border border-neutral-200 p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor:
                        (CATEGORY_COLORS[category] || "#6B7280") + "15",
                      color: CATEGORY_COLORS[category] || "#6B7280",
                    }}
                  >
                    {CATEGORY_ICONS[category]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {CATEGORY_LABELS[category] || category}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {limit > 0
                        ? `Limit: $${limit.toLocaleString()}`
                        : "No limit"}
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold text-neutral-900 mb-2">
                  ${amount.toLocaleString()}
                </p>
                {limit > 0 && (
                  <div className="w-full bg-neutral-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: isOver
                          ? "#DC2626"
                          : CATEGORY_COLORS[category],
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
