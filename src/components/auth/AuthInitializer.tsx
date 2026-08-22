"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function AuthInitializer() {
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return null;
}
