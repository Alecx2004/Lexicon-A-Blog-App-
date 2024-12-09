import { useState, useEffect } from "react";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import About from "./About"
import Contact from "./Contact"
import Image from "../assets/Blog Landing page.png"
import styles from './Home.module.css'

function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    appwriteService.getPosts().then((post) => {
      if (post) {
        setPosts(post.documents);
      }
    });
  }, []);

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full flex flex-col md:flex-row justify-around items-center gap-8">
              <div className={`max-w-2xl ${styles.fadeInRight}`}>
                <h1 className="text-4xl md:text-6xl font-bold mb-8 text-blue-800">
                  Ignite Your Mind One Insight at a Time!
                </h1>
                <h5 className={`text-xl font-medium text-sky-600 ${styles.fadeInRight} ${styles.delaySmall}`}>
                  Fuel Your Curiosity, Enrich Your Mind, Elevate Your Day
                </h5>
                <Link to="/signup">
                  <Button className={`mt-8 md:mt-20 text-xl ${styles.fadeInUp} ${styles.delayMedium}`}>
                    Get Started
                  </Button>
                </Link>
              </div>
              <div className={`max-w-lg ${styles.fadeInLeft} ${styles.delaySmall}`}>
                <img 
                  src={Image} 
                  alt="Blog Landing" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
          <div className={styles.fadeInUp}>
            <About/>
          </div>
          <div className={`${styles.fadeInUp} ${styles.delayLarge}`}>
            <Contact/>
          </div>
        </Container>
      </div>
    );
  }
  return navigate("/all-posts");
}

export default Home;
