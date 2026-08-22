"use client";

import React, { useState, useCallback, useEffect } from "react";
import SearchBar from "@/components/ui/SearchBar";
import DestinationCard from "@/components/destinations/DestinationCard";
import EmptyState from "@/components/ui/EmptyState";
import { useAuthStore } from "@/stores/authStore";

const regions = ["All", "Europe", "Asia", "Middle East", "Americas", "Africa"];

export default function DiscoverPage() {
  const [results, setResults] = useState<any[]>([]);
  const [activeRegion, setActiveRegion] = useState("All");
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedPlaces, setSavedPlaces] = useState<Set<string>>(new Set());
  
  const { user } = useAuthStore();

  useEffect(() => {
     // Fetch initially popular places (simulated with empty search)
     handleSearch("");
     fetchSavedPlaces();
  }, []);

  const fetchSavedPlaces = async () => {
      if (!user) return;
      try {
          const res = await fetch("/api/user/saved-places");
          if (res.ok) {
              const data = await res.json();
              setSavedPlaces(new Set(data.data.map((p: any) => p.id)));
          }
      } catch (e) {
          console.error("Fetch saved places err:", e);
      }
  };

  const handleSearch = useCallback(
    async (query: string) => {
      setHasSearched(!!query);
      setIsLoading(true);
      try {
          const res = await fetch(`/api/places/cities/search?q=${encodeURIComponent(query)}`);
          if (res.ok) {
              const data = await res.json();
              setResults(data.data || []);
          }
      } catch (e) {
          console.error("Search failed:", e);
      } finally {
          setIsLoading(false);
      }
    },
    []
  );

  const handleRegionFilter = (region: string) => {
    setActiveRegion(region);
    // Real implementation would filter backend results or re-fetch with region param.
    // For now we just re-fetch with region as query or filter locally if we had them all.
    // Let's just do a mock local filter for now on the current results if they have region.
    handleSearch(region === "All" ? "" : region); 
  };

  const toggleSave = async (placeId: string, isSaved: boolean) => {
      try {
          if (isSaved) {
              await fetch(`/api/user/saved-places?placeId=${placeId}`, { method: "DELETE" });
              setSavedPlaces(prev => {
                  const n = new Set(prev);
                  n.delete(placeId);
                  return n;
              });
          } else {
              await fetch(`/api/user/saved-places`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ placeId })
              });
              setSavedPlaces(prev => {
                  const n = new Set(prev);
                  n.add(placeId);
                  return n;
              });
          }
      } catch (e) {
          console.error("Save toggle error:", e);
      }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Discover Destinations
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Search for cities to add to your trip.
        </p>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search cities by name or country..."
        onSearch={handleSearch}
      />

      {/* Region Filter */}
      <div className="flex gap-2 flex-wrap">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => handleRegionFilter(region)}
            className={`
              px-3 py-1.5 text-sm rounded-full border transition-colors
              ${
                activeRegion === region
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50"
              }
            `}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
          <div className="text-center py-12 text-neutral-500">Searching destinations...</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((city) => (
            <DestinationCard
              key={city.id}
              place={city}
              isSaved={savedPlaces.has(city.id)}
              onToggleSave={() => toggleSave(city.id, savedPlaces.has(city.id))}
              onAdd={() => alert(`Added ${city.name} to trip! (Hook up modal here)`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={hasSearched ? "No cities found" : "No destinations available"}
          description={
            hasSearched
              ? "Try a different search term or region."
              : "Check back later for destinations."
          }
        />
      )}
    </div>
  );
}
