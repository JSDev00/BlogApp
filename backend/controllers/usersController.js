const asyncHandler = require("express-async-handler");
const { User, ValidateUpdateUser } = require("../models/User");
const bcrypt = require("bcrypt");
const path = require("path");
const {
  uploadImageToCloudinary,
  removeImageFromCloudinary,
  removeMultipleImagesFromCloudinary,
} = require("../utils/ImageUpload");
const fs = require("fs");
const { Comment } = require("../models/Comment");
const { Post } = require("../models/Post");
/**
 * @desc getUsersProfile
 * @route api/users/profile
 * @method GET
 * @access private (only admins)
 */
module.exports.getUsersProfile = asyncHandler(async (req, res) => {
  const users = await User.find();
  return res.status(200).json(users);
});
/**
 * @desc getUserProfile
 * @route api/user/profile/:id
 * @method GET
 * @access public
 */
module.exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("posts");
  if (!user) return res.status(404).json({ message: "User Not Found :)" });
  res.status(200).json(user);
});
/**
 * @desc update User Profile
 * @route api/user/profile/:id
 * @method PUT
 * @access private only user himself
 */
module.exports.updateUserProfile = asyncHandler(async (req, res) => {
  //validtion
  const { error } = ValidateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  //check if the password update
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  const updateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    { new: true }
  ).select("-password").populate("posts")
  //send succefyllu message
  res.status(200).json(updateUser);
});
/**
 * @desc getUsersCount
 * @route api/users/profile
 * @method GET
 * @access private (only admins)
 */
module.exports.getUsersCount = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  return res.status(200).json(count);
});
/**
 * @desc UploadImage
 * @route api/users/profile/upload-image-profile
 * @method POST
 * @access private (only Logged in of course VerifyToken we will useIt)
 */
module.exports.uploadPhotoProfile = asyncHandler(async (req, res) => {
  //1.validtion
  if (!req.file) {
    return res.status(400).json({ message: "Not Image Provided :(" });
  }

  //2.get the path of the  Image
  const ImgPath = path.join(__dirname, `../images/${req.file.filename}`);

  //3.Uploa Image to cloudinary
  const result = await uploadImageToCloudinary(ImgPath);

  //4.Get User From Db
  const user = await User.findById(req.user.id);

  //5. Delete the old profile photo if exists
  if (user.proileImg.publicId !== null) {
    await removeImageFromCloudinary(user.proileImg.publicId);
  }
  //6.change the profile photo in DB
  user.proileImg = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save();
  // 7.send response to client
  res.status(200).json({
    message: "Image Uploaded Succefully :)",
    profilePhoto: { url: result.secure_url, publicId: result.public_id },
  });
  // 8.Remove Image from Image folder (server)
  fs.unlinkSync(ImgPath);
});
/**
 * @desc delete user
 * @api api/user/profile/:id
 * @method DELETE
 * @access private (only admins and users)
 */

module.exports.deleteUser = asyncHandler(async (req, res) => {
  //1. Get User From DataBase
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User Not Found:)" });
  }
  const posts = await Post.find({ user: user._id });
  
  const publicIds = posts?.map((post) => post.image.publicId);
  //2.Delete Image From cloudinary
  if (publicIds?.length > 0) {
    await removeMultipleImagesFromCloudinary(publicIds);
  }
  if(user.proileImg.publicId !== null){
    await removeImageFromCloudinary(user.proileImg.publicId);
  }
  // @TODO
  // @TODO
  await Comment.deleteMany({ user: user._id });
  await Post.deleteMany({ user: user._id });
  //3. delete user himself
  await User.findByIdAndDelete(req.params.id);
  //4. send message
  res.status(200).json({ message: "User Delete Succefuly" });
});
