import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../services/supaBaseClient";
import type { BlogTypes } from "./types";

interface BlogState {
  blogs: BlogTypes[];
}

const initialState: BlogState = {
  blogs: [],
};

//get blog
export const fetchBlogs = createAsyncThunk(
  "blog/fetch",
  async (page: number) => {
    const from = page * 5;
    const to = from + 4;

    const { data, error } = await supabase
      .from("blogDB")
      .select("*", { count: "exact" })
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }
);

//create blog
export const createBlog = createAsyncThunk(
  "blog/create",
  async ({ title, content }: BlogTypes) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("blogDB").insert({
      title,
      content,
      user_id: user?.id,
      user_name: user?.user_metadata.user_name,
    });
    if (error) throw error;
    return data;
  }
);

//update blog
export const updateBlogs = createAsyncThunk(
  "blog/update",
  async ({ id, title, content }: BlogTypes) => {
    const { data, error } = await supabase
      .from("blogDB")
      .update({
        title,
        content,
      })
      .eq("id", id);

    if (error) throw error;
    return data;
  }
);

//delete blog
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
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        if (action.payload) {
          const newBlog = action.payload[0];
          state.blogs = [newBlog, ...state.blogs];
        }
      })
      .addCase(deleteBlogs.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
      });
  },
});

export default blogSlice.reducer;
