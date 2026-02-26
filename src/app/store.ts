import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./features/auth/authSlice";
import testReducer from "./features/test/testSlice";
import { authApi } from "./services/authApi";
import { userApi } from "./services/userApi";
import { examApi } from "./services/examApi";
import { testApi } from "./services/testApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    test: testReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [examApi.reducerPath]: examApi.reducer,
    [testApi.reducerPath]: testApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      examApi.middleware,
      testApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
