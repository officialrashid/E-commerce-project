var express = require('express');
const { verifyUser } = require('../Controller/auth');
var router = express.Router();
const{Categorypage,addcategory,AddedCategory,EditCategory,EditCategorySubmit,DeleteCategory,categoryfilter,AddCategoryOffer}=require('../Controller/category_controller')

router.get('/Category',Categorypage)
router.get('/AddCategory',addcategory)
router.post('/AddedCategory',AddedCategory)
router.get('/EditCategory/:id',EditCategory)
router.post('/EditCategory-Submit/:id',EditCategorySubmit)
router.get('/DeleteCategory/:id',DeleteCategory)
router.post('/categoryfilter',verifyUser,categoryfilter)
router.post('/AddCategoryOffer',AddCategoryOffer)
module.exports = router;