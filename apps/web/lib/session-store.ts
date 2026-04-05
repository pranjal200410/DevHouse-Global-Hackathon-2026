"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "./types";

interface SessionStore {
  token: string | null;
  expiresAt: string | null;
  user: User | null;
  setSession: (payload: { token: string; expiresAt: string; user: User }) => void;
  clearSession: () => void;
}

const storage = createJSONStorage<SessionStore>(() => {
  if (typeof window !== "undefined") {
    return window.localStorage;
  }

  return {
    getItem: () => null,
    setItem: () => undefined,
    removeItem: () => undefined,
  };
});

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      token: null,
      expiresAt: null,
      user: null,
      setSession: ({ token, expiresAt, user }) => set({ token, expiresAt, user }),
      clearSession: () => set({ token: null, expiresAt: null, user: null }),
    }),
    {
      name: "scg-session",
      storage,
    },
  ),
);
