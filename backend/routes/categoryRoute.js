const router = require('express').Router()
const { createCategoryCtrl ,getAllCategoryCtrl, deleteCategoryCtrl, getCategoryCountCtrl} = require('../controllers/categoryCtrl')
const verifyObjectId = require('../middlewares/verifyObjectId')
const { verifyTokenAndAdmin, verifyToken } = require('../middlewares/verifyToken')



router.route('/')
    .post(verifyTokenAndAdmin,createCategoryCtrl)
    .get(getAllCategoryCtrl)

router.route('/:id')
        .delete(verifyObjectId,verifyTokenAndAdmin,deleteCategoryCtrl)
router.route('/count')
        .get(verifyTokenAndAdmin,getCategoryCountCtrl)



        module.exports = router