var express = require('express');
var router = express.Router();
var user_helpers=require('../Controller/user_controller');
const {verifyUser}= require("../Controller/auth");
const {userlandingpage,userLoged,LoginandSignupButton,userRegistered,productDetails,sessioncheck,Logout,nocache,loginredirect,verifyLogin,ShopButton,categoryfilter,AddtoCart,CartPage,changequantity,removeCartItem,proceedToCheckout,PlaceOrder,OTPlogin,OTPVerify,SuccessOtpverify,AddToWishlist,WishlistPage,removeWishlistItem,verifypayment,Address,addaccount,AddedAddress,getAddAddress,search,priceFilter,checkcoupon,editaccount,EditedAddress,AllCoupons,Wallet} = require('../Controller/user_controller');

/* GET home page. */

router.get('/',userlandingpage);
router.post('/Userlogin',userLoged);
router.post('/UserRegister',userRegistered)
router.get('/LoginandSignupButton',nocache,loginredirect,LoginandSignupButton)
router.get('/productDetails/:id',verifyUser,productDetails)
router.get('/Logout',Logout)
// router.get('/AddtoCart/:id',verifyLogin,AddtoCart)
router.get('/ShopButton',verifyUser,sessioncheck,ShopButton)
router.post('/categoryfilter',verifyUser,categoryfilter)
router.get('/Add-to-cart/:id',verifyUser,sessioncheck,AddtoCart)
router.get('/CartPage',verifyUser,sessioncheck,CartPage)
router.post('/change-product-quantity',changequantity)
router.post('/remove_cartItem',removeCartItem)
router.get('/proceedToCheckout',sessioncheck,proceedToCheckout)
router.post('/place-order',sessioncheck,PlaceOrder)
router.get('/OTPlogin',OTPlogin)
router.post('/OTPVerify',OTPVerify)
router.post('/SuccessOtpverify',SuccessOtpverify)


router.get('/Add-to-wishlist/:id',AddToWishlist)
router.get('/WishlistPage',sessioncheck,WishlistPage)
router.post('/remove_wishlistItem',removeWishlistItem)

router.post('/verifypayment',verifypayment)
router.get('/Address',sessioncheck,Address)
router.get('/add-account',sessioncheck,addaccount)
router.post('/AddedAddress',sessioncheck,AddedAddress)
router.post('/getAddAddress',getAddAddress)
router.post('/search',search)
router.post('/priceFilter',priceFilter)
router.post('/checkcoupon',checkcoupon)
router.get('/edit-account',editaccount)
router.post('/EditedAddress/:id',sessioncheck,EditedAddress)
router.get('/AllCoupons',sessioncheck,AllCoupons)
router.get('/Wallet',sessioncheck,Wallet)

module.exports = router;
