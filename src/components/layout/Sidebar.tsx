"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Compass,
  CalendarDays,
  Users,
  User,
  Plus,
  Globe,
} from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import { useAuthStore } from "@/stores/authStore";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Trips", href: "/trips", icon: Map },
  { name: "Discover", href: "/discover", icon: Compass },
  { name: "Calendar", href: "/calendar", icon: CalendarDays },
  { name: "Community", href: "/community", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-neutral-200 min-h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-neutral-200">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-neutral-900">
            GlobeTrotter
          </span>
        </Link>
      </div>

      {/* CTA */}
      <div className="px-4 pt-5 pb-2">
        <Link
          href="/trips/new"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Plan New Trip
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg
                ${
                  isActive
                    ? "bg-primary-50 text-primary"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-neutral-200">
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Avatar name={user?.name} url={user?.avatarUrl} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {user?.name || "Guest"}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {user?.email || "Not logged in"}
                </p>
              </div>
            </div>
            {user && (
              <button
                onClick={async () => {
                   await fetch("/api/auth/logout", { method: "POST" });
                   await logout();
                }}
                className="flex w-full items-center justify-center py-2 text-sm text-error bg-red-50 hover:bg-red-100 rounded-lg"
              >
                Logout
              </button>
            )}
        </div>
      </div>
    </aside>
  );
}
