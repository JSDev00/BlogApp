const fs = require("fs");
const path = require("path");
const {
  Post,
  validateCreatePost,
  validateUpdatetePost,
} = require("../models/Post");
const asyncHandler = require("express-async-handler");
const {
  uploadImageToCloudinary,
  removeImageFromCloudinary,
} = require("../utils/ImageUpload");
const {Comment} = require('../models/Comment')
/**
 * @desc craete new post
 * @api api/post/
 * @method POST
 * @access private (only logged in ^-^)
 */
module.exports.createNewPost = asyncHandler(async (req, res) => {
  // 1. validation for image
  if (!req.file) {
    return res.status(400).json({ message: "File Not Found Only Images :(" });
  }
  // 2. validation for data

  const { error } = validateCreatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // 3.Upload Photo
  const ImgPath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await uploadImageToCloudinary(ImgPath);
  // 4.Create new post and save it to DB
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user.id,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });
  await post.save();
  // 5.send res to the client
  res.status(201).json(post);
  // 6.delete img from server
  fs.unlinkSync(ImgPath);
});

/**
 * @desc Get All Posts
 * @api api/posts
 * @method GET
 * @access public
 */

module.exports.getAllPosts = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let posts;
  if (pageNumber) {
    posts = await Post.find()
      .skip((pageNumber - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else if (category) {
    posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else {
    //this meanning it will sort
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  }
  res.status(200).json(posts);
});

/**
 * @desc Get single Post
 * @api api/post/:id
 * @method GET
 * @access public
 */

module.exports.getSinglePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
  .populate("user", ["-password"])
  .populate("comments");
  if (!post) {
    return res.status(200).json({ message: "Post Not Found :)" });
  }
  return res.status(200).json(post);
});

/**
 * @desc Get Posts Count
 * @api api/post/count
 * @method GET
 * @access public
 */

module.exports.getPostsCount = asyncHandler(async (req, res) => {
  const post = await Post.find().countDocuments();
  if (!post) {
    return res.status(200).json({ message: "Post Not Found :)" });
  }
  return res.status(200).json(post);
});

/**
 * @desc Delete Post
 * @api api/post/:id
 * @method POST
 * @access private (Only user himself or Admin)
 */

module.exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(200).json({ message: "Post Not Found :)" });
  }
  if (req.user.isAdmin || req.user.id === post.user.toString()) {
    await Post.findByIdAndDelete(req.params.id);
    await removeImageFromCloudinary(post.image.publicId);
    // TODO Delete all comment that post has it
    await Comment.deleteMany({PostId:post._id})
    res.status(200).json({ 
    message: "Post Has benn delted :)",
    PostId:post._id
   });
  } else {
    res.status(403).json({ message: "Access Denied" });
  }
});

/**
 * @desc Update Post
 * @api api/posts/:id
 * @method PUT
 * @access private (Only user himself)
 */
module.exports.postCtrlUpdate = (async (req, res) => {
  const{error} = validateUpdatetePost(req.body);
  if(error){
    return res.status(400).json({message:error.details[0].message})
  }
  const post = await Post.findById(req.params.id)
  if(!post){
    return res.status(404).json({message:"Post Not Found :)"});
  }
  if(req.user.id !== post.user.toString()){
    return res.status(400).json({message:"access Denied"})
  }
try {
  const updatePost = await Post.findByIdAndUpdate(req.params.id,{
    $set:{
      title:req.body.title,
      description:req.body.description,
      category:req.body.category,
    }
  },{new:true})
  res.status(200).json(updatePost)
} catch (error) {
  console.log(error)
  return res.status(500).json(error)
}
  
});

/**
 * @desc Update Post Image
 * @api api/posts/:id
 * @method PUT
 * @access private (Only user himself)
 */
module.exports.ImageCtrlUpdate = asyncHandler (async (req, res) => {
  //Get The File
  console.log(req.file)
  if(!req.file){
    return res.status(400).json({message:"no Image Provided"})
  }
  //Get The Post
  const post = await Post.findById(req.params.id)
  if(!post){
    return res.status(404).json({message:"Post Not Found :)"});
  }
  //check if the post belong to user
  if(req.user.id !== post.user.toString()){
    return res.status(400).json({message:"access Denied"})
  }
  // Delete Image From Cloudinary
  await removeImageFromCloudinary(post.image.publicId)
  
  // Upload new photo
  const imgPath = path.join(__dirname,`../images/${req.file.filename}`)

  const result = await uploadImageToCloudinary(imgPath)

  //Update Image Field From DB
  const updatePost = await Post.findByIdAndUpdate(req.params.id,{
    $set:{
      image:{
        url:result.secure_url,
        publicId:result.public_id,
      }
    }
  },{new:true})
  //send response to client
  res.status(200).json(updatePost)
  //remove image
  fs.unlinkSync(imgPath)
});
/**
 * @desc Like Post
 * @api api/posts/likes/:id
 * @method PUT
 * @access private (Only Logged IN)
 */
  module.exports.toggleLike = asyncHandler(async (req, res) => {
    const loggedIn = req.user.id;
    const { id: postId } = req.params;
    console.log(postId);
    let post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ messgae: "Post Not Found" });
    }

    const isPostAlreadyLike = post.likes.find(
      (user) => user.toString() === loggedIn
    );
    if (isPostAlreadyLike) {
      post = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: loggedIn },
        },
        { new: true }
      );
    } else {
      post = await Post.findByIdAndUpdate(
        postId,
        {
          $push: { likes: loggedIn },
        },
        { new: true }
      );
    }
    res.status(200).json(post);
  });
