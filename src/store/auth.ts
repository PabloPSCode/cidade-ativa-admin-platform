import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clearAuthToken, setAuthToken } from "@/services/api";
import type { UserResponseDTO } from "@/services/users";

type State = {
  isAuthenticated: boolean;
  token: string | null;
  user: UserResponseDTO | null;
};

type Actions = {
  signIn: (token: string, user: UserResponseDTO) => void;
  signOut: () => void;
};

export const useAuthenticationStore = create(
  persist<State & Actions>(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      signIn: (token, user) => {
        setAuthToken(token);
        set({ isAuthenticated: true, token, user });
      },
      signOut: () => {
        clearAuthToken();
        set({ isAuthenticated: false, token: null, user: null });
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
      // Re-hydrate the in-memory axios token after a page reload so persisted
      // sessions keep sending the Authorization header.
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token);
        }
      },
    }
  )
);
