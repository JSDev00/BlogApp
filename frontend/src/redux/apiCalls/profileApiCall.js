import { toast } from "react-toastify";
import request from "../../utils/request";
import { profileAction } from "../slices/profileSlice";
import { authAction } from "../slices/authSlice";

//profile user 
export function profileUser(userId){
    return async(dispatch)=>{
        try {
            const {data} = await request.get(`/api/users/profile/${userId}`)
            dispatch(profileAction.setProfile(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
//update profile Image 
export function uploadProfilePhoto(newPhoto){
    return async(dispatch,getState)=>{
        try {
            const {data} = await request.post(`/api/users/profile/upload/`,newPhoto,{
                headers:{
                    Authorization : "Bearer " + getState().auth.user.token,
                    "Content-Type" : "multipart/form-data" 
                }
            })
            dispatch(profileAction.setProfilePhoto(data.profilePhoto))
            dispatch(authAction.setProfileUserPhoto(data.profilePhoto))
            toast.success(data.message)
            //modify in the database
            const user = JSON.parse(localStorage.getItem("userInfo"));
            user.proileImg = data?.profilePhoto;
            localStorage.setItem("userInfo",JSON.stringify(user))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
// update profile user
export function updateProfileUser(userId,userData){
    return async(dispatch,getState)=>{
        try {
            
            const {data} = await request.put(`/api/users/profile/${userId}`,userData,{
                headers:{
                    Authorization : "Bearer " + getState().auth.user.token,

                }
            })
            dispatch(profileAction.userUpdateProfile(data))
            dispatch(authAction.setUsername(data.username))
            const user = JSON.parse(localStorage.getItem("userInfo"));
            user.username = data?.username;
            localStorage.setItem("userInfo",JSON.stringify(user))
        } catch (error) {
            console.log(error)
        }
    }
}
//delete profile account
export function deleteProfile(userId){
    return  async(dispatch,getState)=>{
        try {
            dispatch(profileAction.setLoading())
            const {data} = await request.delete(`/api/users/profile/${userId}`,{
                headers:{
                    "Authorization" : "Bearer " + getState().auth.user.token
                }
            })
            dispatch(profileAction.setIsProfileDeleted())
            toast.success(data?.message)
            setTimeout(()=>dispatch(profileAction.clearIsProfileDeleted()),2000)
        } catch (error) {
            toast.error(error.response.data.message)

            dispatch(profileAction.clearLoading())
            
        }
    }
}
//get user count
export function getUserCount(){
    return async(dispatch,getState)=>{
        try {
            const {data} = await request.get(`/api/users/count`,{
                headers:{
                    Authorization: "Bearer " + getState().auth.user.token
                }
            })
            dispatch(profileAction.getUserCount(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
//getusers profile
export function getUsersProfile(){
    return async(dispatch,getState)=>{
        try {
              const {data} = await request.get(`/api/users/profile`,{
                headers:{
                    Authorization:"Bearer " + getState().auth.user.token
                }
              })  
              dispatch(profileAction.getProfiles(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}