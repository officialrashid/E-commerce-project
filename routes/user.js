var express = require('express');
var router = express.Router();
var user_helpers=require('../Controller/user_controller');
const {userlandingpage,userLoged,LoginandSignupButton,userRegistered,productDetails,sessioncheck,Logout,nocache,loginredirect,verifyLogin,ShopButton,categoryfilter,AddtoCart,CartPage,changequantity,removeCartItem,proceedToCheckout,PlaceOrder,UserOrderView,OrderCancel} = require('../Controller/user_controller');
/* GET home page. */

router.get('/',userlandingpage);
router.post('/Userlogin',userLoged);
router.post('/UserRegister',userRegistered)
router.get('/LoginandSignupButton',nocache,loginredirect,LoginandSignupButton)
router.get('/productDetails/:id',sessioncheck,productDetails)
router.get('/Logout',Logout)
// router.get('/AddtoCart/:id',verifyLogin,AddtoCart)
router.get('/ShopButton',ShopButton)
router.post('/categoryfilter',categoryfilter)
router.get('/Add-to-cart/:id',sessioncheck,AddtoCart)
router.get('/CartPage',sessioncheck,CartPage)
router.post('/change-product-quantity',changequantity)
router.post('/remove_cartItem',removeCartItem)
router.get('/proceedToCheckout',sessioncheck,proceedToCheckout)
router.post('/place-order/:id',sessioncheck,PlaceOrder)
router.get('/UserOrderView',sessioncheck,UserOrderView)
router.post('/OrderCancel/:id',OrderCancel)
module.exports = router;
