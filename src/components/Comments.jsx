/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  addComment,
  deleteComment,
  selectAllComments,
  selectCommentStatus,
} from "../store/commentSlice";
import authService from "../appwrite/auth";
import { FaTrash } from "react-icons/fa";

const CommentForm = ({ postId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;

      await dispatch(
        addComment({
          postId,
          userId: user.$id,
          author: user.name,
          content: data.comment,
        })
      ).unwrap();

      // Reset form after successful submission
      reset();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
      <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <textarea
          {...register("comment", {
            required: "Comment is required",
            minLength: {
              value: 3,
              message: "Comment must be at least 3 characters long",
            },
            maxLength: {
              value: 500,
              message: "Comment cannot exceed 500 characters",
            },
          })}
          rows="3"
          className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
          placeholder="Write a comment..."
        />
      </div>
      {errors.comment && (
        <p className="text-red-500 text-sm mb-2">{errors.comment.message}</p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800 disabled:opacity-50"
      >
        {isSubmitting ? "Posting..." : "Post comment"}
      </button>
    </form>
  );
};

const CommentList = ({ comments, onDelete, currentUserId }) => {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.$id}
          className="p-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                {comment.author}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(comment.$createdAt).toLocaleDateString()}
              </p>
            </div>
            {onDelete && currentUserId === comment.userId && (
              <button
                onClick={() => onDelete(comment.$id)}
                className="text-gray-400 hover:text-red-500"
              >
                <FaTrash size={14} />
              </button>
            )}
          </div>
          <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

const Comments = ({ postId }) => {
  const dispatch = useDispatch();
  const comments = useSelector(selectAllComments) || [];
  const status = useSelector(selectCommentStatus) || 'idle';
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (postId) {
      dispatch(fetchComments(postId));
    }
  }, [dispatch, postId]);

  const handleDeleteComment = async (commentId) => {
    try {
      await dispatch(deleteComment(commentId)).unwrap();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  if (status === "loading") {
    return <div className="text-center">Loading comments...</div>;
  }

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
            Comments ({comments.length})
          </h2>
        </div>
        {currentUser && <CommentForm postId={postId} />}
        {comments.length > 0 ? (
          <CommentList
            comments={comments}
            onDelete={currentUser ? handleDeleteComment : undefined}
            currentUserId={currentUser?.$id}
          />
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default Comments;