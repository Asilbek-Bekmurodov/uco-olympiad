import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/auth/authSlice";
import type { RootState } from "../store";

export interface CountdownResponse {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isStarted: boolean;
  message: string;
}

export interface AdminUserRole {
  id?: number;
  role: string;
}

export interface AdminUser {
  id: number;
  firstname: string;
  lastname: string;
  className?: string;
  language?: string;
  phoneNumber?: string;
  username?: string;
  enabled?: boolean;
  roles?: AdminUserRole[];
}

export interface AdminUserCreateRequest {
  firstname: string;
  lastname: string;
  className?: string;
  language?: string;
  phoneNumber?: string;
  username?: string;
  password?: string;
  roles?: AdminUserRole[];
  enabled?: boolean;
}

export interface AdminUserUpdateRequest extends AdminUserCreateRequest {
  id: number;
}

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL as string,
  prepareHeaders: (headers, { getState, endpoint }) => {
    if (endpoint === "getCountdown") return headers;
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
      api.dispatch(logout());
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return result;
  },
  tagTypes: ["AdminUsers"],
  endpoints: (builder) => ({
    getCountdown: builder.query<CountdownResponse, void>({
      query: () => ({
        url: "/tests/exam/1/countdown",
        method: "GET",
      }),
    }),
    getAdminUsers: builder.query<AdminUser[], void>({
      query: () => ({
        url: "/admin/users",
        method: "GET",
      }),
      providesTags: ["AdminUsers"],
    }),
    createAdminUser: builder.mutation<AdminUser, AdminUserCreateRequest>({
      query: (body) => ({
        url: "/admin/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminUsers"],
    }),
    updateAdminUser: builder.mutation<AdminUser, AdminUserUpdateRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdminUsers"],
    }),
    deleteAdminUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminUsers"],
    }),
  }),
});

export const {
  useGetCountdownQuery,
  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
} = userApi;
