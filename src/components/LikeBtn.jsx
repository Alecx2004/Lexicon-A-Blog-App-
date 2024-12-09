/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import authService from "../appwrite/auth";
import postService from "../appwrite/config";
import conf from "../conf/conf";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const LikeBtn = ({ post, onLikeUpdate }) => {
  const [likeCount, setLikeCount] = useState(post?.likes || 0);
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setUserId(user.$id);
        setLiked(post?.likedBy?.includes(user.$id) || false);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUser();
  }, [post?.likedBy]);

  useEffect(() => {
    setLikeCount(post?.likes || 0);
  }, [post?.likes]);

  const handlelike = async () => {
    if (liked) return;

    try {
      const newLikeCount = likeCount + 1;
      const newLikedBy = [...(post.likedBy || []), userId];

      setLikeCount(newLikeCount);
      setLiked(true);

      // Update the post in the database
      await postService.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        post.$id,
        {
          likes: newLikeCount,
          likedBy: newLikedBy,
        }
      );

      // Notify parent component of the update
      onLikeUpdate?.({
        likes: newLikeCount,
        likedBy: newLikedBy,
      });
    } catch (error) {
      // Revert the UI changes if the update fails
      setLikeCount((prevLikes) => prevLikes - 1);
      setLiked(false);
      console.error("Error Updating likes", error);
    }
  };

  return (
    <div>
      <button
        onClick={handlelike}
        disabled={liked || !userId}
        className="flex items-center gap-2 font-semibold"
      >
        {liked ? (
          <FaHeart className="text-red-500 text-3xl" />
        ) : (
          <FaRegHeart className="text-red-500 text-3xl" />
        )}{" "}
        {likeCount} like
      </button>
    </div>
  );
};

export default LikeBtn;
