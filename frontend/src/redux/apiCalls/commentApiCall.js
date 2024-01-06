import { toast } from "react-toastify";
import request from "../../utils/request";
import { postAction } from "../slices/postSlice";
import { commentAction } from "../slices/commentSlice";

//create Comments
export function setComments(comment){
    return async(dispatch,getState)=>{
        try {
            const {data} = await request.post(`/api/comments/`,comment,{
                headers:{
                  Authorization: "Bearer " + getState().auth.user.token,

                }
            })
            dispatch(postAction.setComment(data))
        } catch (error) {
            toast.error(error.response.data.message)

        }
    }
}
//update Comment
export function updateComments(commentId,comment){
    return async(dispatch,getState)=>{
        try {
            const {data} = await request.put(`/api/comments/${commentId}`,comment,{
                headers:{
                  Authorization: "Bearer " + getState().auth.user.token,

                }
            })
            dispatch(postAction.updateCommentPost(data))
        } catch (error) {
            toast.error(error.response.data.message)

        }
    }
}
//get Comment
export function getComments(){
    return async(dispatch,getState)=>{
        try {
            const {data} = await request.get(`/api/comments/`,{
                headers:{
                  Authorization: "Bearer " + getState().auth.user.token,

                }
            })
            dispatch(commentAction.setComments(data))
        } catch (error) {
            toast.error(error.response.data.message)

        }
    }
}
//delete Comment
export function deleteComments(commentId){
    return async(dispatch,getState)=>{
        try {
            await request.delete(`/api/comments/${commentId}`,{
                headers:{
                  Authorization: "Bearer " + getState().auth.user.token,

                }
            })
            dispatch(commentAction.deleteComments(commentId))
            dispatch(postAction.deleteCommentPost(commentId))
        } catch (error) {
            console.log(error)
            // toast.error(error.response.data.message)

        }
    }
}