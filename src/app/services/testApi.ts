import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/auth/authSlice";
import type { RootState } from "../store";

export interface MyExam {
  id?: number;
  title?: string;
  subject?: string;
  durationMinutes?: number;
  className?: string;
  language?: string;
  maxScore?: number;
  passingScore?: number;
  startTime?: string;
  endTime?: string;
  status?: string;
}

export interface StartExamResponse {
  id: number;
  userId: number;
  examId: number;
  startTime: string;
  durationMinutes: number;
  status: string;
}

export type TestOption = string | { id: number; text: string };

export interface TestQuestion {
  id: number;
  text: string;
  imageUrl?: string | null;
  options?: TestOption[];
  points?: number;
}

export interface TestTimerResponse {
  remainingSeconds: number;
  endTime: string;
}

export type SubmitAnswersPayload = Record<number, number>;

export interface SubmitTestResult {
  correctAnswers: number;
  totalQuestions: number;
  totalScore: number;
  maxPossibleScore: number;
  passed: boolean;
}

export interface StudentPracticalWork {
  id: number;
  questionText: string;
  maxScore: number;
  attachmentUrl?: string | null;
}

export interface PracticalWorkSolution {
  practicalWorkId: number;
  solutionText: string;
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

export const testApi = createApi({
  reducerPath: "testApi",
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
      api.dispatch(logout());
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:logout"));
      }
    }
    return result;
  },
  tagTypes: ["MyExams"],
  endpoints: (builder) => ({
    getMyExams: builder.query<MyExam[], void>({
      query: () => ({
        url: "/tests/my-exams",
        method: "GET",
      }),
      providesTags: ["MyExams"],
    }),
    startExam: builder.mutation<StartExamResponse, number>({
      query: (examId) => ({
        url: `/tests/start/${examId}`,
        method: "POST",
      }),
    }),
    getTestQuestions: builder.query<TestQuestion[], number>({
      query: (examId) => ({
        url: `/tests/${examId}/questions`,
        method: "GET",
      }),
    }),
    getTestTimer: builder.query<TestTimerResponse, number>({
      query: (examId) => ({
        url: `/tests/${examId}/timer`,
        method: "GET",
      }),
    }),
    submitTestAnswers: builder.mutation<
      SubmitTestResult,
      { testId: number; body: SubmitAnswersPayload }
    >({
      query: ({ testId, body }) => ({
        url: `/tests/${testId}/submit`,
        method: "POST",
        body,
      }),
    }),
    getPracticalWorks: builder.query<StudentPracticalWork[], number>({
      query: (testId) => `/tests/${testId}/practical-work`,
    }),
    submitPracticalWork: builder.mutation<void, PracticalWorkSolution[]>({
      query: (body) => ({
        url: `/practical-work/submit`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetMyExamsQuery,
  useStartExamMutation,
  useGetTestQuestionsQuery,
  useGetTestTimerQuery,
  useSubmitTestAnswersMutation,
  useGetPracticalWorksQuery,
  useSubmitPracticalWorkMutation,
} = testApi;
