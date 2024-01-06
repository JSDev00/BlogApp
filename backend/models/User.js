const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const Joi = require("joi");
const passwordComplexity = require('joi-password-complexity')

//create UserSchema

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 100,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
    },
    proileImg: {
      type: Object,
      default: {
        url: "https://sandcliffsales.com/static/assets/img/team/default-profile.png",
        publicId: null,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      default:null
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
  }
);

UserSchema.virtual("posts",{
  ref:"Post",
  foreignField:"user",
  localField:"_id"
})


// generateAuthToken
UserSchema.methods.generateAuthToken = function(){
  return jwt.sign({id:this._id,isAdmin:this.isAdmin},process.env.secretKey)
}
//User Model
const User = mongoose.model("User", UserSchema);

//Validate Register User
function ValidateRegisterUser(obj){
    const schema = Joi.object({
        username:Joi.string().min(2).max(100).required().trim(),
        email:Joi.string().min(5).max(100).required().trim().email(),
        password:passwordComplexity().required(),
    })
    return schema.validate(obj);
}
//Validate login User
function ValidateLoginUser(obj){
    const schema = Joi.object({
        email:Joi.string().min(5).max(100).required().trim().email(),
        password:Joi.string().required().trim(),
    })
    return schema.validate(obj);
}
//Validate Update User
function ValidateUpdateUser(obj){
    const schema = Joi.object({
      username:Joi.string().min(2).max(100).trim(),
      password:passwordComplexity(),
      bio:Joi.string().min(2).max(100).trim(),
    })
    return schema.validate(obj);
}

module.exports = { User  , ValidateRegisterUser , ValidateLoginUser , ValidateUpdateUser};
