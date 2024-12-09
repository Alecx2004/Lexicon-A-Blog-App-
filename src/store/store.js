import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import postsSlice from "./postSlice";
import commentReducer from "./commentSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    post: postsSlice,
    comments: commentReducer,
  },
});

export default store;
