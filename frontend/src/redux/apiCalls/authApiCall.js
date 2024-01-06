import { toast } from "react-toastify";
import request from "../../utils/request";
import { authAction } from "../slices/authSlice";

//login user 
export function loginUser(user){
    return async(dispatch)=>{
        try {
            const {data} = await request.post("/api/auth/login",user)
            dispatch(authAction.login(data))
            localStorage.setItem("userInfo",JSON.stringify(data))
        } catch (error) {
            toast.error(error.response.data.message)
            console.log(error)
        }
    }
}
//Logout

export function logout(){
    return (dispatch)=>{
        dispatch(authAction.logout())
        localStorage.removeItem("userInfo")
    }
}

//Register user 
export function registerUser(user){
    return async(dispatch)=>{
        try {
            const {data} = await request.post("/api/auth/register",user)
            dispatch(authAction.register(data.message))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}