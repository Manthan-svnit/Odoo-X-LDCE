"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

interface FABProps {
  href: string;
  label?: string;
}

export default function FAB({ href, label }: FABProps) {
  return (
    <Link
      href={href}
      className="fixed bottom-6 right-6 md:hidden z-40 bg-accent hover:bg-accent-dark text-white p-4 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group"
      aria-label={label || "Add"}
    >
      <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
    </Link>
  );
}
