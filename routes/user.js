var express = require('express');
var router = express.Router();
var user_helpers=require('../Controller/user_controller');

const {userLandingPage,userLoged,loginAndSignupButton,userRegistered,productDetails,sessionCheck,logout,nocache,loginRedirect,verifyLogin,shopButton,categoryFilter,addToCart,cartPage,changeQuantity,removeCartItem,proceedToCheckout,placeOrder,otpLogin,otpVerify,successOtpVerify,addToWishlist,wishlistPage,removeWishlistItem,verifyPayment,address,addAccount,addedAddress,getAddAddress,search,priceFilter,checkCoupon,editAccount,editedAddress,allCoupons,wallet} = require('../Controller/user_controller');
/* GET home page. */

router.get('/',userLandingPage);
router.post('/Userlogin',userLoged);
router.post('/UserRegister',userRegistered)
router.get('/LoginandSignupButton',nocache,loginRedirect,loginAndSignupButton)
router.get('/productDetails/:id',sessionCheck,productDetails)
router.get('/Logout', logout)
// router.get('/AddtoCart/:id',verifyLogin,AddtoCart)
router.get('/ShopButton',sessionCheck,shopButton)
router.post('/categoryfilter',categoryFilter)
router.get('/Add-to-cart/:id',sessionCheck,addToCart)
router.get('/CartPage',sessionCheck,cartPage)
router.post('/change-product-quantity',changeQuantity)
router.post('/remove_cartItem',removeCartItem)
router.get('/proceedToCheckout',sessionCheck,proceedToCheckout)
router.post('/place-order',sessionCheck,placeOrder)
router.get('/OTPlogin',otpLogin)
router.post('/OTPVerify',otpVerify)
router.post('/SuccessOtpverify',successOtpVerify)


router.get('/Add-to-wishlist/:id',addToWishlist)
router.get('/WishlistPage',sessionCheck,wishlistPage)
router.post('/remove_wishlistItem',removeWishlistItem)

router.post('/verifypayment',verifyPayment)
router.get('/Address',sessionCheck,address)
router.get('/add-account',sessionCheck,addAccount)
router.post('/AddedAddress',sessionCheck,addedAddress)
router.post('/getAddAddress',getAddAddress)
router.post('/search',search)
router.post('/priceFilter',priceFilter)
router.post('/checkcoupon',checkCoupon)
router.get('/edit-account',editAccount)
router.post('/EditedAddress/:id',sessionCheck,editedAddress)
router.get('/AllCoupons',sessionCheck,allCoupons)
router.get('/Wallet',sessionCheck,wallet)

module.exports = router;
