import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../services/supaBaseClient";
import type { UserTypes } from "./types";

interface AuthState {
  user: unknown | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
};

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, username, password }: UserTypes) => {
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
    if (!data.user) throw new Error("User not created");

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ id: data.user.id, email, username });
    if (profileError) throw profileError;

    return data.user;
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: UserTypes) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw console.error("error");

    return data.user;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await supabase.auth.signOut();
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
      });
  },
});

export default authSlice.reducer;
