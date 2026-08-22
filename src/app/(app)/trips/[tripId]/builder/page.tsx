"use client";

import React, { useState, useEffect } from "react";
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
  Search
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useAuthStore } from "@/stores/authStore";

export default function ItineraryBuilderPage({
  params,
}: {
  params: { tripId: string };
}) {
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedStops, setExpandedStops] = useState<Set<string>>(new Set());
  const [showActivitySearch, setShowActivitySearch] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTrip = async () => {
    try {
      const res = await fetch(`/api/trips/${params.tripId}`);
      if (res.ok) {
         const data = await res.json();
         setTrip(data.data);
         if (expandedStops.size === 0 && data.data.stops?.length > 0) {
            setExpandedStops(new Set([data.data.stops[0].id]));
         }
      }
    } catch (error) {
      console.error("Fetch trip error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [params.tripId]);

  const toggleStop = (stopId: string) => {
    setExpandedStops((prev) => {
      const next = new Set(prev);
      if (next.has(stopId)) next.delete(stopId);
      else next.add(stopId);
      return next;
    });
  };

  const getStopCost = (stop: any) =>
    stop.activities?.reduce((sum: number, a: any) => sum + (a.estimatedCost || 0), 0) || 0;

  const handleSearchActivities = async (q: string, cityPlaceId: string) => {
    setSearchQuery(q);
    if (q.length < 2) {
       setSearchResults([]);
       return;
    }
    // Simple search hitting our generic place search API or OTM if we had one
    // For now, let's just hit our generic /api/places/activities
    try {
        const res = await fetch(`/api/places/activities/search?q=${encodeURIComponent(q)}&cityPlaceId=${cityPlaceId}`);
        if (res.ok) {
            const data = await res.json();
            setSearchResults(data.data || []);
        }
    } catch (e) {
        console.error("Search failed:", e);
    }
  };

  const addActivity = async (stopId: string, place: any) => {
     try {
         const res = await fetch(`/api/trips/${params.tripId}/activities`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
                 stopId,
                 placeId: place.id,
                 scheduledDate: new Date().toISOString(), // Default
                 estimatedCost: place.estimatedCost || 0,
                 orderIndex: 0
             })
         });
         if (res.ok) {
             setShowActivitySearch(null);
             setSearchQuery("");
             setSearchResults([]);
             await fetchTrip();
         }
     } catch (e) {
         console.error("Failed to add activity:", e);
     }
  };

  const deleteActivity = async (activityId: string) => {
      if (!confirm("Are you sure you want to remove this activity?")) return;
      try {
         const res = await fetch(`/api/trips/${params.tripId}/activities?activityId=${activityId}`, {
             method: "DELETE"
         });
         if (res.ok) {
             await fetchTrip();
         }
      } catch (e) {
         console.error("Failed to delete activity:", e);
      }
  };

  if (isLoading) {
      return <div className="max-w-4xl mx-auto text-center py-12 text-neutral-500">Loading builder...</div>;
  }

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
                {new Date(trip.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} → {new Date(trip.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
              </span>
              <Badge variant="info">
                {trip.stops?.length || 0} {trip.stops?.length === 1 ? "stop" : "stops"}
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
      {trip.stops?.length > 0 ? (
        <div className="space-y-4">
          {trip.stops.map((stop: any, index: number) => (
            <div
              key={stop.id}
              className="bg-white rounded-xl border border-neutral-200 shadow-card overflow-hidden"
            >
              {/* Stop Header */}
              <button
                onClick={() => toggleStop(stop.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-neutral-50 text-left"
              >
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900">
                      {stop.cityPlace?.name}
                    </h3>
                    <span className="text-xs text-neutral-400">
                      {stop.cityPlace?.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(stop.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} →{" "}
                      {new Date(stop.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </span>
                    <span>
                      {stop.activities?.length || 0}{" "}
                      {stop.activities?.length === 1
                        ? "activity"
                        : "activities"}
                    </span>
                    <span className="text-primary font-medium">
                      ${getStopCost(stop).toLocaleString()}
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
                  <StopActivitiesList 
                     tripId={trip.id} 
                     stopId={stop.id} 
                     activities={stop.activities || []} 
                     onDelete={deleteActivity}
                     onReorder={fetchTrip}
                  />
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

      {/* Activity Search Modal */}
      {showActivitySearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => {
                setShowActivitySearch(null);
                setSearchQuery("");
                setSearchResults([]);
            }}
          />
          <div className="relative bg-white rounded-xl shadow-modal w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Search Activities</h3>
              <button
                onClick={() => {
                    setShowActivitySearch(null);
                    setSearchQuery("");
                    setSearchResults([]);
                }}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 border-b border-neutral-100">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                 <input 
                    type="text"
                    placeholder="Search places, restaurants, attractions..."
                    value={searchQuery}
                    onChange={(e) => handleSearchActivities(e.target.value, showActivitySearch)}
                    className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                 />
               </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {searchQuery.length < 2 && searchResults.length === 0 && (
                  <p className="text-sm text-neutral-500 text-center py-4">Type to search for activities...</p>
              )}
              {searchQuery.length >= 2 && searchResults.length === 0 && (
                  <p className="text-sm text-neutral-500 text-center py-4">No results found.</p>
              )}
              {searchResults.map((act) => (
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
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {act.name}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {act.category} · {act.country}
                    </p>
                  </div>
                  <button
                    onClick={() => addActivity(showActivitySearch, act)}
                    className="text-xs font-medium px-3 py-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20"
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

function StopActivitiesList({ tripId, stopId, activities, onDelete, onReorder }: { tripId: string, stopId: string, activities: any[], onDelete: (id:string) => void, onReorder: () => void }) {
    const [items, setItems] = useState(activities);
    
    useEffect(() => {
        setItems(activities);
    }, [activities]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over?.id);
            const newItems = arrayMove(items, oldIndex, newIndex);
            
            setItems(newItems);
            
            // Sync with backend
            try {
                await fetch(`/api/trips/${tripId}/reorder`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        stopId,
                        activities: newItems.map((item, idx) => ({ id: item.id, orderIndex: idx }))
                    })
                });
                onReorder(); // refresh data just in case
            } catch (e) {
                console.error("Reorder failed", e);
            }
        }
    };

    if (items.length === 0) {
        return (
            <p className="text-sm text-neutral-400 py-4 text-center border border-dashed border-neutral-200 rounded-lg mt-3">
              No activities yet. Add some below!
            </p>
        );
    }

    return (
        <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext 
                items={items.map(a => a.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-2 mt-3">
                    {items.map((activity) => (
                        <SortableActivityItem 
                            key={activity.id} 
                            activity={activity} 
                            onDelete={onDelete} 
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}

function SortableActivityItem({ activity, onDelete }: { activity: any, onDelete: (id: string) => void }) {
  const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
  } = useSortable({ id: activity.id });

  const style = {
      transform: CSS.Transform.toString(transform),
      transition,
  };

  return (
    <div 
        ref={setNodeRef} 
        style={style} 
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-neutral-50 group border border-neutral-200"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab p-1 text-neutral-400 hover:text-neutral-600"
      >
          <GripVertical className="w-4 h-4" />
      </div>

      <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0">
        {activity.place?.imageUrl && (
          <img
            src={activity.place.imageUrl}
            alt={activity.place.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">
          {activity.place?.name}
        </p>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          {activity.startTime && activity.endTime && (
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {new Date(activity.startTime).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })} – {new Date(activity.endTime).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
            </span>
          )}
          {activity.place?.category && (
            <Badge variant="default">{activity.place.category}</Badge>
          )}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        {activity.estimatedCost !== undefined && activity.estimatedCost !== null && activity.estimatedCost > 0 ? (
          <span className="text-sm font-medium text-neutral-700">
            ${activity.estimatedCost.toLocaleString()}
          </span>
        ) : (
          <span className="text-xs text-neutral-400">Free</span>
        )}
      </div>
      <button
        onClick={() => onDelete(activity.id)}
        className="p-1 text-neutral-300 hover:text-error opacity-0 group-hover:opacity-100"
        aria-label={`Remove ${activity.place?.name}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
