import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "./types";
import type { PayloadAction } from "@reduxjs/toolkit";

const STORAGE_KEY = "auth_state";

const loadStoredAuth = (): AuthState => {
  if (typeof localStorage === "undefined") {
    return { token: null, isAuthenticated: false, role: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, isAuthenticated: false, role: null };
    const parsed = JSON.parse(raw);
    return {
      token: parsed.token ?? null,
      isAuthenticated: Boolean(parsed.token),
      role: parsed.role ?? null,
    };
  } catch {
    return { token: null, isAuthenticated: false, role: null };
  }
};

const initialState: AuthState = loadStoredAuth();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (
      state,
      action: PayloadAction<{
        token: string;
        role?: "admin" | "user" | string;
        remember?: boolean;
      }>,
    ) => {
      state.token = action.payload.token;
      state.role = (action.payload.role as "admin" | "user") ?? "user";
      state.isAuthenticated = true;
      const shouldPersist = action.payload.remember ?? true;
      if (shouldPersist && typeof localStorage !== "undefined") {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            token: state.token,
            role: state.role,
          }),
        );
      } else if (!shouldPersist && typeof localStorage !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
