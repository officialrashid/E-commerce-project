var express = require('express');
var router = express.Router();
const {Stocks,AddProduct,AddedProduct,editproduct,editsubmit,productManage,ProductOffer,AddProductOffer,sessioncheck,productDetails,ShowProductOffer}= require('../Controller/product_controller')
var multer=require('multer')
const {verifyUser}= require("../Controller/auth");
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
      
      cb(null,'./public/Product-images')
    },
    filename:(req,file,cb)=>{
      console.log(file);
      cb(null,Date.now()+ '-'+Math.round(Math.random()*1E9)+'.jpg')
    }
  
  })
    const upload=multer({storage:storage})



router.get('/Stocks',Stocks)
router.get('/AddProduct',AddProduct)
router.post('/AddedProduct',upload.array('Image1',4),AddedProduct)
router.get('/edit-pro/:id',editproduct)
router.post('/edit-product-submit/:id',upload.fields([
    {name:'Image1',maxCount:1},
    {name:'Image2',maxCount:1},
    {name:'Image3',maxCount:1},
    {name:'Image4',maxCount:1},
  
  ]),editsubmit)
router.post('/delete-pro/:id',productManage)
router.get('/ProductOffer',ProductOffer)
router.post('/AddProductOffer',AddProductOffer)
router.get('/productDetails/:id',verifyUser,sessioncheck,productDetails)

module.exports = router;
