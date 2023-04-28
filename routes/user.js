var express = require('express');
var router = express.Router();
var user_helpers=require('../Controller/userController');

const {userLandingPage,userLoged,loginAndSignupButton,userRegistered,productDetails,sessionCheck,logout,nocache,loginRedirect,verifyLogin,shopButton,categoryFilter,addToCart,cartPage,changeQuantity,removeCartItem,proceedToCheckout,placeOrder,otpLogin,otpVerify,successOtpVerify,addToWishlist,wishlistPage,removeWishlistItem,verifyPayment,address,addAccount,addedAddress,getAddAddress,search,priceFilter,checkCoupon,editAccount,editedAddress,allCoupons,wallet,signupOtpVerification} = require('../Controller/userController');

const {verifyUser} = require('../Controller/auth')
/* GET home page. */

router.get('/',userLandingPage);
router.post('/userLogin',userLoged);
router.post('/userRegister',userRegistered)
router.get('/loginAndSignupButton',nocache,loginRedirect,loginAndSignupButton)
router.get('/productDetails/:id',verifyUser,sessionCheck,productDetails)
router.get('/logout', logout)
// router.get('/AddtoCart/:id',verifyLogin,AddtoCart)
router.get('/shopButton',verifyUser,sessionCheck,shopButton)
router.post('/categoryFilter',verifyUser,sessionCheck,categoryFilter)
router.get('/addToCart/:id',verifyUser,sessionCheck,addToCart)
router.get('/cartPage',verifyUser,sessionCheck,cartPage)
router.post('/changeProductQuantity',verifyUser, sessionCheck,changeQuantity)
router.post('/removeCartItem',verifyUser,sessionCheck,removeCartItem)
router.get('/proceedToCheckout',verifyUser,sessionCheck,proceedToCheckout)
router.post('/placeOrder',verifyUser,sessionCheck,placeOrder)
router.get('/otpLogin',otpLogin)
router.post('/otpVerify',otpVerify)
router.post('/successOtpVerify',successOtpVerify)


router.get('/addToWishlist/:id',verifyUser,sessionCheck,addToWishlist)
router.get('/wishlistPage',verifyUser,sessionCheck,wishlistPage)
router.post('/removeWishlistItem',verifyUser,sessionCheck,removeWishlistItem)

router.post('/verifyPayment',verifyUser,sessionCheck,verifyPayment)
router.get('/address',verifyUser,sessionCheck,address)
router.get('/addAccount',verifyUser,sessionCheck,addAccount)
router.post('/addedAddress',verifyUser,sessionCheck,addedAddress)
router.post('/getAddAddress',verifyUser,sessionCheck,getAddAddress)
router.post('/search',verifyUser,sessionCheck,search)
router.post('/priceFilter',verifyUser,sessionCheck,priceFilter)
router.post('/checkCoupon',verifyUser,sessionCheck,checkCoupon)
router.get('/editAccount',verifyUser,sessionCheck,editAccount)
router.post('/editedAddress/:id',verifyUser,sessionCheck,editedAddress)
router.get('/allCoupons',verifyUser,sessionCheck,allCoupons)
router.get('/wallet',verifyUser,sessionCheck,wallet)
router.post('/signupOtpVerification',signupOtpVerification)
module.exports = router;
