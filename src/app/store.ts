import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authUser";
import blogReducer from "../features/blog/blogAction";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
