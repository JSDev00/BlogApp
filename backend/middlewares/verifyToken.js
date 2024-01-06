const jwt = require('jsonwebtoken');

function verifyToken(req,res,next){
    const token = req.headers.authorization;
    if(token){
        const authToken = token.split(" ")[1];
    try {
        const decodToken = jwt.verify(authToken,process.env.secretKey);
        req.user = decodToken
        next();
    } catch (error) {
        return res.status(401).json({message:"Unautorized Token"})
    }        

    }else{
        return res.status(401).json({message:"No Token , access denied :)"})
    }
}
// VerfitTokenAndAdmin
function verifyTokenAndAdmin(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }else{
            return res.status(403).json({message:"Only Admins , not allowed"}) 
        }
    })
}
// verifyTokenAndUser
function verifyTokenAndUser(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id){
            next();
        }else{
            return res.status(403).json({message:"Only User himself can upate :)"}) 
        }
    })
}
// verifyTokenAndUser
function verifyTokenAuthorzation(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id ||req.user.isAdmin){
            next();
        }else{
            return res.status(403).json({message:"Only User himself can delete or admin :)"}) 
        }
    })
}
module.exports = {verifyToken,verifyTokenAndAdmin,verifyTokenAndUser,verifyTokenAuthorzation}