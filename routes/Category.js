var express = require('express');
const { verifyUser } = require('../Controller/auth');
var router = express.Router();
const { categoryPage, addCategory, addedCategory, editCategory, editCategorySubmit, deleteCategory, categoryFilter, addCategoryOffer } = require('../Controller/category_controller')
const {adminSessionCheck} = require('../Controller/admin_controller')
const{sessionCheck} = require('../Controller/user_controller')
router.get('/Category',adminSessionCheck ,categoryPage)
router.get('/AddCategory',adminSessionCheck ,addCategory)
router.post('/AddedCategory', adminSessionCheck, addedCategory)
router.get('/EditCategory/:id',adminSessionCheck, editCategory)
router.post('/EditCategory-Submit/:id',adminSessionCheck, editCategorySubmit)
router.get('/DeleteCategory/:id', adminSessionCheck, deleteCategory)
router.post('/categoryfilter', verifyUser, sessionCheck, categoryFilter)
router.post('/AddCategoryOffer',adminSessionCheck, addCategoryOffer)
module.exports = router;