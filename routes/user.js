var express = require('express');
var router = express.Router();
var user_helpers=require('../Controller/user_controller');

const {userLandingPage,userLoged,loginAndSignupButton,userRegistered,productDetails,sessionCheck,logout,nocache,loginRedirect,verifyLogin,shopButton,categoryFilter,addToCart,cartPage,changeQuantity,removeCartItem,proceedToCheckout,placeOrder,otpLogin,otpVerify,successOtpVerify,addToWishlist,wishlistPage,removeWishlistItem,verifyPayment,address,addAccount,addedAddress,getAddAddress,search,priceFilter,checkCoupon,editAccount,editedAddress,allCoupons,wallet,signupOtpVerification} = require('../Controller/user_controller');

const {verifyUser} = require('../Controller/auth')
/* GET home page. */

router.get('/',userLandingPage);
router.post('/Userlogin',userLoged);
router.post('/UserRegister',userRegistered)
router.get('/LoginandSignupButton',nocache,loginRedirect,loginAndSignupButton)
router.get('/productDetails/:id',verifyUser,sessionCheck,productDetails)
router.get('/Logout', logout)
// router.get('/AddtoCart/:id',verifyLogin,AddtoCart)
router.get('/ShopButton',verifyUser,sessionCheck,shopButton)
router.post('/categoryfilter',verifyUser,sessionCheck,categoryFilter)
router.get('/Add-to-cart/:id',verifyUser,sessionCheck,addToCart)
router.get('/CartPage',verifyUser,sessionCheck,cartPage)
router.post('/change-product-quantity',verifyUser, sessionCheck,changeQuantity)
router.post('/remove_cartItem',verifyUser,sessionCheck,removeCartItem)
router.get('/proceedToCheckout',verifyUser,sessionCheck,proceedToCheckout)
router.post('/place-order',verifyUser,sessionCheck,placeOrder)
router.get('/OTPlogin',otpLogin)
router.post('/OTPVerify',otpVerify)
router.post('/SuccessOtpverify',successOtpVerify)


router.get('/Add-to-wishlist/:id',verifyUser,sessionCheck,addToWishlist)
router.get('/WishlistPage',verifyUser,sessionCheck,wishlistPage)
router.post('/remove_wishlistItem',verifyUser,sessionCheck,removeWishlistItem)

router.post('/verifypayment',verifyUser,sessionCheck,verifyPayment)
router.get('/Address',verifyUser,sessionCheck,address)
router.get('/add-account',verifyUser,sessionCheck,addAccount)
router.post('/AddedAddress',verifyUser,sessionCheck,addedAddress)
router.post('/getAddAddress',verifyUser,sessionCheck,getAddAddress)
router.post('/search',verifyUser,sessionCheck,search)
router.post('/priceFilter',verifyUser,sessionCheck,priceFilter)
router.post('/checkcoupon',verifyUser,sessionCheck,checkCoupon)
router.get('/edit-account',verifyUser,sessionCheck,editAccount)
router.post('/EditedAddress/:id',verifyUser,sessionCheck,editedAddress)
router.get('/AllCoupons',verifyUser,sessionCheck,allCoupons)
router.get('/Wallet',verifyUser,sessionCheck,wallet)
router.post('/signupOtpVerification',signupOtpVerification)
module.exports = router;
