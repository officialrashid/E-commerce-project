var express = require('express');
const { verifyUser } = require('../Controller/auth');
var router = express.Router();
const { categoryPage, addCategory, addedCategory, editCategory, editCategorySubmit, deleteCategory, categoryFilter, addCategoryOffer } = require('../Controller/category_controller')

router.get('/Category', categoryPage)
router.get('/AddCategory', addCategory)
router.post('/AddedCategory', addedCategory)
router.get('/EditCategory/:id', editCategory)
router.post('/EditCategory-Submit/:id', editCategorySubmit)
router.get('/DeleteCategory/:id', deleteCategory)
router.post('/categoryfilter', verifyUser, categoryFilter)
router.post('/AddCategoryOffer', addCategoryOffer)
module.exports = router;