var express = require('express');
var router = express.Router();
const { stocks, addProduct, addedProduct, editProduct, editSubmit, productManage, productOffer, addProductOffer, sessionCheck, productDetails, ShowProductOffer } = require('../Controller/product_controller')
var multer = require('multer')
const { verifyUser } = require("../Controller/auth");
const {adminSessionCheck} = require('../Controller/admin_controller')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    cb(null, './public/Product-images')
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + '.jpg')
  }

})
const upload = multer({ storage: storage })



router.get('/stocks', adminSessionCheck,stocks)
router.get('/addProduct', adminSessionCheck, addProduct)
router.post('/addedProduct', upload.array('Image1', 4), adminSessionCheck, addedProduct)
router.get('/editProduct/:id', adminSessionCheck, editProduct)
router.post('/editProductSubmit/:id', upload.fields([
  { name: 'Image1', maxCount: 1 },
  { name: 'Image2', maxCount: 1 },
  { name: 'Image3', maxCount: 1 },
  { name: 'Image4', maxCount: 1 },

]),adminSessionCheck, editSubmit)
router.post('/deleteProduct/:id',adminSessionCheck, productManage)
router.get('/ProductOffer',adminSessionCheck, productOffer)
router.post('/addProductOffer', adminSessionCheck, addProductOffer)
router.get('/productDetails/:id', verifyUser, sessionCheck, productDetails)

module.exports = router;
