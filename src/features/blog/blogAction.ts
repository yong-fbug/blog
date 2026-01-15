import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { BlogTypes } from "./types";
import { supabase } from "../../services/supaBaseClient";

interface BlogState {
  blogs: BlogTypes[];
}

const initialState: BlogState = {
  blogs: [],
};

export const createBlog = createAsyncThunk(
  "blog/crete",
  async ({ title, content }: BlogTypes) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("blogDB").insert({
      title,
      content,
      user_id: user?.id,
      user_name: user?.user_metadata.username,
    });
    if (error) throw error;
    return data;
  }
);

export const fetchBlogs = createAsyncThunk(
  "blog/fetch",
  async (page: number) => {
    const from = page * 5;
    const to = from + 4;

    const { data, error } = await supabase
      .from("blogDB")
      .select("*")
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }
);

export const updateBlogs = createAsyncThunk(
  "blog/update",
  async ({ id, title, content }: BlogTypes) => {
    const { data, error } = await supabase
      .from("blogDB")
      .update({ title, content })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  }
);

export const deleteBlogs = createAsyncThunk(
  "blog/delete",
  async (id: number) => {
    const { error } = await supabase.from("blogDB").delete().eq("id", id);

    if (error) throw error;
    return id;
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBlog.fulfilled, (state, action) => {
        if (action.payload) {
          const newBlog = action.payload[0];
          state.blogs = [newBlog, ...state.blogs];
        }
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
      })
      .addCase(deleteBlogs.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
      });
  },
});

export default blogSlice.reducer;
