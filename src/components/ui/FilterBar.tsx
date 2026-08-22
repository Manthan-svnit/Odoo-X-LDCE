"use client";

import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  
  filterOptions?: FilterOption[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  
  sortOptions?: FilterOption[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
}

export default function FilterBar({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filterOptions,
  filterValue,
  onFilterChange,
  sortOptions,
  sortValue,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-2 rounded-2xl border border-neutral-200">
      {onSearchChange && (
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 placeholder:text-neutral-400"
          />
        </div>
      )}

      <div className="flex items-center gap-2 w-full sm:w-auto">
        {(filterOptions || sortOptions) && (
          <div className="p-2 bg-neutral-50 rounded-xl text-neutral-500">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
        )}

        {filterOptions && onFilterChange && (
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="flex-1 sm:flex-none text-sm py-2 pl-3 pr-8 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-neutral-600 font-medium"
          >
            <option value="">All</option>
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {sortOptions && onSortChange && (
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="flex-1 sm:flex-none text-sm py-2 pl-3 pr-8 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-neutral-600 font-medium"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
