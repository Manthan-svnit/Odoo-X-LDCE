"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  debounceMs = 300,
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, debounceMs, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-neutral-300
          bg-white text-neutral-900 placeholder:text-neutral-400
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
        "
        aria-label={placeholder}
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-neutral-400 hover:text-neutral-600"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
