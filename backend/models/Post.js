const mongoose = require("mongoose");
const Joi = require("joi");

//create Post Schema

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
    },
    category: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
  }
);
//relationship in mongoose
PostSchema.virtual("comments",{
  ref:"Comment",
  foreignField:"PostId",
  localField:"_id"
})

//Validate create Post

function validateCreatePost(obj){
    const schema = Joi.object({
        title:Joi.string().trim().min(2).max(100).required(),
        description:Joi.string().trim().min(10).required(),
        category:Joi.string().trim().required(),
    })
    return schema.validate(obj)
}
//Validate Update Post

function validateUpdatetePost(obj){
    const schema = Joi.object({
        title:Joi.string().trim().min(2).max(100),
        description:Joi.string().trim().min(10),
        category:Joi.string().trim(),
    })
    return schema.validate(obj)
}


const Post = mongoose.model("Post", PostSchema);

module.exports = {
    validateUpdatetePost,
    validateCreatePost,
    Post

}