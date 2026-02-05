import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";

export interface StatsResponse {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isstarted: boolean;
  message: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: async (args, api, extraOptions) => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl:
        (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
        "http://51.20.189.160:8080/api",
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
      },
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
    getStats: builder.query<StatsResponse, void>({
      query: () => ({
        url: "/admin/stats/users/count",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetStatsQuery } = userApi;
