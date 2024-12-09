import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postsService from "../appwrite/config";

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

export const fetchPost = createAsyncThunk(
  "posts/fetchPosts",
  async (_, thunkAPI) => {
    try {
      const response = await postsService.getPosts();
      return response.documents;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPosts",
  async (postData, thunkAPI) => {
    try {
      const response = await postsService.createPost(postData);
      return response; // Return the single document directly
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const postsSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })

      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.posts.push(action.payload);
        }
      })

      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = postsSlice.actions;

export default postsSlice.reducer;
