var express = require('express');
const { verifyUser } = require('../Controller/auth');
var router = express.Router();
const { categoryPage, addCategory, addedCategory, editCategory, editCategorySubmit, deleteCategory, categoryFilter, addCategoryOffer } = require('../Controller/categoryController')
const {adminSessionCheck} = require('../Controller/adminController')
const{sessionCheck} = require('../Controller/userController')
router.get('/category',adminSessionCheck ,categoryPage)
router.get('/addCategory',adminSessionCheck ,addCategory)
router.post('/addedCategory', adminSessionCheck, addedCategory)
router.get('/editCategory/:id',adminSessionCheck, editCategory)
router.post('/editCategorySubmit/:id',adminSessionCheck, editCategorySubmit)
router.get('/deleteCategory/:id', adminSessionCheck, deleteCategory)
router.post('/categoryFilter', verifyUser, sessionCheck, categoryFilter)
router.post('/addCategoryOffer',adminSessionCheck, addCategoryOffer)
module.exports = router;