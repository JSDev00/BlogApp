import PostList from "../../components/posts/PostList";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link } from "react-router-dom";
import "./home.css";
// import { posts } from "../../dummyData";
import{useDispatch, useSelector} from 'react-redux'
import { useEffect } from "react";
import { fetchPosts } from "../../redux/apiCalls/postApiCall";
import { getCategories } from "../../redux/apiCalls/categoryApiCall";
const Home = () => {
  const dispatch = useDispatch()
  const{posts}=useSelector((state)=>state.post);
  const{categories}=useSelector((state)=>state.category);
  useEffect(()=>{
    dispatch(fetchPosts(1))
  dispatch(getCategories())

  },[])
  return (
    <section className="home">
      <div className="home-hearo-header">
        <div className="home-hero-header-layout">
          <h1 className="home-title">Welcome to Blog</h1>
        </div>
      </div>
      <div className="home-latest-post">Latest Posts</div>
      <div className="home-container">
        <PostList posts={posts} />
        <Sidebar categories={categories}/>
      </div>
      <div className="home-see-posts-link">
        <Link className="home-link" to="/posts">
          See All Posts
        </Link>
      </div>
    </section>
  );
};

export default Home;
