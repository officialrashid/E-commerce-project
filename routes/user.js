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
router.get('/productDetails/:id',verifyUser,sessioncheck,productDetails)
router.get('/Logout',Logout)
// router.get('/AddtoCart/:id',verifyLogin,AddtoCart)
router.get('/ShopButton',verifyUser,sessioncheck,ShopButton)
router.post('/categoryfilter',verifyUser,categoryfilter)
router.get('/Add-to-cart/:id',verifyUser,sessioncheck,AddtoCart)
router.get('/CartPage',verifyUser,sessioncheck,CartPage)
router.post('/change-product-quantity',verifyUser,changequantity)
router.post('/remove_cartItem',verifyUser,removeCartItem)
router.get('/proceedToCheckout',verifyUser,sessioncheck,proceedToCheckout)
router.post('/place-order',verifyUser,sessioncheck,PlaceOrder)
router.get('/OTPlogin',OTPlogin)
router.post('/OTPVerify',OTPVerify)
router.post('/SuccessOtpverify',SuccessOtpverify)


router.get('/Add-to-wishlist/:id',verifyUser,AddToWishlist)
router.get('/WishlistPage',verifyUser,sessioncheck,WishlistPage)
router.post('/remove_wishlistItem',verifyUser,removeWishlistItem)

router.post('/verifypayment',verifyUser,verifypayment)
router.get('/Address',verifyUser,sessioncheck,Address)
router.get('/add-account',verifyUser,sessioncheck,addaccount)
router.post('/AddedAddress',verifyUser,sessioncheck,AddedAddress)
router.post('/getAddAddress',verifyUser,getAddAddress)
router.post('/search',search)
router.post('/priceFilter',verifyUser,priceFilter)
router.post('/checkcoupon',verifyUser,checkcoupon)
router.get('/edit-account',verifyUser,editaccount)
router.post('/EditedAddress/:id',verifyUser,sessioncheck,EditedAddress)
router.get('/AllCoupons',verifyUser,sessioncheck,AllCoupons)
router.get('/Wallet',verifyUser,sessioncheck,Wallet)

module.exports = router;
