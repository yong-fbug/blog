import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { UserTypes } from "./types";
import { supabase } from "../../services/supaBaseClient";

interface AuthState {
  user: unknown | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
};

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password, username }: UserTypes) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_name: username,
        },
      },
    });
    if (error) throw error;
    return data;
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: UserTypes) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await supabase.auth.signOut();
});

export const getSession = createAsyncThunk("auth/getSession", async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.user = action.payload?.user ?? null;
      });
  },
});

export default authSlice.reducer;
