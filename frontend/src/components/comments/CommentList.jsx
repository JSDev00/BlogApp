import { useState } from "react";
import "./comment-list.css";
import UpdateCommentModal from "./UpdateCommentModal";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import { deleteComments } from "../../redux/apiCalls/commentApiCall";

const CommentList = ({comments}) => {
  const [updateComment, setUpdateComment] = useState(false);
  const [updateForComment, setUpdateForComment] = useState(null);
  const dispatch = useDispatch()

  //update comment handler

  const updateCommentHandler = (comment) =>{
    setUpdateForComment(comment)
    setUpdateComment(true)
  }


  const {user} = useSelector((state)=>state.auth)
  const { post } = useSelector((state)=>state.post)
  // Delete Comment Handler
  const deleteCommentHandler = (commentId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this comment!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteComments(commentId))
      } else {
        swal("Something went wrong!");
      }
    });
  };

  return (
    <div className="comment-list">
      <h4 className="comment-list-count">{comments?.length} comments</h4>
      {comments?.map((comment) => (
        <div key={comment._id} className="comment-item">
          <div className="comment-item-info">
            <div className="comment-item-user-info">
              <img
                src={user?.proileImg?.url}
                alt=""
                className="comment-item-user-photo"
              />
              <span className="comment-item-username">{comment?.username}</span>
            </div>
            <div className="comment-item-time">{new Date(comment?.createdAt).toISOString()}</div>
          </div>
          <p className="comment-item-text">{comment?.text}</p>
          <div className="comment-item-icon-wrapper">
           {user?._id === comment?.user && (
            <>
             <i
              onClick={() => updateCommentHandler(comment)}
              className="bi bi-pencil-square"
            ></i>
            <i onClick={()=>deleteCommentHandler(comment?._id)} className="bi bi-trash-fill"></i>
            </>
           )}
          </div>
        </div>
      ))}
      {updateComment && (
        <UpdateCommentModal 
        updateForComment={updateForComment}
        setUpdateComment={setUpdateComment} />
      )}
    </div>
  );
};

export default CommentList;
