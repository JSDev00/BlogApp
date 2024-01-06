const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const {User,ValidateRegisterUser, ValidateLoginUser} = require('../models/User');
/**
 * @desc Register New User
 * @Router /api/auth/register
 * @method POST
 * @access public
 */


module.exports.registerUserController = asyncHandler(async(req,res)=>{
    //validaion
    const{error} = ValidateRegisterUser(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    //check if the user already exists in B
    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({message:'This User is already Exist :)'})
    }
    //hash password
    const salt = await  bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);
    //save to Database
    user = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashPassword,
    }) 
    await user.save();
    //return with success message
    return res.status(201).json({message:'Register successfully go to login page :)'})


})


/**
 * @desc Login User
 * @Router /api/auth/login
 * @method POST
 * @access public
 */
module.exports.loginUser = asyncHandler(async(req,res)=>{
    //Validtion
    const{error} = ValidateLoginUser(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    //User Exists
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).json({message:"Invalid Email or Password :)"})
    }
    //Compare Password
    const isPasswordMatch = await bcrypt.compare(req.body.password,user.password);
    if(!isPasswordMatch){
        return res.status(400).json({message:"Invalid Email or Password"})
    }
    //generate Token
    const token = user.generateAuthToken();
    //redirect to home Page
    return res.status(200).json({
        _id:user._id,
        isAdmin:user.isAdmin,
        proileImg:user.proileImg,
        token,
        username:user.username
    })

})
