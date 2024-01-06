const mongoose = require('mongoose')
const Joi = require('joi')


//Comment Schema 

const CommentSchema = new mongoose.Schema({
    PostId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    username:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    }
},{timestamps:true})

//Comment Model
const Comment = mongoose.model('Comment',CommentSchema);

//Validate Create Comment

function ValidateCraeteComment(obj){
    const schema = Joi.object({
        PostId: Joi.string().required(),
        text: Joi.string().required(),
    })
    return schema.validate(obj)
}

function ValidateUpdateComment(obj){
    const schema = Joi.object({
        text: Joi.string(),
    })
    return schema.validate(obj)
}

module.exports = {
    Comment,
    ValidateCraeteComment,
    ValidateUpdateComment
}