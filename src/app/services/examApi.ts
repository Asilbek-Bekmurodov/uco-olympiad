import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/auth/authSlice";
import type { RootState } from "../store";

export interface CreateExamRequest {
  title: string;
  durationMinutes: number;
  className: string;
  subject: string;
  language: string;
  maxScore: number;
  passingScore: number;
}

export interface ExamOption {
  id: number;
  text: string;
}

export interface ExamQuestion {
  id: number;
  text: string;
  imageUrl?: string | null;
  options: ExamOption[];
  points?: number;
}

export interface CreateExamResponse {
  id?: number;
  title?: string;
  durationMinutes?: number;
  visible?: boolean;
  className?: string;
  subject?: string;
  language?: string;
  maxScore?: number;
  passingScore?: number;
  questions?: ExamQuestion[];
}

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL as string,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const examApi = createApi({
  reducerPath: "examApi",
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
  tagTypes: ["Exams", "Questions"],
  endpoints: (builder) => ({
    createExam: builder.mutation<CreateExamResponse, CreateExamRequest>({
      query: (body) => ({
        url: "/admin/exams",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Exams"],
    }),
    editExam: builder.mutation<
      CreateExamResponse,
      { id: number } & CreateExamRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/exams/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Exams"],
    }),
    deleteExam: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/exams/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Exams"],
    }),
    importQuestions: builder.mutation<void, { id: number; formData: FormData }>(
      {
        query: ({ id, formData }) => ({
          url: `/admin/exams/${id}/import-questions`,
          method: "POST",
          body: formData,
          responseHandler: (response: Response) => response.text(),
        }),
        invalidatesTags: ["Exams"],
      },
    ),
    getExam: builder.query<CreateExamResponse[], void>({
      query: () => ({
        url: "/admin/exams",
      }),
      providesTags: ["Exams"],
    }),
    getExamById: builder.query<CreateExamResponse, number>({
      query: (id) => ({
        url: `/admin/exams/${id}`,
      }),
      providesTags: ["Exams", "Questions"],
    }),
    toggleExamVisibility: builder.mutation<CreateExamResponse, { id: number }>({
      query: ({ id }) => ({
        url: `/admin/exams/${id}/toggle-visibility`,
        method: "PUT",
      }),
      invalidatesTags: ["Exams"],
    }),
    importQuestionImage: builder.mutation<
      void,
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/admin/questions/${id}/image`,
        method: "POST",
        body: formData,
        responseHandler: (response: Response) => response.text(),
      }),
      invalidatesTags: ["Questions"],
    }),
    deleteQuestion: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),
  }),
});

export const {
  useCreateExamMutation,
  useGetExamQuery,
  useDeleteExamMutation,
  useEditExamMutation,
  useImportQuestionsMutation,
  useGetExamByIdQuery,
  useToggleExamVisibilityMutation,
  useImportQuestionImageMutation,
  useDeleteQuestionMutation,
} = examApi;
