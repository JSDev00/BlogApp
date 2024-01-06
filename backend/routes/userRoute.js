const router = require('express').Router()
const { getUsersProfile,getUserProfile,updateUserProfile, getUsersCount, uploadPhotoProfile, deleteUser } = require('../controllers/usersController');
const { verifyTokenAndAdmin ,verifyTokenAndUser,verifyTokenAuthorzation, verifyToken} = require('../middlewares/verifyToken');
const verifyObjectId = require('../middlewares/verifyObjectId');
const photoUpload = require('../middlewares/photoUpload');

//api/users/profile

router.route('/profile')
.get(verifyTokenAndAdmin,getUsersProfile);

//api/user/profile/:id
router.route('/profile/:id')
.get(verifyObjectId,getUserProfile)
.put(verifyObjectId,verifyTokenAndUser,updateUserProfile)
.delete(verifyObjectId,verifyTokenAuthorzation,deleteUser);



//api/users/upload
router.route('/profile/upload')
.post(verifyToken,photoUpload.single("image"),uploadPhotoProfile);

//getUsersCount
router.route('/count').get(verifyTokenAndAdmin,getUsersCount);

module.exports = router