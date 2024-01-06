import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PostList from "../../components/posts/PostList";
import "./category.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsBasedOnCategory } from "../../redux/apiCalls/postApiCall";

const Category = () => {
  const dispatch = useDispatch()
  const{postCat}=useSelector((state)=>state.post);
    const { category } = useParams();

    useEffect(() => {
      dispatch(fetchPostsBasedOnCategory(category))
      window.scrollTo(0,0);
    }, []);

    return ( 
      <section className="category">
      {postCat.length === 0 ? (
        <>
          <h1 className="category-not-found">
            Posts with <span>{category}</span> category not found
          </h1>
          <Link to="/posts" className="category-not-found-link">
            Go to posts page
          </Link>
        </>
      ) : (
        <>
          <h1 className="category-title">Posts based on {category}</h1>
          <PostList posts={postCat} />
        </>
      )}
    </section>);
}
 
export default Category;