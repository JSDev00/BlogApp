const mongoose = require('mongoose')
const Joi = require('joi')


//Comment Schema 

const CategorySchema = new mongoose.Schema({
 
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true,
        trim: true,
    },
},{timestamps:true})

//Comment Model
const Category = mongoose.model('Category',CategorySchema);

//Validate Create Category

function ValidateCraeteCategory(obj){
    const schema = Joi.object({
        title: Joi.string().trim().required()
    })
    return schema.validate(obj);
}


module.exports = {
    Category,
    ValidateCraeteCategory,
}