import { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { useSelector } from "react-redux";
import { Query } from "appwrite";
import conf from "../conf/conf.js";
import { FaEnvelope, FaPencilAlt, FaUserCircle } from "react-icons/fa";
import parse from "html-react-parser";
import authService from "../appwrite/auth";

function UserProfile() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Fetch posts after getting user data
          const response = await appwriteService.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            [
              Query.equal("userId", currentUser.$id),
              Query.orderDesc("$createdAt"),
            ]
          );
          if (response.documents) {
            setPosts(response.documents);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Update user state when userData changes in Redux
  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  const parseContent = (content) => {
    if (!content) return "";
    try {
      const parsedContent = parse(content);
      return typeof parsedContent === "string"
        ? parsedContent
        : parsedContent.props?.children || "";
    } catch (err) {
      console.error("Error parsing content:", err);
      return "";
    }
  };

  if (loading || !user) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <div className="fixed inset-0 flex items-center justify-center bg-white/75 dark:bg-black/75">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-col items-center">
          {/* User Info Card */}
          <div className="w-4/5 mb-8">
            <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative">
              <div className="w-full">
                <div className=" w-full rounded-lg bg-gradient-to-r from-gray-600 to-gray-100 flex justify-center text-9xl">
                  <FaUserCircle />
                </div>
                <h1 className="text-3xl font-bold mb-2 dark:text-white text-center">
                  {user.name}
                </h1>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                  <FaEnvelope className="text-xl" />
                  <span>{user.email}</span>
                </div>

                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                  <FaPencilAlt className="text-xl" />
                  <span>Posts Created: {posts.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="w-full ">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 dark:text-white flex  items-center">
                <FaUserCircle className="mr-2 text-gray-500" />
                Your Posts
              </h2>

              {posts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    You haven&apos;t created any posts yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.$id}
                      className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200"
                    >
                      <PostCard
                        $id={post.$id}
                        title={post.title}
                        featuredImage={post.featuredImage}
                        author={post.author}
                        content={parseContent(post.content)}
                        $createdAt={post.$createdAt}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default UserProfile;
