import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../redux/apiCalls/authApiCall";

const HeaderRight = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(user?.username);
  const dispatch = useDispatch()
  const [dropDown, setDropDown] = useState(false);

   // Logout Handler
   const logoutHandler = () => {
    setDropDown(false);
    dispatch(logout());
  }


  return (
    <div className="header-right">
      {user ? (
        <>
          <div className="header-right-user-info">
            <span
            onClick={ ()=>setDropDown(prev=>!prev)}
            className="header-right-username">{user?.username}</span>
            <img
              src={user?.proileImg?.url}
              alt="Photo URL"
              className="header-right-user-photo"
            />
           {dropDown&& <div className="header-right-dropdown">
              <Link
                to={`/profile/${user?._id}`}
                className="header-dropdown-item"
              >
                <i className="bi bi-file-person"></i>
                <span>Profile</span>
              </Link>
              <div onClick={logoutHandler} className="header-dropdown-item">
                <i className="bi bi-box-arrow-in-left"></i>
                <span>Logout</span>
              </div>
            </div>}
          </div>
        </>
      ) : (
        <>
          <Link className="header-right-link" to="/login">
            <i className="bi bi-box-arrow-in-right"></i>
            <span>Login</span>
          </Link>
          <Link className="header-right-link" to="/register">
            <i className="bi bi-person-plus"></i>
            <span>Register</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default HeaderRight;
