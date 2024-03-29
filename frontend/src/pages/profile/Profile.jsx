import "./profile.css";
import { useEffect, useState } from "react";
import UpdateProfileModal from "./UpdateProfileModal";
import swal from "sweetalert";
import { toast } from "react-toastify";
import {useDispatch , useSelector} from 'react-redux'
import { useParams,useNavigate } from 'react-router-dom';
import { deleteProfile, profileUser, uploadProfilePhoto } from "../../redux/apiCalls/profileApiCall";
import PostItem from "../../components/posts/PostItem";
import { Oval } from "react-loader-spinner";
import { logout } from "../../redux/apiCalls/authApiCall";

const Profile = () => {
  const { id } = useParams();
  const [updateProfile, setUpdateProfile] = useState(false);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch()
  
  const {profile,isProfileDeleted,loading} = useSelector((state)=>state.profile)
  const {user} = useSelector((state)=>state.auth)

  
  useEffect(() => {
    dispatch(profileUser(id))
    window.scrollTo(0, 0);
  }, []);
  
const navigate = useNavigate()

  useEffect(() => {
    if(isProfileDeleted){
      navigate("/")
    }
  }, [navigate,isProfileDeleted]);

  // Form Submit Handler
  const formSubmitHandler = (e) => {
    e.preventDefault();
    if(!file) return toast.warning("there is no file!");
    const formData = new FormData()
    formData.append("image",file)
    dispatch(uploadProfilePhoto(formData))
    console.log("image uploaded");
  }

  // Delete Account Handler
  const deleteAccountHandler = () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover your account!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
       dispatch(deleteProfile(user?._id))
       dispatch(logout());
      } else {
        swal("Something went wrong!");
      }
    });
  }
  if(loading) {
    return (
    <div className="profile-loader">
      <Oval
        height={120}
        width={120}
        color="#000"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor="grey"
        strokeWidth={3}
        strokeWidthSecondary={3}
        />
    </div>
  )}
  return (
    <section className="profile">
      <div className="profile-header">
        <div className="profile-image-wrapper">
          <img src={file ? URL.createObjectURL(file) : profile?.proileImg.url} alt="" className="profile-image" />
          {user?._id === profile?._id && 
          
          <form onSubmit={formSubmitHandler}>
          <abbr title="choose profile photo">
            <label
              htmlFor="file"
              className="bi bi-camera-fill upload-profile-photo-icon"
            ></label>
          </abbr>
            <input
              type="file"
              name="file"
              id="file"
              style={{ display: "none" }}
              onChange={e => setFile(e.target.files[0])}
            />
            <button type="submit" className="upload-profile-photo-btn">upload</button>
          </form>
          }
        



        </div>
        <h1 className="profile-username">{profile?.username}</h1>
        <p className="profile-bio">
          {profile?.bio}
        </p>
        <div className="user-date-joined">
          <strong>Date Joined: </strong>
          <span>{new Date(profile?.createdAt).toDateString()}</span>
        </div>
          {user?._id === profile?._id && 
           <button onClick={() => setUpdateProfile(true)} className="profile-update-btn">
           <i className="bi bi-file-person-fill"></i>
           Update Profile
         </button>
          }
      </div>
      <div className="profile-posts-list">
        <h2 className="profile-posts-list-title">{profile?.username} Posts</h2>
      {
        profile?.posts?.map((post)=>
          <PostItem 
          key={post?._id}
          post={post}
          username={profile?.username}
          userId={profile?._id}
          />
        )
      }
      </div>
      {user?._id === profile?._id && 
          <button onClick={deleteAccountHandler} className="delete-account-btn">
          Delete Your Account
        </button>
      }
      {updateProfile && <UpdateProfileModal profile={profile} setUpdateProfile={setUpdateProfile} />}
    </section>
  );
};

export default Profile;
