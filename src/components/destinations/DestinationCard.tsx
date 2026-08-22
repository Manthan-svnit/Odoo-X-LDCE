import React from "react";
import { Star, MapPin } from "lucide-react";
import { Place } from "@/types";

interface DestinationCardProps {
  place: Place;
  onAdd?: () => void;
}

export default function DestinationCard({ place, onAdd }: DestinationCardProps) {
  return (
    <div className="group bg-white rounded-xl border border-neutral-200 shadow-card hover:shadow-card-hover overflow-hidden">
      {/* Image */}
      <div className="relative h-36 bg-neutral-100 overflow-hidden">
        {place.imageUrl ? (
          <img
            src={place.imageUrl}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white/60" />
          </div>
        )}
        {place.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-white/90 rounded-full text-xs font-medium">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            {place.rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="font-semibold text-neutral-900 text-sm truncate">
          {place.name}
        </h4>
        <p className="text-xs text-neutral-500 mt-0.5">{place.country}</p>

        {place.description && (
          <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
            {place.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          {place.costIndex !== undefined && (
            <span className="text-xs text-neutral-500">
              Cost index: {place.costIndex}
            </span>
          )}
          {onAdd && (
            <button
              onClick={onAdd}
              className="text-xs font-medium text-primary hover:text-primary-dark"
            >
              + Add to Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
