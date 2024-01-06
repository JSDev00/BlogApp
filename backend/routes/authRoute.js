const router = require("express").Router();
const { registerUserController, loginUser } = require("../controllers/authController");

//register new user with api/auth
router.post("/register", registerUserController);

//Login  user with api/auth
router.post("/login", loginUser);

module.exports =  router ;
