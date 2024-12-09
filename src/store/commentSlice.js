import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import commentService from "../appwrite/comment";

// Async thunks
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId) => {
    const response = await commentService.getComments(postId);
    return response.documents;
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ postId, userId, content, author }) => {
    const response = await commentService.createComment({
      postId,
      userId,
      content,
      author,
    });
    return response;
  }
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ commentId, content }) => {
    const response = await commentService.updateComment(commentId, { content });
    return response;
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId) => {
    await commentService.deleteComment(commentId);
    return commentId;
  }
);

const initialState = {
  comments: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Comments
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      // Update Comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (comment) => comment.$id === action.payload.$id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment.$id !== action.payload
        );
      });
  },
});

export const { clearComments } = commentSlice.actions;

export const selectAllComments = (state) => state.comments.comments;
export const selectCommentStatus = (state) => state.comments.status;
export const selectCommentError = (state) => state.comments.error;

export default commentSlice.reducer;