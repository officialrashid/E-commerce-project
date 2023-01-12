var express = require('express');
var router = express.Router();
var user_helpers=require('../Controller/user_controller');

const {userlandingpage,userLoged,LoginandSignupButton,userRegistered,productDetails,sessioncheck,Logout,nocache,loginredirect,verifyLogin,ShopButton,categoryfilter,AddtoCart,CartPage,changequantity,removeCartItem,proceedToCheckout,PlaceOrder,UserOrderView,OrderCancel,OTPlogin,OTPVerify,SuccessOtpverify,userProductView,AddToWishlist,WishlistPage,removeWishlistItem,OrderDetails,verifypayment,Address,addaccount,AddedAddress,getAddAddress,search,priceFilter,checkcoupon,editaccount,EditedAddress} = require('../Controller/user_controller');
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
router.post('/place-order',sessioncheck,PlaceOrder)
router.get('/UserOrderView',sessioncheck,UserOrderView)
router.post('/OrderCancel/:id',OrderCancel)
router.get('/OTPlogin',OTPlogin)
router.post('/OTPVerify',OTPVerify)
router.post('/SuccessOtpverify',SuccessOtpverify)
router.get('/userProductView/:id',userProductView)
router.get('/Add-to-wishlist/:id',AddToWishlist)
router.get('/WishlistPage',sessioncheck,WishlistPage)
router.post('/remove_wishlistItem',removeWishlistItem)
router.get('/OrderDetails',OrderDetails)
router.post('/verifypayment',verifypayment)
router.get('/Address',sessioncheck,Address)
router.get('/add-account',sessioncheck,addaccount)
router.post('/AddedAddress',sessioncheck,AddedAddress)
router.get('/getAddAddress/:id',getAddAddress)
router.post('/search',search)
router.post('/priceFilter',priceFilter)
router.post('/checkcoupon',checkcoupon)
router.get('/edit-account',editaccount)
router.post('/EditedAddress/:id',sessioncheck,EditedAddress)
module.exports = router;
