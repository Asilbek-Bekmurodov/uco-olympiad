import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";

export interface CountdownResponse {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isStarted: boolean;
  message: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: async (args, api, extraOptions) => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: import.meta.env.VITE_API_BASE_URL as string,
      // No Authorization header for public countdown endpoint
    });

    const result = await rawBaseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
      api.dispatch(logout());
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return result;
  },
  endpoints: (builder) => ({
    getCountdown: builder.query<CountdownResponse, void>({
      query: () => ({
        url: "/tests/exam/1/countdown",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCountdownQuery } = userApi;
