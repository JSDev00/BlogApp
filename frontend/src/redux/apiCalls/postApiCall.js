import request from "../../utils/request";
import { toast } from "react-toastify";
import { postAction } from "../slices/postSlice";

//get posts from server
export function fetchPosts(pageNumber) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts?pageNumber=${pageNumber}`);
      dispatch(postAction.setPosts(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//get posts count
export function getPostsCount() {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts/count`);
      dispatch(postAction.setPostCount(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
// Fetch Posts Based On Category
export function fetchPostsBasedOnCategory(category) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts?category=${category}`);
      dispatch(postAction.setPostCat(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
//post created
export function setPostCreated(newPost) {
  return async (dispatch, getState) => {
    dispatch(postAction.setLoading());
    try {
      await request.post(`/api/posts`, newPost, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(postAction.setIsPostCreated());
      setTimeout(() => dispatch(postAction.clearIsPostCreated()), 2000); // 2s
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(postAction.clearLoading());
    }
  };
}
//get a single post
export function getPost(postId){
    return async (dispatch)=>{
        try {
      const { data } = await request.get(`/api/posts/${postId}`);
            dispatch(postAction.setPost(data))
        } catch (error) {
              toast.error(error.response.data.message);
        }
    }
}
//change likes of post

export function setPostLike(postId){
  return async (dispatch,getState)=>{
    try {
      const {data} = await request.put(`/api/posts/likes/${postId}`,{},{
        headers:{
          Authorization : "Bearer " + getState().auth.user.token
        }
      })

      dispatch(postAction.setLike(data))
    } catch (error) {
      toast.error(error.response.data.message);
      
    }
  }
}
//Update Post
export function UpdatePost(newPost,postId){
  return async (dispatch,getState)=>{
    try {
    const {data} =   await request.put(`/api/posts/${postId}`,newPost,{
        headers:{
          Authorization : "Bearer " + getState().auth.user.token
        }
      })

        dispatch(postAction.setPost(data))
    } catch (error) {
      toast.error(error.response.data.message);
      
    }
  }
}
//Upload Image To Server
export function setPostImage(newImage,postId){
  return async (dispatch,getState)=>{
    try {
      await request.put(`/api/posts/update-image/${postId}`,newImage,{
        headers:{
          Authorization : "Bearer " + getState().auth.user.token,
          "Content-Type" :"multipart/form-data"
        }
      })
      toast.success("New post Image Uploaded Succefully");

    } catch (error) {
      toast.error(error.response.data.message);
      
    }
  }
}
//Upload Image To Server
export function deletePost(postId){
  return async (dispatch,getState)=>{
    try {
      const{data}=await request.delete(`/api/posts/${postId}`,{
        headers:{
          Authorization : "Bearer " + getState().auth.user.token,
        }
      })
      dispatch(postAction.deletePost(data?.PostId))
      toast.success("Post Deleted Succesfully");

    } catch (error) {
      toast.error(error.response.data.message);
      
    }
  }
}
//get AllPosts
export function fetchAllPosts() {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts`);
      dispatch(postAction.setPosts(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}