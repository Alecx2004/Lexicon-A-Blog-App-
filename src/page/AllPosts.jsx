import { useEffect } from "react";
import { Container, PostCard } from "../components";
import { fetchPost } from "../store/postSlice";
import { useSelector, useDispatch } from "react-redux";
import parse from "html-react-parser";

function AllPosts() {
  const dispatch = useDispatch();
  const { loading, posts = [], error } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchPost());
  }, [dispatch]);

  const parseContent = (content) => {
    if (!content) return '';
    try {
      const parsedContent = parse(content);
      return typeof parsedContent === 'string' 
        ? parsedContent 
        : parsedContent.props?.children || '';
    } catch (err) {
      console.error('Error parsing content:', err);
      return '';
    }
  };

  return (
    <div className="w-full h-full py-8 dark:bg-gray-900">
      <Container>
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white/75 dark:bg-black/75">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {error && (
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
          </div>
        )}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400 text-lg">
            No posts found! Be the first to create one.
          </div>
        )}
        <div className="max-w-3xl mx-auto space-y-8">
          {Array.isArray(posts) && posts.map((post) => (
            post && post.$id ? (
              <div key={post.$id} className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <PostCard
                  $id={post.$id}
                  title={post.title}
                  featuredImage={post.featuredImage}
                  author={post.author}
                  content={parseContent(post.content)}
                  $createdAt={post.$createdAt}
                />
              </div>
            ) : null
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
