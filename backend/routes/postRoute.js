const router = require("express").Router();
const {
  createNewPost,
  getAllPosts,
  getSinglePost,
  getPostsCount,
  deletePost,
  postCtrlUpdate,
  toggleLike,
  ImageCtrlUpdate,
} = require("../controllers/postCtrl");
const photoUpload = require("../middlewares/photoUpload");
const verifyObjectId = require("../middlewares/verifyObjectId");
const { verifyToken } = require("../middlewares/verifyToken");

// api/posts
router
  .route("/")
  .post(verifyToken, photoUpload.single("image"), createNewPost)
  .get(getAllPosts);
router.route("/count").get(getPostsCount);
router
  .route("/:id")
  .get(verifyObjectId, getSinglePost)
  .delete(verifyObjectId, verifyToken, deletePost)
  .put(verifyObjectId, verifyToken, postCtrlUpdate);

//api/posts/upload-image/:i
router.route('/update-image/:id')
      .put(verifyObjectId,verifyToken,photoUpload.single("image"),ImageCtrlUpdate)

router.route('/likes/:id')
      .put(verifyObjectId, verifyToken,toggleLike)

module.exports = router;
