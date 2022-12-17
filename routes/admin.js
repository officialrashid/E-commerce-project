var express = require('express');
var router = express.Router();
const {adminlogin,adminRegisterd,AllUsers,Stocks,AddProduct,AddedProduct,editproduct,editsubmit,deleteproduct,Categorypage,addcategory,EditCategory,EditCategorySubmit,DeleteCategory,blockmanagement}=require('../Controller/admin_controller')


/* GET users listing. */
router.get('/',adminlogin);
 router.post('/adminLoged',adminRegisterd)
router.get('/AllUsers',AllUsers)
router.get('/Stocks',Stocks)
router.get('/AddProduct',AddProduct)
router.post('/AddedProduct',AddedProduct)
router.get('/edit-pro/:id',editproduct)
router.post('/edit-product-submit/:id',editsubmit)
router.get('/delete-pro/:id',deleteproduct)
router.get('/Category',Categorypage)
router.post('/addcategory',addcategory)
router.get('/EditCategory/:id',EditCategory)
router.post('/EditCategory-Submit/:id',EditCategorySubmit)
router.get('/DeleteCategory/:id',DeleteCategory)
router.post('/Block/:id',blockmanagement)
module.exports = router;
