var express = require('express');
var router = express.Router();
const { stocks, addProduct, addedProduct, editProduct, editSubmit, productManage, productOffer, addProductOffer, sessionCheck, productDetails, ShowProductOffer } = require('../Controller/product_controller')
var multer = require('multer')
const { verifyUser } = require("../Controller/auth");
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



router.get('/Stocks', stocks)
router.get('/AddProduct', addProduct)
router.post('/AddedProduct', upload.array('Image1', 4), addedProduct)
router.get('/edit-pro/:id', editProduct)
router.post('/edit-product-submit/:id', upload.fields([
  { name: 'Image1', maxCount: 1 },
  { name: 'Image2', maxCount: 1 },
  { name: 'Image3', maxCount: 1 },
  { name: 'Image4', maxCount: 1 },

]), editSubmit)
router.post('/delete-pro/:id', productManage)
router.get('/ProductOffer', productOffer)
router.post('/AddProductOffer', addProductOffer)
router.get('/productDetails/:id', verifyUser, sessionCheck, productDetails)

module.exports = router;
