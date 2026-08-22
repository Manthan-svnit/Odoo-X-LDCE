import { create } from "zustand";

interface UserPayload {
  sub: string;
  email: string;
  role: string;
  name: string;
}

interface AuthState {
  user: UserPayload | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserPayload | null) => void;
  clearUser: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // start loading to prevent hydration mismatch flashes

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  
  clearUser: () => set({ user: null, isAuthenticated: false, isLoading: false }),

  fetchMe: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        set({ user: data.data, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch user session:", error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
