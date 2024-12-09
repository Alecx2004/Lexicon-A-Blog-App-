import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Comments from "../components/Comments";

export default function Post() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      setLoading(true);
      setError(null);
      appwriteService
        .getPost(slug)
        .then((post) => {
          if (post) {
            setPost(post);
          } else {
            navigate("/");
          }
        })
        .catch((err) => {
          console.error("Error fetching post:", err);
          setError("Failed to load post. Please try again later.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  useEffect(() => {
    if (post?.featuredImage) {
      const url = appwriteService.getFilePreview(post.featuredImage);
      setImageUrl(url);
    }
  }, [post?.featuredImage]);

  const deletePost = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);
      appwriteService
        .deletePost(post.$id)
        .then((status) => {
          if (status) {
            appwriteService.deleteFile(post.featuredImage);
            navigate("/all-posts");
          }
        })
        .catch((err) => {
          console.error("Error deleting post:", err);
          alert("Failed to delete post. Please try again.");
        })
        .finally(() => {
          setIsDeleting(false);
        });
    }
  };

  const parseContent = (content) => {
    try {
      if (!content) return "No content available";
      return parse(content);
    } catch (err) {
      console.error("Error parsing content:", err);
      return "Error displaying content";
    }
  };

  if (loading) {
    return (
      <div className="py-8 dark:bg-gray-900">
        <Container>
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 dark:bg-gray-900">
        <Container>
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 text-lg mb-4">
              {error}
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Go Back Home
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return post ? (
    <div className="py-8 dark:bg-gray-900">
      <Container>
        {/* Main content wrapper */}
        <article className="max-w-4xl mx-auto">
          {/* Header Section */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
              <span>By {post.author}</span>
              <span className="mx-2">•</span>
              <span>{new Date(post.$createdAt).toLocaleDateString()}</span>
            </div>
          </header>

          {/* Featured Image Section */}
          <div className="mb-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
            {!imgError && imageUrl ? (
              <div className="relative w-full h-[300px] md:h-[400px]">
                <img
                  src={imageUrl}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full rounded-xl object-cover"
                  onError={(e) => {
                    console.error('Image load error:', {
                      src: e.target.src,
                      error: e.message,
                      postId: post.$id
                    });
                    setImgError(true);
                  }}
                  loading="lazy"
                  decoding="async"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  {imgError ? "Failed to load image" : "No image available"}
                </p>
              </div>
            )}
          </div>

          {/* Author Actions */}
          {isAuthor && (
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to={`/edit-post/${post.$id}`} className="flex-1">
                <Button
                  bgColor="bg-blue-500"
                  className="w-full flex items-center justify-center gap-2 px-6 py-2 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  <FaEdit className="text-lg" />
                  <span>Edit Post</span>
                </Button>
              </Link>
              <Button
                bgColor="bg-red-500"
                onClick={deletePost}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
              >
                <MdDelete className="text-lg" />
                <span>{isDeleting ? "Deleting..." : "Delete Post"}</span>
              </Button>
            </div>
          )}

          {/* Post Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert dark:text-gray-300">
            {parseContent(post.content)}
          </div>
        </article>
      </Container>

      <Comments postId={post.$id} />
    </div>
  ) : null;
}
