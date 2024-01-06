import { categoryAction } from "../slices/categorySlice";
import request from "../../utils/request";
import { toast } from "react-toastify";

//get category
export function getCategories(){
    return async(dispatch)=>{
        try {
            const {data} = await request.get(`/api/category`)
            dispatch(categoryAction.setCategories(data))
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
}

//create category
export function createCategory(newCategory) {
    return async (dispatch,getState) => {
      try {
        const { data } = await request.post("/api/category", newCategory, {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          }
        });
        dispatch(categoryAction.createCategory(data));
        toast.success("category created successfully");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
  }
//delete category
export function deleteCategory(categoryId){
    return async(dispatch,getState)=>{
        try {
            const {data} = await request.delete(`/api/category/${categoryId}`,{
                headers:{
                    "Authorization" : "Bearer " +getState().auth.user.token
                }
            })
            dispatch(categoryAction.deleteCategory(data.categoryId))
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
}