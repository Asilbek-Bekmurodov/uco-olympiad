import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";
import type {
  RegisterFormData,
  VerifyPayload,
  LoginPayload,
  LoginResponse,
} from "../features/auth/types";

const baseQuery = fetchBaseQuery({
  // VITE_API_BASE_URL should include the API prefix, e.g. http://56.228.75.226:8080/api
  baseUrl: import.meta.env.VITE_API_BASE_URL as string,
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Public auth endpoints must not send stale Authorization headers
    if (endpoint && ["register", "verify", "loginUser"].includes(endpoint)) {
      return headers;
    }
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
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
  endpoints: (builder) => ({
    register: builder.mutation<void, RegisterFormData>({
      query: (body) => {
        const { firstname, lastname, ...rest } = body;
        return {
          url: "/auth/register",
          method: "POST",
          body: {
            // Backend expects snake-case keys for names
            firstname,
            lastname,
            ...rest,
            // Some backends expect `username`; mirror phone number to be safe
            username: rest.phoneNumber,
          },
        };
      },
    }),
    verify: builder.mutation<void, VerifyPayload>({
      query: (body) => ({
        url: "/auth/verify",
        method: "POST",
        body,
      }),
    }),
    loginUser: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: "/auth/loginuser",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useRegisterMutation, useVerifyMutation, useLoginUserMutation } =
  authApi;
