import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TestQuestion } from "../../services/testApi";

type AnswerMap = Record<number, number>;

type TestSession = {
  testId: number | null;
  startTime: string | null;
  durationMinutes: number | null;
};

type TestState = {
  questions: TestQuestion[];
  currentIndex: number;
  answers: AnswerMap;
  session: TestSession;
};

const initialState: TestState = {
  questions: [],
  currentIndex: 0,
  answers: {},
  session: {
    testId: null,
    startTime: null,
    durationMinutes: null,
  },
};

const buildInitialAnswers = (questions: TestQuestion[]): AnswerMap => {
  const map: AnswerMap = {};
  for (const q of questions) {
    map[q.id] = -1;
  }
  return map;
};

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<TestQuestion[]>) => {
      state.questions = action.payload;
      state.currentIndex = 0;
      state.answers = buildInitialAnswers(action.payload);
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      const next = action.payload;
      if (next < 0 || next >= state.questions.length) return;
      state.currentIndex = next;
    },
    nextQuestion: (state) => {
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex += 1;
      }
    },
    prevQuestion: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      }
    },
    selectOption: (
      state,
      action: PayloadAction<{ questionId: number; optionIndex: number }>,
    ) => {
      state.answers[action.payload.questionId] = action.payload.optionIndex;
    },
    setSession: (
      state,
      action: PayloadAction<{
        testId: number;
        startTime: string;
        durationMinutes: number;
      }>,
    ) => {
      state.session = {
        testId: action.payload.testId,
        startTime: action.payload.startTime,
        durationMinutes: action.payload.durationMinutes,
      };
    },
    resetTest: () => initialState,
  },
});

export const {
  setQuestions,
  setCurrentIndex,
  nextQuestion,
  prevQuestion,
  selectOption,
  setSession,
  resetTest,
} = testSlice.actions;

export default testSlice.reducer;
