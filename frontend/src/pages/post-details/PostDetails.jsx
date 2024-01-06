import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AddComment from "../../components/comments/AddComment";
import CommentList from "../../components/comments/CommentList";
import "./post-details.css";
import UpdatePostModal from "./UpdatePostModal";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, getPost, setPostImage, setPostLike } from "../../redux/apiCalls/postApiCall";
import { getCategories } from "../../redux/apiCalls/categoryApiCall";

const PostDetails = () => {
  const { id } = useParams();
  const [updatePost, setUpdatePost] = useState(false);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch()
  const {user} = useSelector((state)=>state.auth)
  const { post } = useSelector((state)=>state.post)
const navigate = useNavigate()
  useEffect(() => {
    dispatch(getPost(id))
    window.scrollTo(0, 0);
  }, [id]);

  // Update Image Submit Handler
  const updateImageSubmitHandler = (e) => {
    e.preventDefault();
    if(!file) return toast.warning("there is no file!");
    const formData = new FormData()
    formData.append("image",file)
    dispatch(setPostImage(formData,post?._id))
  }

  // Delete Post Handler
  const deletePostHandler = () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this post!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deletePost(post?._id))
        navigate(`/profile/${user?._id}`)
      } 
    });
  };

  return (
    <div className="post-details">
      <div className="post-details-image-wrapper">
        <img src={file ? URL.createObjectURL(file) : post?.image.url} alt="" className="post-details-image" />
       {user?._id === post?.user?._id && (
         <form onSubmit={updateImageSubmitHandler} className="update-post-image-form">
         <label className="update-post-image" htmlFor="file">
           <i className="bi bi-image-fill"></i> select new image
         </label>
         <input
           style={{ display: "none" }}
           type="file"
           name="file"
           id="file"
           onChange={e => setFile(e.target.files[0])}
         />
         <button type="submit">upload</button>
       </form>
       )}
      </div>
      <h1 className="post-details-title">{post?.title}</h1>
      <div className="post-details-user-info">
        <img src={post?.user?.image} alt="" className="post-details-user-image" />
        <div className="post-details-user">
          <strong>
            <Link to={`/profile/${user?._id}`}>{post?.user?.username}</Link>
          </strong>
          <span>{post?.createdAt}</span>
        </div>
      </div>
      <p className="post-details-description">
        {post?.description} 
      </p>
      <div className="post-details-icon-wrapper">
        <div>
          {user && (
          <i 
          onClick={()=>dispatch(setPostLike(post?._id))}
          className={post?.likes.includes(user?._id)
            ?"bi bi-hand-thumbs-up-fill"
            :"bi bi-hand-thumbs-up"}></i>

          )}
          <small> {post?.likes.length} likes</small>
        </div>
       {user?._id === post?.user?._id && (
         <div>
         <i
           onClick={() => setUpdatePost(true)}
           className="bi bi-pencil-square"
         ></i>
         <i onClick={deletePostHandler} className="bi bi-trash-fill"></i>
       </div>
       )}
      </div>
      {user?<AddComment post={post}/>:<p className="post-details-info-write">You Must Login to Write a comment</p>}
      <CommentList comments={post?.comments} />
      {updatePost && (
        <UpdatePostModal post={post} setUpdatePost={setUpdatePost} />
      )}
    </div>
  );
};

export default PostDetails;
