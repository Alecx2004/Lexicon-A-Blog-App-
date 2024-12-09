import { useEffect, useState } from "react";
import appwriteSevice from "../appwrite/config";
import { Container, PostForm } from "../components";
import { useNavigate, useParams } from "react-router-dom";

function EditPost() {
  const [post, setPosts] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      appwriteSevice.getPost(slug).then((post) => {
        if (post) {
          setPosts(post);
        }
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  return post ? (
    <div className="w-full min-h-screen py-8 px-4 md:px-6 lg:px-8">
      <Container>
        <div className="max-w-5xl mx-auto">
          <PostForm {...post} />
        </div>
      </Container>
    </div>
  ) : null;
}

export default EditPost;
