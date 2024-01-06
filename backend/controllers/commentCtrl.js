const asyncHandler = require("express-async-handler");
const { Comment, ValidateCraeteComment, ValidateUpdateComment } = require("../models/Comment");
const { User } = require("../models/User");

/**
 * @desc Create Comment
 * @api api/comments
 * @method POST
 * @access private (Onlu LoggedIn User)
 */
module.exports.createCommentCtrl = asyncHandler(async (req, res) => {
  const { error } = ValidateCraeteComment(req.body);
  console.log(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const profile = await User.findById(req.user.id);

  const comment = await Comment.create({
    PostId: req.body.PostId,
    text: req.body.text,
    user: req.user.id,
    username: profile.username,
  });
  res.status(201).json(comment);
});



/**
 * @desc Get All Comments
 * @api api/comments
 * @method GET
 * @access private (Only Admin)
 */
module.exports.getCommentCtrl = asyncHandler(async (req, res) => {
  const comments = await Comment.find().populate("user");
  res.status(200).json(comments);
});
/**
 * @desc Delete  Comments
 * @api api/comments/:id
 * @method Delete
 * @access private (Only Admin and owner comment)
 */
module.exports.deletCommentCtrl = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment Not Found :)" });
    }
    if (req.user.isAdmin || req.user.id == comment.user.toString()) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Comment Deleted Succefully :(" });
    }else{
        res.status(400).json({ message: "Onlu Admins and Comment Owner Can Deleted" });

    }
  });
  /**
 * @desc UPdate  Comments
 * @api api/comments/:id
 * @method Update
 * @access private (owner comment)
 */
module.exports.updateCommentCtrl = asyncHandler(async (req, res) => {
  const { error } = ValidateUpdateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "Comment Not Found :)" });
  }
  if (req.user.id !== comment.user.toString()) {
    
    res.status(400).json({ message: "Only Owner of comment can updated :)" });
  }else{
    const updateComment = await Comment.findByIdAndUpdate(req.params.id,{
      $set:{
        text:req.body.text
      }
    },{new : true});
    
      res.status(201).json(updateComment);

  }
});