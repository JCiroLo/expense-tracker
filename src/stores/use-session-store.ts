import { create } from "zustand";
import { persist } from "zustand/middleware";
import { signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

type SessionState = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        set({ user });
      },
      logout: async () => {
        await signOut(auth);
        set({ user: null });
      },
    }),
    {
      name: "session-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useSessionStore;
