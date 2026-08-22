"use client";

import React from "react";
import { User as UserIcon } from "lucide-react";

interface AvatarProps {
  url?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
};

export default function Avatar({ url, name, size = "md", className = "" }: AvatarProps) {
  const getInitials = (n?: string) => {
    if (!n) return "";
    return n.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-full overflow-hidden bg-primary/10 text-primary border border-primary/20 flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={name || "Avatar"}
          className="w-full h-full object-cover"
        />
      ) : name ? (
        <span className="font-bold tracking-wider">{getInitials(name)}</span>
      ) : (
        <UserIcon className="w-1/2 h-1/2" />
      )}
    </div>
  );
}
