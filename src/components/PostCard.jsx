/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";
import LikeBtn from "../components/LikeBtn";
import { FaCommentAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { fetchComments } from "../store/commentSlice";
import { FaUserCircle } from "react-icons/fa";
import conf from '../appwrite/config';

function PostCard({
  $id,
  title,
  featuredImage,
  content,
  author,
  $createdAt,
  likes = 0,
  likedBy = [],
}) {
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postData, setPostData] = useState({ likes, likedBy });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchComments($id));
  }, [$id, dispatch]);

  useEffect(() => {
    if (featuredImage) {
      try {
        const imgUrl = appwriteService.getFileUrl(featuredImage);
        setImg(imgUrl);
      } catch (err) {
        try {
          // Fallback to direct URL construction
          const fallbackUrl = `${conf.appwriteUrl}/storage/buckets/${conf.appwriteBucketId}/files/${featuredImage}/view?project=${conf.appwriteProjectId}`;
          setImg(fallbackUrl);
        } catch (viewErr) {
          console.error("🚨 Image Loading Failed:", {
            fileId: featuredImage,
            previewError: err,
            viewError: viewErr
          });
          setError("Failed to load image");
        }
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [featuredImage]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const post = await appwriteService.getPost($id);
        if (post) {
          setPostData({
            likes: post.likes || 0,
            likedBy: post.likedBy || [],
          });
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchPostData();
  }, [$id]);

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Link to={`/post/${$id}`}>
        <div className="w-full bg-white dark:bg-gray-800 rounded-t-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
                <span className="text-2xl"> < FaUserCircle /> </span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {author}
              </span>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {formatDate($createdAt)}
              </span>
            </div>
          </div>

          <div className="w-full justify-center mt-4">
            {loading ? (
              <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-48 rounded-xl" />
            ) : error ? (
              <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400">
                Failed to load image
              </div>
            ) : (
              <img
                src={img}
                alt={title}
                className="w-full h-48 object-cover rounded-xl"
                onError={() => {
                  console.error('🚨 PostCard Image Load Error:', {
                    src: img,
                    fileId: featuredImage
                  });
                  setError("Failed to load image");
                }}
                crossOrigin="anonymous"
                loading="lazy"
              />
            )}
          </div>

          <h2 className="text-xl font-bold dark:text-white mb-2 text-gray-800">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {truncateText(content || "")}
          </p>
        </div>
      </Link>
      <hr />
      <div className="flex items-center p-4">
        <LikeBtn
          post={{ $id, likes: postData.likes, likedBy: postData.likedBy }}
          onLikeUpdate={(updatedPost) => setPostData(updatedPost)}
        />
        <Link
          to={`/post/${$id}`}
          className="text-gray-600 dark:text-gray-400 ml-4 flex items-center gap-1 text-xl"
        >
          <FaCommentAlt /> Comments
        </Link>
      </div>
    </>
  );
}

export default PostCard;
