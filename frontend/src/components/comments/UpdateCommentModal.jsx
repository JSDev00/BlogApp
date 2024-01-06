import "./update-comment-modal.css";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateComments } from "../../redux/apiCalls/commentApiCall";

const UpdateCommentModal = ({ setUpdateComment ,updateForComment}) => {
  const [text, setText] = useState(updateForComment?.text);
  const dispatch = useDispatch()
  // From Submit Handler
  const formSubmitHandler = (e) => {

    e.preventDefault();

    dispatch(updateComments(updateForComment?._id,{text}))
    setUpdateComment(false)
  };

  return (
    <div className="update-comment">
      <ToastContainer theme="colored" />
      <form onSubmit={formSubmitHandler} className="update-comment-form">
        <abbr title="close">
          <i
            onClick={() => setUpdateComment(false)}
            className="bi bi-x-circle-fill update-comment-form-close"
          ></i>
        </abbr>
        <h1 className="update-comment-title">Edit Comment</h1>
        <input
          onChange={(e) => setText(e.target.value)}
          value={text}
          type="text"
          className="update-comment-input"
          placeholder="Update Comment"
        />
        <button type="submit" className="update-comment-btn">
          Edit Comment
        </button>
      </form>
    </div>
  );
};

export default UpdateCommentModal;

