import { useState } from "react";
import { toast } from "react-toastify";
import "./add-comment.css";
import {useDispatch } from 'react-redux'
import { setComments } from "../../redux/apiCalls/commentApiCall";
const AddComment = ({post}) => {

 const [text, setText] = useState("");
  const dispatch = useDispatch()
  // Form Submit Handler
  const formSubmitHandler = (e) => {
    e.preventDefault();
    if(text.trim() === "") return toast.error("Please write something")

    dispatch(setComments({text,PostId:post._id}))
    setText("");
  }

  return (
    <form onSubmit={formSubmitHandler} className="add-comment">
      <input
        type="text"
        placeholder="Add a comment"
        className="add-comment-input"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button type="submit" className="add-comment-btn">
        Comment
      </button>
    </form>
  );
};

export default AddComment;
