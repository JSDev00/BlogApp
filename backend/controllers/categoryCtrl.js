const asyncHandler = require('express-async-handler');
const { ValidateCraeteCategory, Category } = require('../models/Category');


/**
 * @desc create category
 * @api api/categoies
 * @method POST
 * @access only admins
 */
module.exports.createCategoryCtrl = asyncHandler(async(req,res)=>{
    const{error} = ValidateCraeteCategory(req.body)
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }

    const createCategory = await Category.create({
        title:req.body.title,
        user:req.user.id,
    })
    res.status(201).json(createCategory)
})
/**
 * @desc get category
 * @api api/categoies
 * @method GET
 * @access public
 */
module.exports.getAllCategoryCtrl = asyncHandler(async(req,res)=>{
   
    const categories = await Category.find();
    res.status(200).json(categories)
})
/**
 * @desc delete category
 * @api api/categoy/:id
 * @method DELETE
 * @access private (only admins)
 */
module.exports.deleteCategoryCtrl = asyncHandler(async(req,res)=>{
    const category = await Category.findById(req.params.id)
    if(!category){
        return res.status(404).json({message:"Sorry This category not found:("})
    }

    await Category.findByIdAndDelete(req.params.id)

    res.status(201).json({message:"Category Deleted Succefully :)",categoryId: category._id})
})
/**
 * @desc get category count
 * @api api/categoy
 * @method GET
 * @access private (only admins)
 */
module.exports.getCategoryCountCtrl = asyncHandler(async(req,res)=>{
   
    const categories = await Category.find().countDocuments();
    res.status(200).json(categories)
})