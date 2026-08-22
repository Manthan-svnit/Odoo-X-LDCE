"use client";

import React, { useState, useCallback } from "react";
import SearchBar from "@/components/ui/SearchBar";
import DestinationCard from "@/components/destinations/DestinationCard";
import EmptyState from "@/components/ui/EmptyState";
import { getCities } from "@/lib/mockData";
import { Place } from "@/types";

const regions = ["All", "Europe", "Asia", "Middle East"];

export default function DiscoverPage() {
  const [results, setResults] = useState<Place[]>(getCities());
  const [activeRegion, setActiveRegion] = useState("All");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(
    (query: string) => {
      setHasSearched(!!query);
      let cities = getCities(query);
      if (activeRegion !== "All") {
        cities = cities.filter((c) => c.region === activeRegion);
      }
      setResults(cities);
    },
    [activeRegion]
  );

  const handleRegionFilter = (region: string) => {
    setActiveRegion(region);
    let cities = getCities();
    if (region !== "All") {
      cities = cities.filter((c) => c.region === region);
    }
    setResults(cities);
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
              px-3 py-1.5 text-sm rounded-full border
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
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((city) => (
            <DestinationCard
              key={city.id}
              place={city}
              onAdd={() => alert(`Added ${city.name} to trip!`)}
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
