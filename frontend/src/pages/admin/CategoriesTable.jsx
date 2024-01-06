import { useDispatch, useSelector } from "react-redux";
import "./admin-table.css";
import AdminSidebar from "./AdminSidebar";
import swal from "sweetalert";
import { deleteCategory, getCategories } from "../../redux/apiCalls/categoryApiCall";
import { useEffect } from "react";

const CategoriesTable = () => {
  const dispatch = useDispatch()
  const {categories} = useSelector((state)=>state.category)

  useEffect(()=>{
    dispatch(getCategories())
  },[])

  // Delete Category Handler
  const deleteCategoryHandler = (categoryId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this category!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
      dispatch(deleteCategory(categoryId))
      } else {
        swal("Something went wrong!");
      }
    });
  };

  return (
    <div className="table-container">
      <AdminSidebar />
      <div className="table-wrapper">
        <h1 className="table-title">Categories</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Count</th>
              <th>Category Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((item,index) => (
              <tr key={item}>
                <td>{index+1}</td>
                <td>
                  <b>{item.title}</b>
                </td>
                <td>
                  <div className="table-button-group">
                    <button onClick={()=>deleteCategoryHandler(item?._id)}>
                      Delete Category
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesTable;
