import { useEffect } from "react";
import "./admin-table.css";
import AdminSidebar from "./AdminSidebar";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import { deleteProfile, getUsersProfile } from "../../redux/apiCalls/profileApiCall";

const UsersTable = () => {
  const dispatch = useDispatch()
  const {profiles ,isProfileDeleted } = useSelector((state)=>state.profile)

  useEffect(()=>{
    dispatch(getUsersProfile())
  },[isProfileDeleted])
  // Delete User Handler
  const deleteUserHandler = (profileId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteProfile(profileId))
      } 
    });
  };

  return (
    <div className="table-container">
      <AdminSidebar />
      <div className="table-wrapper">
        <h1 className="table-title">Users</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Count</th>
              <th>User</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {profiles?.map((item,index) => (
              <tr key={item}>
                <td>{index+1}</td>
                <td>
                  <div className="table-image">
                    <img
                      src={item?.proileImg?.url}
                      alt=""
                      className="table-user-image"
                    />
                    <span className="table-username">{item?.username}</span>
                  </div>
                </td>
                <td>
                  <b className="user-email">{item?.email}</b>
                </td>
                <td>
                  <div className="table-button-group">
                    <button>
                      <Link to={`/profile/${item?._id}`}>View Profile</Link>
                    </button>
                    <button onClick={()=>deleteUserHandler(item?._id)}>Delete User</button>
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

export default UsersTable;
