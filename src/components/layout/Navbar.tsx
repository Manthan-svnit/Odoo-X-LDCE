"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Globe,
  LayoutDashboard,
  Map,
  Compass,
  CalendarDays,
  Users,
  User,
  Plus,
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

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <>
      {/* Top bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-neutral-900">
              GlobeTrotter
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/trips/new"
              className="p-2 text-accent hover:bg-orange-50 rounded-lg"
              aria-label="Plan New Trip"
            >
              <Plus className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-modal overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <span className="text-lg font-bold text-neutral-900">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-3 py-4">
              <Link
                href="/trips/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-lg mb-4"
              >
                <Plus className="w-4 h-4" />
                Plan New Trip
              </Link>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg
                        ${
                          isActive
                            ? "bg-primary-50 text-primary"
                            : "text-neutral-600 hover:bg-neutral-50"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="px-4 py-4 mt-auto border-t border-neutral-200">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={user?.name} url={user?.avatarUrl} size="md" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {user?.name || "Guest"}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {user?.email || "Not logged in"}
                    </p>
                  </div>
                </div>
                {user && (
                  <button
                    onClick={async () => {
                       await fetch("/api/auth/logout", { method: "POST" });
                       await logout();
                       setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center py-2 text-sm text-error bg-red-50 hover:bg-red-100 rounded-lg"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
