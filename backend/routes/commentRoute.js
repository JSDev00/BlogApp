const router = require('express').Router()
const { createCommentCtrl, getCommentCtrl, deletCommentCtrl, updateCommentCtrl } = require('../controllers/commentCtrl')
const verifyObjectId = require('../middlewares/verifyObjectId')
const { verifyToken, verifyTokenAndAdmin } = require('../middlewares/verifyToken')


//api/comments
router.route("/")
        .post(verifyToken,createCommentCtrl)
        .get(verifyTokenAndAdmin,getCommentCtrl)

//api/comments/:id
router.route('/:id')
                .delete(verifyObjectId,verifyToken,deletCommentCtrl)
                .put(verifyObjectId,verifyToken,updateCommentCtrl)
module.exports = router