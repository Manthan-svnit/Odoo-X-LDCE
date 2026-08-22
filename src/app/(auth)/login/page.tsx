"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, MapPin, Plane } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    // Mock login — replace with real auth API
    await new Promise((res) => setTimeout(res, 800));
    setIsLoading(false);
    router.push("/dashboard");
  };

  return (
    <>
      {/* Left — Illustration Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-teal-900" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">GlobeTrotter</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
            Plan your dream
            <br />
            adventure
          </h1>
          <p className="text-lg text-teal-100 max-w-md mb-8">
            Create multi-city itineraries, track budgets, and share your trips
            with the world — all in one place.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-teal-100">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span>Discover destinations worldwide</span>
            </div>
            <div className="flex items-center gap-3 text-teal-100">
              <Plane className="w-5 h-5 flex-shrink-0" />
              <span>Build day-by-day itineraries</span>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute top-20 -right-10 w-40 h-40 bg-white/5 rounded-full" />
      </div>

      {/* Right — Form Side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-neutral-900">
              GlobeTrotter
            </span>
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 mb-1">
            Welcome back 👋
          </h2>
          <p className="text-neutral-500 text-sm mb-8">
            Continue planning your next adventure.
          </p>

          {error && (
            <div className="mb-4 p-3 text-sm text-error bg-red-50 rounded-lg" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-end">
              <Link
                href="#"
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Log in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
